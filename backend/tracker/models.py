from django.contrib.auth.models import AbstractUser
from django.db import models

# ---------------------------
# Custom User Model
# ---------------------------
class User(AbstractUser):
    ROLE_CHOICES = [
        ('product_manager', 'Product Manager'),
        ('engineering_manager', 'Engineering Manager'),
        ('team_lead', 'Team Lead'),
        ('developer', 'Developer'),
        ('tester', 'Tester'),
        ('customer', 'Customer'),
    ]

    role = models.CharField(max_length=30, choices=ROLE_CHOICES)
    team = models.ForeignKey('Team', null=True, blank=True, on_delete=models.SET_NULL)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


# ---------------------------
# Team Model
# ---------------------------
class Team(models.Model):
    name = models.CharField(max_length=255)
    lead = models.ForeignKey(
        User,
        limit_choices_to={'role': 'team_lead'},
        on_delete=models.SET_NULL,
        null=True,
        related_name='leading_teams'
    )
    project = models.ForeignKey('Project', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# ---------------------------
# Project Model
# ---------------------------
class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    manager = models.ForeignKey(
        User,
        limit_choices_to={'role': 'product_manager'},
        on_delete=models.CASCADE,
        related_name='managed_projects'
    )

    def __str__(self):
        return self.name


# ---------------------------
# Bug Model
# ---------------------------
# models.py

class Bug(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 🛑 Only tester, customer, team_lead, admin can report bugs
    reported_by = models.ForeignKey(
        User,
        related_name='reported_bugs',
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['tester', 'customer', 'team_lead', 'admin']}
    )

    # ✅ Only developers can be assigned to bugs
    assigned_to = models.ForeignKey(
        User,
        related_name='assigned_bugs',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'developer'}
    )

    # 🔗 Project this bug belongs to
    project = models.ForeignKey(Project, related_name='bugs', on_delete=models.CASCADE)

    # 🔗 Optional team this bug is related to (useful for team leads or filtering)
    team = models.ForeignKey(Team, related_name='bugs', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.status}"
