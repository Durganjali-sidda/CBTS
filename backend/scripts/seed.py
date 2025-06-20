import os
import sys
import django

# Setup Django
sys.path.append('/app')  # Django project root
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cbts.settings')
django.setup()

from django.contrib.auth import get_user_model
from tracker.models import Project, Team, Bug
from django.utils.timezone import now

User = get_user_model()

# --- Wipe old data ---
Bug.objects.all().delete()
Team.objects.all().delete()
Project.objects.all().delete()
User.objects.all().delete()

# --- Create Users by Role ---
Durga      = User.objects.create_user('Durga',      'durga@gmai.com',      'lulumall1234',     role='admin',      is_staff=True)
pm_john      = User.objects.create_user('pm_john',      'pm_john@example.com',      'pm1234',     role='product_manager',      is_staff=True)
eng_susan    = User.objects.create_user('eng_susan',    'eng_susan@example.com',    'eng1234',    role='engineering_manager', is_staff=True)

# Team Managers
tm_alice     = User.objects.create_user('tm_alice',     'tm_alice@example.com',     'team1234',  role='team_manager')
tm_bob       = User.objects.create_user('tm_bob',       'tm_bob@example.com',       'team1234',  role='team_manager')

# Team Leads
lead_amy     = User.objects.create_user('lead_amy',     'lead_amy@example.com',     'lead1234',  role='team_lead')
lead_brian   = User.objects.create_user('lead_brian',   'lead_brian@example.com',   'lead1234',  role='team_lead')
lead_chris   = User.objects.create_user('lead_chris',   'lead_chris@example.com',   'lead1234',  role='team_lead')

# Developers
dev_sara     = User.objects.create_user('dev_sara',     'dev_sara@example.com',     'dev1234',   role='developer')
dev_james    = User.objects.create_user('dev_james',    'dev_james@example.com',    'dev1234',   role='developer')
dev_lisa     = User.objects.create_user('dev_lisa',     'dev_lisa@example.com',     'dev1234',   role='developer')
dev_paul     = User.objects.create_user('dev_paul',     'dev_paul@example.com',     'dev1234',   role='developer')
dev_karen    = User.objects.create_user('dev_karen',    'dev_karen@example.com',    'dev1234',   role='developer')
dev_tom      = User.objects.create_user('dev_tom',      'dev_tom@example.com',      'dev1234',   role='developer')
dev_linda    = User.objects.create_user('dev_linda',    'dev_linda@example.com',    'dev1234',   role='developer')

# Testers
tester_emma  = User.objects.create_user('tester_emma',  'tester_emma@example.com',  'test1234',  role='tester')
tester_raj   = User.objects.create_user('tester_raj',   'tester_raj@example.com',   'test1234',  role='tester')
tester_aly   = User.objects.create_user('tester_aly',   'tester_aly@example.com',   'test1234',  role='tester')
tester_mia   = User.objects.create_user('tester_mia',   'tester_mia@example.com',   'test1234',  role='tester')

# Customers
cust_bob     = User.objects.create_user('cust_bob',     'cust_bob@example.com',     'cust1234',  role='customer')
cust_anna    = User.objects.create_user('cust_anna',    'cust_anna@example.com',    'cust1234',  role='customer')

# --- Create Projects ---
project_alpha = Project.objects.create(
    name="Bug Tracker Alpha", 
    description="Initial phase of bug tracking system.", 
    manager=pm_john
)
project_beta  = Project.objects.create(
    name="Bug Tracker Beta",  
    description="Second version with analytics.",
    manager=pm_john
)
project_gamma = Project.objects.create(
    name="Bug Tracker Gamma", 
    description="Project with advanced features.",
    manager=pm_john
)

# --- Create Teams ---
team_alpha_1 = Team.objects.create(name="Alpha Team 1", lead=lead_amy,   project=project_alpha)
team_alpha_2 = Team.objects.create(name="Alpha Team 2", lead=lead_brian, project=project_alpha)
team_alpha_3 = Team.objects.create(name="Alpha Team 3", lead=lead_chris, project=project_alpha)
team_beta_1  = Team.objects.create(name="Beta Team 1",  lead=lead_amy,   project=project_beta)
team_beta_2  = Team.objects.create(name="Beta Team 2",  lead=lead_brian, project=project_beta)
team_beta_3  = Team.objects.create(name="Beta Team 3",  lead=lead_chris, project=project_beta)
team_gamma_1 = Team.objects.create(name="Gamma Team 1", lead=lead_amy,   project=project_gamma)
team_gamma_2 = Team.objects.create(name="Gamma Team 2", lead=lead_brian, project=project_gamma)
team_gamma_3 = Team.objects.create(name="Gamma Team 3", lead=lead_chris, project=project_gamma)

# --- Assign Users to Teams ---
assignments = [
    (team_alpha_1, [tm_alice, lead_amy, dev_mike, tester_emma]),
    (team_alpha_2, [tm_bob,   lead_brian, dev_sara, tester_raj]),
    (team_alpha_3, [lead_chris, dev_james, tester_aly]),
    (team_beta_1,  [tm_alice, lead_amy,   dev_mike, tester_mia]),
    (team_beta_2,  [tm_bob,   lead_brian, dev_lisa, tester_raj]),
    (team_beta_3,  [lead_chris, dev_james, tester_aly]),
    (team_gamma_1, [tm_alice, lead_amy,   dev_sara, tester_aly]),
    (team_gamma_2, [tm_bob,   lead_brian, dev_linda, tester_emma]),
    (team_gamma_3, [lead_chris, dev_paul, tester_raj]),
]
for team, members in assignments:
    team.members.set(members)

# --- Create Bugs ---
bugs = [
    ("Login crashes on special characters", "App crashes when user inputs '%%%' in username.", "open",        "critical", tester_emma, dev_mike,  project_alpha, team_alpha_1),
    ("Password reset email not sent",   "No email received after clicking 'Forgot Password'.", "in_progress", "high",     tester_emma, dev_mike,  project_alpha, team_alpha_2),
    ("Incorrect role redirection",      "Testers redirected to admin dashboard.", "resolved",     "medium",   tester_raj,   dev_sara,  project_alpha, team_alpha_3),
    ("Analytics chart not loading",     "Project insights chart returns 500 error.", "open",        "high",     tester_raj,   dev_james, project_beta,  team_beta_1),
    ("User invite email has typo",     "Subject line has spelling mistake in invite email.", "in_progress", "low",      tester_aly,   dev_lisa,  project_beta,  team_beta_2),
    ("Session timeout too short",       "Users are logged out after just 1 minute of inactivity.", "resolved",     "medium",   tester_emma, dev_mike,  project_beta,  team_beta_3),
    ("Page crashes on certain devices", "The page crashes on mobile devices when scrolling.", "open",        "high",     tester_raj,   dev_james, project_gamma, team_gamma_1),
    ("Missing data in reports",         "Analytics reports fail to show recent data.", "in_progress", "medium",   tester_aly,   dev_lisa,  project_gamma, team_gamma_2),
    ("User permissions not saved",      "User permissions reset to default after logout.", "resolved",     "critical", tester_emma, dev_mike,  project_gamma, team_gamma_3),
    ("UI overlap in sidebar",           "Sidebar menu overlaps with content on smaller screens.", "open",        "low",      tester_aly,   dev_james, project_alpha, team_alpha_1),
    ("API error 400 on login",          "Login fails with error 400 when using correct credentials.", "in_progress", "high",     tester_raj,   dev_lisa,  project_beta,  team_beta_2),
    ("Outdated documentation",          "API docs are outdated and don't reflect recent changes.", "resolved",     "medium",   tester_emma, dev_sara,  project_gamma, team_gamma_3),
    ("Search returns no results",       "Searching for existing bugs returns empty list.", "open",        "medium",   tester_mia,   dev_paul,  project_alpha, team_alpha_2),
    ("Notification email delay",       "Users receive notifications with a 10-minute delay.", "in_progress", "high",     tester_mia,   dev_karen, project_beta,  team_beta_3),
    ("Data export CSV broken",         "Exported CSV files are empty.", "open",        "critical", tester_aly,   dev_tom,   project_gamma, team_gamma_1),
    ("Login rate limit not working",    "Too many login attempts allowed.", "resolved",     "medium",   tester_raj,   dev_linda, project_gamma, team_gamma_2),
]
for title, desc, status, priority, rep, assignee, proj, team in bugs:
    Bug.objects.create(
        title=title,
        description=desc,
        status=status,
        priority=priority,
        reported_by=rep,
        assigned_to=assignee,
        project=proj,
        team=team,
        created_at=now()
    )

print("✅ Seed data successfully inserted!")
