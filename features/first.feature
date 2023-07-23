@pw
Feature: Playwright site

    npx bddgen && npx playwright test

    Background: Background test
        Given I open url "https://playwright.dev"

    @2001
    Scenario: Check title
        When I click link "Get started"
        # comment test
        Then I see in title "Playwright"
		
    @2002
    Scenario Outline: test scenario outline
        When we open '<Header1>' using '<Header 2>'
    @2002.1
    Examples:
        | Header1 | Header 2 | Header3 |
        | Value 1 | Value 2 | Value 3 |
    @2002.2 @focus
    Examples:
        | Header1 | Header 2 | Header3 |
        | Value a | Value b  | Value c |
    @2002.3
    Examples:
        | Header1 | Header 2 | Header3 |
        | Value x | Value y  | Value z |

    @2003
    Scenario: test data table
        When I do these actions
        | action 0 |
        | action 1 |
        | action 2 |
        Then I should see some debug output
