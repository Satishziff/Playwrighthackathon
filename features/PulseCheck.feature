Feature: PulseCheck Application Requirements

  As a user of PulseCheck
  I want to perform role-specific actions
  So that I can manage organizations, groups, and submit pulse surveys

  @SuperAdmin
  Scenario: Super Admin creates a new Tenant
    Given I am logged in as a Super Admin
    When I create a new Tenant with name "Acme Corp" and email "admin@acmecorp.com"
    Then I should see "Acme Corp" in the tenant list

  @SuperAdmin
  Scenario: Super Admin cannot access tenant data
    Given I am logged in as a Super Admin
    When I attempt to access the data for tenant "Acme Corp"
    Then I should be denied access with "Access Denied"

  @SuperAdmin
  Scenario: Global configuration applies across tenants
    Given I am logged in as a Super Admin
    When I update the global configuration to "Custom Value"
    Then the global configuration should be "Custom Value" for all tenants

  @SuperAdmin
  Scenario: Tenant deletion removes associated data
    Given I am logged in as a Super Admin
    And a tenant "Acme Corp" exists
    When I delete the tenant "Acme Corp"
    Then I should not see "Acme Corp" in the tenant list

  @OrgAdmin
  Scenario: Org Admin creates a group
    Given I am logged in as an Org Admin
    When I create a group "Engineering" and assign "John Doe" as Group Admin
    Then I should see the group "Engineering" in my organization

  @OrgAdmin
  Scenario: Org Admin defines global baseline attributes
    Given I am logged in as an Org Admin
    When I define a global baseline attribute "Collaboration"
    Then "Collaboration" should appear in all group surveys

  @OrgAdmin
  Scenario: Org Admin views organization dashboard
    Given I am logged in as an Org Admin
    When I navigate to the Org Dashboard
    Then I should see the Pulse Index, Group Heatmap, and Submission Rate

  @GroupAdmin
  Scenario: Group Admin views group dashboard
    Given I am logged in as a Group Admin
    When I navigate to the Group Dashboard
    Then I should see the Team Pulse Timeline, Radar Chart, and Narrative Feed

  @GroupAdmin
  Scenario: Group Admin creates a custom attribute with weight 0
    Given I am logged in as a Group Admin
    When I create a custom attribute "Internal Tooling" of type "Scale" with weight 0
    Then I should see "Internal Tooling" in the custom attributes list

  @TeamMember
  Scenario: Team Member submits daily pulse
    Given I am logged in as a Team Member
    When I submit a pulse survey with the following scores:
      | attribute       | score |
      | Happiness       | 8     |
      | Energy          | 7     |
      | Satisfaction    | 9     |
      | Stress          | 3     |
      | Purpose         | 8     |
    And I provide feedback "Feeling productive today!"
    Then my pulse submission should be recorded in my local history

  @TeamMember
  Scenario: Team Member views personal sentiment timeline
    Given I am logged in as a Team Member
    When I view my personal dashboard
    Then I should see my sentiment timeline for the last 7 days

  @Anonymity
  Scenario: Pulse submission is anonymous
    Given I am logged in as a Team Member
    When I submit my pulse survey
    Then the server should receive an anonymous record with fuzzed date and no user ID

  @Calculations
  Scenario: Pulse Index calculation for high scores
    Given I am logged in as a Team Member
    When I submit a pulse survey with maximum scores for all positive attributes
    Then my individual Pulse Index should be approximately 90 or higher
