export default {
  paths: [ 'features/**/*.feature' ], 
  import: [ 'features/steps/**/*.{ts,js}' ],
  // uncomment if using TypeScript
  requireModule: ['ts-node/register'],
  publishQuiet: true,
};
