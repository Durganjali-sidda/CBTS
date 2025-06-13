from django.contrib.auth import get_user_model
from tracker.models import Project, Team, Bug
from django.utils.timezone import now

User = get_user_model()

# Wipe old data (optional for dev seeding)
Bug.objects.all().delete()
Team.objects.all().delete()
Project.objects.all().delete()
User.objects.all().delete()

# -----------------------------
# Create Users by Role
# -----------------------------

# Product Managerspm_john@example.com
pm_john = User.objects.create_user(username='pm_john', email='', password='pm1234', role='product_manager', is_staff=True)

# Engineering Managers
eng_susan = User.objects.create_user(username='eng_susan', email='eng_susan@example.com', password='eng1234', role='engineering_manager', is_staff=True)

# Team Leads
lead_amy = User.objects.create_user(username='lead_amy', email='lead_amy@example.com', password='lead1234', role='team_lead')
lead_brian = User.objects.create_user(username='lead_brian', email='lead_brian@example.com', password='lead1234', role='team_lead')

# Developers
dev_mike = User.objects.create_user(username='dev_mike', email='dev_mike@example.com', password='dev1234', role='developer')
dev_sara = User.objects.create_user(username='dev_sara', email='dev_sara@example.com', password='dev1234', role='developer')

# Testers
tester_emma = User.objects.create_user(username='tester_emma', email='tester_emma@example.com', password='test1234', role='tester')
tester_raj = User.objects.create_user(username='tester_raj', email='tester_raj@example.com', password='test1234', role='tester')

# Customers
cust_bob = User.objects.create_user(username='cust_bob', email='cust_bob@example.com', password='cust1234', role='customer')
cust_anna = User.objects.create_user(username='cust_anna', email='cust_anna@example.com', password='cust1234', role='customer')

# -----------------------------
# Create Projects
# -----------------------------

project_alpha = Project.objects.create(name="Bug Tracker Alpha", description="Initial phase of bug tracking system.", manager=pm_john)
project_beta = Project.objects.create(name="Bug Tracker Beta", description="Second version with analytics.", manager=pm_john)

# -----------------------------
# Create Teams
# -----------------------------

team_alpha = Team.objects.create(name="Alpha Team", lead=lead_amy, project=project_alpha)
team_beta = Team.objects.create(name="Beta Team", lead=lead_brian, project=project_beta)

# Assign users to teams
lead_amy.team = team_alpha
dev_mike.team = team_alpha
tester_emma.team = team_alpha

lead_amy.save()
dev_mike.save()
tester_emma.save()

lead_brian.team = team_beta
dev_sara.team = team_beta
tester_raj.team = team_beta

lead_brian.save()
dev_sara.save()
tester_raj.save()

# -----------------------------
# Create Bugs
# -----------------------------

bugs = [
    # Alpha Project Bugs
    {
        "title": "Login crashes on special characters",
        "description": "App crashes when user inputs '%%%' in username.",
        "status": "open",
        "priority": "critical",
        "reported_by": tester_emma,
        "assigned_to": dev_mike,
        "project": project_alpha,
        "team": team_alpha,
    },
    {
        "title": "Password reset email not sent",
        "description": "No email received after clicking 'Forgot Password'.",
        "status": "in_progress",
        "priority": "high",
        "reported_by": cust_bob,
        "assigned_to": dev_mike,
        "project": project_alpha,
        "team": team_alpha,
    },
    {
        "title": "Incorrect role redirection",
        "description": "Testers redirected to admin dashboard.",
        "status": "resolved",
        "priority": "medium",
        "reported_by": tester_emma,
        "assigned_to": dev_mike,
        "project": project_alpha,
        "team": team_alpha,
    },

    # Beta Project Bugs
    {
        "title": "Analytics chart not loading",
        "description": "Project insights chart returns 500 error.",
        "status": "open",
        "priority": "high",
        "reported_by": tester_raj,
        "assigned_to": dev_sara,
        "project": project_beta,
        "team": team_beta,
    },
    {
        "title": "User invite email has typo",
        "description": "Subject line has spelling mistake in invite email.",
        "status": "open",
        "priority": "low",
        "reported_by": cust_anna,
        "assigned_to": dev_sara,
        "project": project_beta,
        "team": team_beta,
    },
    {
        "title": "Session timeout too short",
        "description": "Users are logged out after just 1 minute of inactivity.",
        "status": "in_progress",
        "priority": "medium",
        "reported_by": tester_raj,
        "assigned_to": dev_sara,
        "project": project_beta,
        "team": team_beta,
    },
]

for bug_data in bugs:
    Bug.objects.create(**bug_data)

print("✅ Seed data successfully inserted!")
