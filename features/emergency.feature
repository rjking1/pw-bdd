@emergency
Feature: ABC emergency site

    put emergency in sep feature file as slow to run

    @4001
    Scenario: Check ABC emergency in vic
        Given I open url "https://abc.net.au/emergency"
        When I search for "Melbourne"
        Then I see in title "Search results"
        # Then go to first incident

    @4002
    Scenario: Check ABC emergency in nsw
        Given I open url "https://abc.net.au/emergency"
        When I search for "Sydney"
        Then I see in title "Search results"

    @4003
    Scenario: Check ABC emergency in sa
        Given I open url "https://abc.net.au/emergency"
        When I search for "Adelaide"
        Then I see in title "Search results"
        And take a full screen shot of "Adelaide"

