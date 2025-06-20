from rest_framework import permissions
from rest_framework.permissions import BasePermission

class CombinedPermission(BasePermission):
    def __init__(self, *perms):
        self.perms = perms

    def has_permission(self, request, view):
        return request.user.is_authenticated and any(
            perm().has_permission(request, view) for perm in self.perms
        )

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and any(
            perm().has_object_permission(request, view, obj)
            for perm in self.perms
            if hasattr(perm(), 'has_object_permission')
        )

class IsProductManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'product_manager'

class IsEngineeringManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'engineering_manager'
    
class IsTeamManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'team_manager'


class IsTeamLead(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'team_lead'

class IsDeveloper(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'developer'

class IsTester(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'tester'

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'customer'
