Feature: Check login page

  Scenario: Check login page
    Given Go to login page
    Then I could see input line
    When I input username and pass
    When I click the login button