"use strict";
/**
 * Generate test code.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFile = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const formatter = __importStar(require("./formatter"));
const i18n_1 = require("./i18n");
const loadSteps_1 = require("../cucumber/loadSteps");
const createBdd_1 = require("../run/createBdd");
const testTypeImpl_1 = require("../playwright/testTypeImpl");
const tags_1 = require("./tags");
class TestFile {
    constructor(options) {
        this.options = options;
        this.lines = [];
        this.testFileTags = new tags_1.TestFileTags();
    }
    get sourceFile() {
        const { uri } = this.options.doc;
        if (!uri)
            throw new Error(`Document without uri`);
        return uri;
    }
    get content() {
        return this.lines.join('\n');
    }
    get language() {
        return this.options.doc.feature?.language || 'en';
    }
    get config() {
        return this.options.config;
    }
    get outputPath() {
        if (!this._outputPath) {
            const relativeSourceFile = node_path_1.default.isAbsolute(this.sourceFile)
                ? node_path_1.default.relative(process.cwd(), this.sourceFile)
                : this.sourceFile;
            // remove ".." to keep all generated files in outputDir
            const finalPath = relativeSourceFile
                .split(node_path_1.default.sep)
                .filter((part) => part !== '..')
                .join(node_path_1.default.sep);
            this._outputPath = node_path_1.default.join(this.config.outputDir, `${finalPath}.spec.js`);
        }
        return this._outputPath;
    }
    build() {
        this.loadI18nKeywords();
        this.lines = [
            ...this.getFileHeader(),
            ...this.getRootSuite(),
            ...this.getTagsFixture(),
        ];
        return this;
    }
    save() {
        const dir = node_path_1.default.dirname(this.outputPath);
        if (!node_fs_1.default.existsSync(dir))
            node_fs_1.default.mkdirSync(dir, { recursive: true });
        node_fs_1.default.writeFileSync(this.outputPath, this.content);
    }
    getFileHeader() {
        const importTestFrom = this.getRelativeImportTestFrom();
        return formatter.fileHeader(this.sourceFile, importTestFrom);
    }
    loadI18nKeywords() {
        if (this.language !== 'en') {
            this.keywordsMap = (0, i18n_1.getKeywordsMap)(this.language);
        }
    }
    getRelativeImportTestFrom() {
        const { importTestFrom } = this.config;
        if (!importTestFrom)
            return;
        const { file, varName } = importTestFrom;
        const dir = node_path_1.default.dirname(this.outputPath);
        return {
            file: node_path_1.default.relative(dir, file),
            varName,
        };
    }
    getTagsFixture() {
        return formatter.tagsFixture(this.testFileTags.tagsMap, tags_1.TEST_KEY_SEPARATOR);
    }
    getRootSuite() {
        const { feature } = this.options.doc;
        if (!feature)
            throw new Error(`Document without feature.`);
        return this.getSuite(feature);
    }
    /**
     * Generate test.describe suite for root Feature or Rule
     */
    getSuite(feature, parents = []) {
        const flags = (0, tags_1.getFormatterFlags)(feature);
        const lines = [];
        const newParents = [...parents, feature];
        feature.children.forEach((child) => lines.push(...this.getSuiteChild(child, newParents)));
        return formatter.suite(`${feature.name} ${feature.tags}`, lines, flags);
    }
    getSuiteChild(child, parents) {
        if ('rule' in child && child.rule)
            return this.getSuite(child.rule, parents);
        if (child.background)
            return this.getBeforeEach(child.background);
        if (child.scenario)
            return this.getScenarioLines(child.scenario, parents);
        throw new Error(`Empty child: ${JSON.stringify(child)}`);
    }
    getScenarioLines(scenario, parents) {
        return isOutline(scenario)
            ? this.getOutlineSuite(scenario, parents)
            : this.getTest(scenario, parents);
    }
    /**
     * Generate test.beforeEach for Background
     */
    getBeforeEach(bg) {
        const { fixtures, lines } = this.getSteps(bg);
        return formatter.beforeEach(fixtures, lines);
    }
    /**
     * Generate test.describe suite for Scenario Outline
     */
    getOutlineSuite(scenario, parents) {
        const lines = [];
        const flags = (0, tags_1.getFormatterFlags)(scenario);
        const newParents = [...parents, scenario];
        let exampleIndex = 0;
        scenario.examples.forEach((examples) => {
            examples.tableBody.forEach((exampleRow) => {
                lines.push(...this.getOutlineTest(
                // prettier-ignore
                scenario, examples, exampleRow, ++exampleIndex, newParents));
            });
        });
        // console.info(this.testFileTags.getTestTags(newParents, scenario.tags));
        const tags = this.testFileTags.getTestTags(newParents, scenario.tags).join(" ");
        return formatter.suite(`${scenario.name} ${tags}`, lines, flags);
    }
    /**
     * Generate test from Examples row
     */
    // eslint-disable-next-line max-params
    getOutlineTest(scenario, examples, exampleRow, exampleIndex, parents) {
        const flags = (0, tags_1.getFormatterFlags)(examples);
        const title = `Example #${exampleIndex}`;
        this.testFileTags.registerTestTags(parents, title, examples.tags);
        const { fixtures, lines } = this.getSteps(scenario, exampleRow.id);
        // console.info(this.testFileTags.getTestTags(parents, examples.tags));
        const tags = this.testFileTags.getTestTags(parents, examples.tags).join(" ");
        return formatter.test(`${title} ${tags}`, fixtures, lines, flags);
    }
    /**
     * Generate test from Scenario
     */
    getTest(scenario, parents) {
        this.testFileTags.registerTestTags(parents, scenario.name, scenario.tags);
        const flags = (0, tags_1.getFormatterFlags)(scenario);
        const { fixtures, lines } = this.getSteps(scenario);
        // console.info(this.testFileTags.getTestTags(parents, scenario.tags));
        const tags = this.testFileTags.getTestTags(parents, scenario.tags).join(" ");
        return formatter.test(`${scenario.name} ${tags}`, fixtures, lines, flags);
    }
    getSteps(scenario, outlineExampleRowId) {
        const fixtures = new Set();
        const lines = scenario.steps.map((step) => {
            const pickleStep = this.getPickleStep(step, outlineExampleRowId);
            const stepDefinition = (0, loadSteps_1.findStepDefinition)(this.options.supportCodeLibrary, pickleStep.text, this.sourceFile);
            const { keyword, fixtures: stepFixtures, line, } = this.getStep(step, pickleStep, stepDefinition);
            fixtures.add(keyword);
            stepFixtures.forEach((fixture) => fixtures.add(fixture));
            return line;
        });
        return { fixtures, lines };
    }
    getStep(step, { text, argument }, stepDefinition) {
        const keyword = this.getKeyword(step);
        const code = stepDefinition.code;
        const fixtures = (0, createBdd_1.getFixtureNames)(code);
        this.updateCustomTest(code);
        const line = formatter.step(keyword, text, argument, fixtures);
        return { keyword, fixtures, line };
    }
    getPickleStep(step, outlineExampleRowId) {
        for (const pickle of this.options.pickles) {
            const pickleStep = pickle.steps.find(({ astNodeIds }) => {
                const hasStepId = astNodeIds.includes(step.id);
                const hasRowId = !outlineExampleRowId || astNodeIds.includes(outlineExampleRowId);
                return hasStepId && hasRowId;
            });
            if (pickleStep)
                return pickleStep;
        }
        throw new Error(`Pickle step not found for step: ${step.text}`);
    }
    getKeyword(step) {
        const origKeyword = step.keyword.trim();
        if (origKeyword === '*')
            return 'And';
        if (!this.keywordsMap)
            return origKeyword;
        const enKeyword = this.keywordsMap.get(origKeyword);
        if (!enKeyword)
            throw new Error(`Keyword not found: ${origKeyword}`);
        return enKeyword;
    }
    updateCustomTest({ customTest }) {
        if (!customTest || customTest === this.customTest)
            return;
        if (!this.customTest || (0, testTypeImpl_1.isParentChildTest)(this.customTest, customTest)) {
            this.customTest = customTest;
        }
        // todo: customTests are mix of different fixtures -> error?
    }
}
exports.TestFile = TestFile;
function isOutline(scenario) {
    return scenario.keyword === 'Scenario Outline' || scenario.keyword === 'Scenario Template';
}
//# sourceMappingURL=testFile.js.map