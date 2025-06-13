from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Team, Project, Bug

# Custom UserAdmin with role and team fields shown in admin
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'role', 'team', 'is_staff')
    list_filter = ('role', 'team', 'is_staff')
    search_fields = ('username', 'email')

    fieldsets = UserAdmin.fieldsets + (
        ('Role & Team Info', {
            'fields': ('role', 'team'),
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role & Team Info', {
            'fields': ('role', 'team'),
        }),
    )

# Bug admin for better visibility of reports
class BugAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'reported_by', 'assigned_to', 'project', 'team', 'created_at')
    list_filter = ('status', 'priority', 'project', 'team')
    search_fields = ('title', 'description')
    raw_id_fields = ('reported_by', 'assigned_to')

# Team admin
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'lead', 'project')
    list_filter = ('project',)

# Project admin
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'manager', 'created_at')
    list_filter = ('manager',)

# Register all models
admin.site.register(User, CustomUserAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Bug, BugAdmin)
