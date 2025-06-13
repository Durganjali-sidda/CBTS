from rest_framework import permissions

class IsProductManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'product_manager'

class IsEngineeringManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'engineering_manager'

class IsTeamLead(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'team_lead'

class IsDeveloper(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'developer'

class IsTester(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'tester'

class IsCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'customer'
