Feature: ABC emergency site

    put emergency in sep feature file as slow to run

    @emergency
    Scenario: Check ABC emergency
        Given I open url "https://abc.net.au/emergency"
        When I search for "Melbourne"
        Then I see in title "Search results"
        # Then go to first incident

