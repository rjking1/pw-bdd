Feature: Playwright site

    lh lkj kjh kjh kjh kjh 

    @1001
    Scenario: Check title
        Given I open url "https://playwright.dev"
        When I click link "Get started"
        # comment test
        Then I see in title "Playwright"
		
    @1002
    Scenario Outline: test scenario outline
        Given I open url "https://playwright.dev"
        When we open '<Header1>' using '<Header 2>'
    Examples:
        | Header1 | Header 2 | Header3 |
            | Value 1 | Value 2 | Value 3 |
            | Value a | Value b | Value c |

    @1003
    Scenario: test data table
        Given I open url "https://playwright.dev"
        When I do these actions
        | action 0 |
        | action 1 |
        | action 2 |
        Then I should see somedebg output

    @1004
    Scenario: Check ABC emergency
        Given I open url "https://abc.net.au/emergency"
        When I search for "Melbourne"
        Then I see in title "Search results"
        # Then go to first incident

