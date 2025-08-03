<template>
  <div class="role-manager-component">
    <h4>Role Manager</h4>
    <p>Manage roles, permissions, and user assignments</p>
    
    <div class="manager-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Roles Tab -->
    <div v-if="activeTab === 'roles'" class="tab-content">
      <div class="roles-section">
        <h5>Available Roles</h5>
        <div class="roles-grid">
          <div v-for="role in roles" :key="role.id" class="role-card" @click="selectRole(role)">
            <div class="role-header">
              <h6>{{ role.name }}</h6>
              <span class="permission-count">{{ role.permissions.length }} permissions</span>
            </div>
            <p class="role-description">{{ role.description }}</p>
            <div class="role-permissions">
              <span v-for="permission in role.permissions" :key="permission" class="permission-tag">
                {{ permission }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedRole" class="role-details">
        <h5>Role Details: {{ selectedRole.name }}</h5>
        <div class="role-info">
          <div class="info-section">
            <label>Role Name:</label>
            <input v-model="selectedRole.name" type="text" readonly class="readonly-input">
          </div>
          <div class="info-section">
            <label>Description:</label>
            <textarea v-model="selectedRole.description" readonly class="readonly-input"></textarea>
          </div>
          <div class="info-section">
            <label>Permissions:</label>
            <div class="permissions-list">
              <span v-for="permission in selectedRole.permissions" :key="permission" class="permission-chip">
                {{ permission }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <div class="users-section">
        <h5>User Role Assignments</h5>
        <div class="users-grid">
          <div v-for="user in users" :key="user.id" class="user-card" @click="selectUser(user)">
            <div class="user-header">
              <div class="user-info">
                <h6>{{ user.name }}</h6>
                <span class="user-email">{{ user.email }}</span>
              </div>
              <div class="user-roles-count">
                {{ user.roles?.length || 0 }} roles
              </div>
            </div>
            <div class="user-roles">
              <span v-for="role in user.roles" :key="role" class="role-chip" :class="role">
                {{ role }}
              </span>
              <span v-if="!user.roles || user.roles.length === 0" class="no-roles">
                No roles assigned
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedUser" class="user-details">
        <h5>User Details: {{ selectedUser.name }}</h5>
        <div class="user-permissions-analysis">
          <h6>Resource Access Analysis</h6>
          <div class="access-summary">
            <div class="summary-item">
              <span class="summary-number">{{ getUserDirectPermissions(selectedUser.id).length }}</span>
              <span class="summary-label">Direct Permissions</span>
            </div>
            <div class="summary-item">
              <span class="summary-number">{{ getUniqueResourcesForUser(selectedUser.id) }}</span>
              <span class="summary-label">Accessible Resources</span>
            </div>
            <div class="summary-item">
              <span class="summary-number">{{ selectedUser.roles?.length || 0 }}</span>
              <span class="summary-label">Assigned Roles</span>
            </div>
          </div>
          
          <div class="user-resource-access">
            <h6>Resource Access Breakdown</h6>
            <div class="resource-breakdown">
              <div v-for="resource in getResourcesForUser(selectedUser.id)" :key="resource.id" class="resource-access">
                <div class="resource-name">{{ resource.name }}</div>
                <div class="resource-permissions">
                  <span 
                    v-for="permission in getUserResourcePermissions(selectedUser.id, resource.id)" 
                    :key="permission"
                    class="permission-badge"
                    :class="permission"
                  >
                    {{ permission }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Permissions Tab -->
    <div v-if="activeTab === 'permissions'" class="tab-content">
      <div class="permissions-overview">
        <h5>Permission Mapping Overview</h5>
        <div class="permission-matrix-mini">
          <FgaPermissionMatrix />
        </div>
      </div>
      
      <div class="permission-analysis">
        <h5>Permission Analysis</h5>
        <div class="analysis-grid">
          <div class="analysis-card">
            <h6>Most Common Permissions</h6>
            <div class="permission-stats">
              <div v-for="stat in commonPermissions" :key="stat.permission" class="stat-item">
                <span class="permission-badge" :class="stat.permission">{{ stat.permission }}</span>
                <span class="stat-count">{{ stat.count }} assignments</span>
              </div>
            </div>
          </div>
          
          <div class="analysis-card">
            <h6>Resource Distribution</h6>
            <div class="resource-stats">
              <div v-for="stat in resourceDistribution" :key="stat.type" class="stat-item">
                <span class="resource-type-badge">{{ stat.type }}</span>
                <span class="stat-count">{{ stat.count }} resources</span>
              </div>
            </div>
          </div>
          
          <div class="analysis-card">
            <h6>Access Patterns</h6>
            <div class="pattern-stats">
              <div class="stat-item">
                <span class="pattern-label">Users with multiple roles:</span>
                <span class="stat-count">{{ usersWithMultipleRoles }}</span>
              </div>
              <div class="stat-item">
                <span class="pattern-label">Resources with multiple owners:</span>
                <span class="stat-count">{{ resourcesWithMultipleOwners }}</span>
              </div>
              <div class="stat-item">
                <span class="pattern-label">Cross-department access:</span>
                <span class="stat-count">{{ crossDepartmentAccess }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audit Tab -->
    <div v-if="activeTab === 'audit'" class="tab-content">
      <div class="audit-section">
        <h5>Access Audit Trail</h5>
        <p>Simulated audit log of recent authorization events</p>
        
        <div class="audit-filters">
          <select v-model="auditFilter">
            <option value="all">All Events</option>
            <option value="granted">Access Granted</option>
            <option value="denied">Access Denied</option>
            <option value="role_change">Role Changes</option>
          </select>
        </div>
        
        <div class="audit-log">
          <div v-for="event in filteredAuditEvents" :key="event.id" class="audit-event" :class="event.type">
            <div class="event-header">
              <span class="event-time">{{ formatTime(event.timestamp) }}</span>
              <span class="event-type" :class="event.type">{{ event.type.replace('_', ' ').toUpperCase() }}</span>
            </div>
            <div class="event-details">
              <strong>{{ event.user }}</strong> {{ event.action }} 
              <code>{{ event.resource }}</code>
              <span v-if="event.relation">as <em>{{ event.relation }}</em></span>
            </div>
            <div class="event-result" :class="{ success: event.result === 'granted', failure: event.result === 'denied' }">
              {{ event.result === 'granted' ? '✅ Granted' : event.result === 'denied' ? '❌ Denied' : '🔄 Changed' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FGAUser, FGARole, FGAResource } from '~/types/fga'

const { getUsers, getResources, getRoles, getUserRelations } = useFGA()

const users = getUsers()
const resources = getResources()
const roles = getRoles()

const activeTab = ref('roles')
const selectedRole = ref<FGARole | null>(null)
const selectedUser = ref<FGAUser | null>(null)
const auditFilter = ref('all')

const tabs = [
  { id: 'roles', label: 'Roles' },
  { id: 'users', label: 'Users' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'audit', label: 'Audit Trail' }
]

// Mock audit events
const auditEvents = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'access_granted',
    user: 'Alice Johnson',
    action: 'accessed',
    resource: 'document:report-2024',
    relation: 'owner',
    result: 'granted'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'access_denied',
    user: 'Charlie Brown',
    action: 'attempted to edit',
    resource: 'document:strategy-plan',
    relation: 'editor',
    result: 'denied'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'role_change',
    user: 'Bob Smith',
    action: 'was assigned role',
    resource: 'editor',
    result: 'changed'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'access_granted',
    user: 'Diana Prince',
    action: 'accessed',
    resource: 'team:engineering',
    relation: 'manager',
    result: 'granted'
  }
]

const selectRole = (role: FGARole) => {
  selectedRole.value = role
}

const selectUser = (user: FGAUser) => {
  selectedUser.value = user
}

const getUserDirectPermissions = (userId: string) => {
  return getUserRelations(userId)
}

const getUniqueResourcesForUser = (userId: string) => {
  const relations = getUserRelations(userId)
  const uniqueResources = new Set(relations.map(r => r.resource))
  return uniqueResources.size
}

const getResourcesForUser = (userId: string) => {
  const relations = getUserRelations(userId)
  const resourceIds = new Set(relations.map(r => r.resource))
  return resources.filter(r => resourceIds.has(r.id))
}

const getUserResourcePermissions = (userId: string, resourceId: string) => {
  const relations = getUserRelations(userId)
  return relations
    .filter(r => r.resource === resourceId)
    .map(r => r.relation)
}

const commonPermissions = computed(() => {
  const permissionCounts: Record<string, number> = {}
  
  users.forEach(user => {
    const relations = getUserRelations(user.id)
    relations.forEach(relation => {
      permissionCounts[relation.relation] = (permissionCounts[relation.relation] || 0) + 1
    })
  })
  
  return Object.entries(permissionCounts)
    .map(([permission, count]) => ({ permission, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const resourceDistribution = computed(() => {
  const typeCounts: Record<string, number> = {}
  
  resources.forEach(resource => {
    typeCounts[resource.type] = (typeCounts[resource.type] || 0) + 1
  })
  
  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
})

const usersWithMultipleRoles = computed(() => {
  return users.filter(user => user.roles && user.roles.length > 1).length
})

const resourcesWithMultipleOwners = computed(() => {
  const ownerCounts: Record<string, number> = {}
  
  users.forEach(user => {
    const relations = getUserRelations(user.id)
    relations.forEach(relation => {
      if (relation.relation === 'owner') {
        ownerCounts[relation.resource] = (ownerCounts[relation.resource] || 0) + 1
      }
    })
  })
  
  return Object.values(ownerCounts).filter(count => count > 1).length
})

const crossDepartmentAccess = computed(() => {
  // Simplified calculation - in real implementation would check actual department boundaries
  return Math.floor(Math.random() * 5) + 3
})

const filteredAuditEvents = computed(() => {
  if (auditFilter.value === 'all') {
    return auditEvents
  }
  return auditEvents.filter(event => event.type === auditFilter.value)
})

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString()
}
</script>

<style scoped>
.role-manager-component {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: #f8f9fa;
}

.manager-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  min-height: 400px;
}

.roles-grid, .users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.role-card, .user-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.role-card:hover, .user-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.role-header, .user-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.role-header h6, .user-header h6 {
  margin: 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.permission-count, .user-roles-count {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.role-permissions, .user-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.permission-tag, .role-chip {
  background: #f3f4f6;
  color: #374151;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-chip.admin {
  background: #fef3c7;
  color: #92400e;
}

.role-chip.editor {
  background: #dbeafe;
  color: #1e40af;
}

.role-chip.viewer {
  background: #f3e8ff;
  color: #7c3aed;
}

.role-chip.manager {
  background: #f0f9ff;
  color: #0c4a6e;
}

.user-email {
  color: #6b7280;
  font-size: 0.875rem;
}

.no-roles {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.875rem;
}

.role-details, .user-details {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.role-details h5, .user-details h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.info-section {
  margin-bottom: 1rem;
}

.info-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.readonly-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
  color: #6b7280;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.permission-chip {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.access-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 6px;
}

.summary-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.resource-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resource-access {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
}

.resource-name {
  font-weight: 500;
  color: #1f2937;
}

.resource-permissions {
  display: flex;
  gap: 0.25rem;
}

.permission-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.permission-badge.owner {
  background: #dcfce7;
  color: #166534;
}

.permission-badge.editor {
  background: #dbeafe;
  color: #1e40af;
}

.permission-badge.viewer {
  background: #f3e8ff;
  color: #7c3aed;
}

.permission-badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.permission-badge.manager {
  background: #f0f9ff;
  color: #0c4a6e;
}

.permission-badge.member {
  background: #f1f5f9;
  color: #475569;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.analysis-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.analysis-card h6 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.permission-stats, .resource-stats, .pattern-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resource-type-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.pattern-label {
  font-size: 0.875rem;
  color: #374151;
}

.stat-count {
  font-weight: 500;
  color: #1f2937;
}

.audit-filters {
  margin-bottom: 1rem;
}

.audit-filters select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.audit-log {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.audit-event {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  border-left: 4px solid #6b7280;
}

.audit-event.access_granted {
  border-left-color: #059669;
}

.audit-event.access_denied {
  border-left-color: #dc2626;
}

.audit-event.role_change {
  border-left-color: #3b82f6;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.event-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.event-type {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.event-type.access_granted {
  background: #dcfce7;
  color: #166534;
}

.event-type.access_denied {
  background: #fef2f2;
  color: #dc2626;
}

.event-type.role_change {
  background: #dbeafe;
  color: #1e40af;
}

.event-details {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.event-details code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}

.event-result {
  font-size: 0.875rem;
  font-weight: 500;
}

.event-result.success {
  color: #059669;
}

.event-result.failure {
  color: #dc2626;
}

@media (max-width: 768px) {
  .manager-tabs {
    overflow-x: auto;
  }
  
  .roles-grid, .users-grid {
    grid-template-columns: 1fr;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>