Feature: Playwright site

    lh lkj kjh kjh kjh kjh 

    @1001
    Scenario: Check title
        Given I open url "https://playwright.dev"
        When I click link "Get started"
        # kj kjh kj
        Then I see in title "Playwright"
		
    @1002
    Scenario Outline: sadsdada
        Given we open '<Header1>' using '<Header 2>'
    Examples:
        | Header1 | Header 2 | Header3 |
        | Value 1 | Value 2 | Value 3 |
        | Value 2 | Value 22 | Value 33 |
        | Value 3 | Value 22 | Value 33 |

    @1003
    Scenario: Check ABC emergency @1003
        Given I open url "https://abc.net.au/emergency"
        When I search for "Melbourne"
        Then I see in title "Search results"
        # Then go to first incident

