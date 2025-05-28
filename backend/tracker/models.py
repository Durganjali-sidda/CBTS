from django.db import models
from django.contrib.auth.models import User  # This is the default User model

class Bug(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    reported_by = models.ForeignKey(User, related_name='reported_bugs', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, related_name='assigned_bugs', on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.title
