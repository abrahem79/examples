<template>
  <div class="permission-matrix-component">
    <h4>Permission Matrix</h4>
    <p>Interactive matrix showing permissions across users and resources</p>
    
    <div class="matrix-filters">
      <div class="filter-group">
        <label>Resource Type:</label>
        <select v-model="selectedResourceType">
          <option value="">All Types</option>
          <option value="document">Documents</option>
          <option value="project">Projects</option>
          <option value="team">Teams</option>
          <option value="organization">Organizations</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Permission Level:</label>
        <select v-model="selectedPermission">
          <option value="">All Permissions</option>
          <option value="owner">Owner</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>
      </div>
    </div>

    <div class="matrix-container">
      <table class="matrix-table">
        <thead>
          <tr>
            <th class="user-header">User</th>
            <th v-for="resource in filteredResources" :key="resource.id" class="resource-header">
              <div class="resource-name">{{ resource.name }}</div>
              <div class="resource-type">{{ resource.type }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="user-cell">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-roles">{{ user.roles?.join(', ') }}</div>
            </td>
            <td v-for="resource in filteredResources" :key="resource.id" class="permission-cell">
              <div class="permissions-list">
                <span 
                  v-for="permission in getUserResourcePermissions(user.id, resource.id)" 
                  :key="permission"
                  class="permission-badge"
                  :class="permission"
                  @click="showPermissionDetails(user, resource, permission)"
                >
                  {{ permission }}
                </span>
                <span v-if="getUserResourcePermissions(user.id, resource.id).length === 0" class="no-permission">
                  —
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="matrix-legend">
      <h5>Permission Levels</h5>
      <div class="legend-items">
        <div class="legend-item">
          <span class="permission-badge owner">owner</span>
          <span>Full control including sharing and deletion</span>
        </div>
        <div class="legend-item">
          <span class="permission-badge editor">editor</span>
          <span>Can edit content and make changes</span>
        </div>
        <div class="legend-item">
          <span class="permission-badge viewer">viewer</span>
          <span>Read-only access to content</span>
        </div>
        <div class="legend-item">
          <span class="permission-badge admin">admin</span>
          <span>Administrative privileges</span>
        </div>
        <div class="legend-item">
          <span class="permission-badge manager">manager</span>
          <span>Team or resource management</span>
        </div>
        <div class="legend-item">
          <span class="permission-badge member">member</span>
          <span>Basic membership access</span>
        </div>
      </div>
    </div>

    <div v-if="selectedPermissionDetail" class="permission-detail">
      <h5>Permission Details</h5>
      <div class="detail-content">
        <p>
          <strong>{{ selectedPermissionDetail.user.name }}</strong> has 
          <span class="permission-badge" :class="selectedPermissionDetail.permission">
            {{ selectedPermissionDetail.permission }}
          </span>
          access to <strong>{{ selectedPermissionDetail.resource.name }}</strong>
        </p>
        <div class="detail-actions">
          <button @click="testPermission" class="test-btn">Test Access</button>
          <button @click="clearDetail" class="clear-btn">Close</button>
        </div>
        <div v-if="permissionTestResult" class="test-result" :class="{ allowed: permissionTestResult.allowed, denied: !permissionTestResult.allowed }">
          {{ permissionTestResult.allowed ? '✅ Access Granted' : '❌ Access Denied' }}
          <small>{{ permissionTestResult.reason }}</small>
        </div>
      </div>
    </div>

    <div class="matrix-stats">
      <h5>Matrix Statistics</h5>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">{{ totalPermissions }}</span>
          <span class="stat-label">Total Permissions</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ uniqueResourcesWithAccess }}</span>
          <span class="stat-label">Resources with Access</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ averagePermissionsPerUser.toFixed(1) }}</span>
          <span class="stat-label">Avg Permissions/User</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FGAUser, FGAResource } from '~/types/fga'

const { getUsers, getResources, getUserRelations } = useFGA()
const { performCheck } = useFGACheck()

const users = getUsers()
const resources = getResources()

const selectedResourceType = ref('')
const selectedPermission = ref('')
const selectedPermissionDetail = ref<{
  user: FGAUser
  resource: FGAResource
  permission: string
} | null>(null)
const permissionTestResult = ref<any>(null)

const filteredResources = computed(() => {
  return resources.filter(resource => {
    if (selectedResourceType.value && resource.type !== selectedResourceType.value) {
      return false
    }
    return true
  })
})

const getUserResourcePermissions = (userId: string, resourceId: string) => {
  const relations = getUserRelations(userId)
  const permissions = relations
    .filter(r => r.resource === resourceId)
    .map(r => r.relation)
  
  if (selectedPermission.value) {
    return permissions.filter(p => p === selectedPermission.value)
  }
  
  return permissions
}

const showPermissionDetails = (user: FGAUser, resource: FGAResource, permission: string) => {
  selectedPermissionDetail.value = { user, resource, permission }
  permissionTestResult.value = null
}

const clearDetail = () => {
  selectedPermissionDetail.value = null
  permissionTestResult.value = null
}

const testPermission = async () => {
  if (!selectedPermissionDetail.value) return
  
  try {
    const result = await performCheck({
      user: selectedPermissionDetail.value.user.id,
      relation: selectedPermissionDetail.value.permission,
      resource: selectedPermissionDetail.value.resource.id
    })
    permissionTestResult.value = result
  } catch (error) {
    permissionTestResult.value = {
      allowed: false,
      reason: 'Test failed',
      timestamp: new Date().toISOString()
    }
  }
}

const totalPermissions = computed(() => {
  let count = 0
  users.forEach(user => {
    filteredResources.value.forEach(resource => {
      count += getUserResourcePermissions(user.id, resource.id).length
    })
  })
  return count
})

const uniqueResourcesWithAccess = computed(() => {
  const resourcesWithAccess = new Set()
  users.forEach(user => {
    filteredResources.value.forEach(resource => {
      if (getUserResourcePermissions(user.id, resource.id).length > 0) {
        resourcesWithAccess.add(resource.id)
      }
    })
  })
  return resourcesWithAccess.size
})

const averagePermissionsPerUser = computed(() => {
  if (users.length === 0) return 0
  return totalPermissions.value / users.length
})
</script>

<style scoped>
.permission-matrix-component {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: #f8f9fa;
}

.matrix-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  min-width: 150px;
}

.matrix-container {
  overflow-x: auto;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 600px;
}

.matrix-table th,
.matrix-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}

.matrix-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
}

.user-header {
  position: sticky;
  left: 0;
  background: #f8fafc !important;
  z-index: 2;
  min-width: 150px;
}

.resource-header {
  text-align: center;
  min-width: 120px;
}

.resource-name {
  font-weight: 600;
  color: #1f2937;
}

.resource-type {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.user-cell {
  position: sticky;
  left: 0;
  background: #f9fafb;
  z-index: 1;
  min-width: 150px;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.user-roles {
  font-size: 0.75rem;
  color: #6b7280;
}

.permission-cell {
  text-align: center;
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.permission-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.no-permission {
  color: #9ca3af;
  font-size: 0.875rem;
}

.matrix-legend {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.matrix-legend h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.legend-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-item span:last-child {
  font-size: 0.875rem;
  color: #6b7280;
}

.permission-detail {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.permission-detail h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.detail-content p {
  margin: 0 0 1rem 0;
  color: #374151;
}

.detail-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.test-btn, .clear-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.test-btn {
  background: #3b82f6;
  color: white;
}

.clear-btn {
  background: #6b7280;
  color: white;
}

.test-result {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.test-result.allowed {
  background: #dcfce7;
  color: #166534;
}

.test-result.denied {
  background: #fef2f2;
  color: #dc2626;
}

.test-result small {
  display: block;
  margin-top: 0.25rem;
  opacity: 0.8;
}

.matrix-stats {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
}

.matrix-stats h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .matrix-filters {
    flex-direction: column;
  }
  
  .filter-group select {
    min-width: unset;
  }
  
  .legend-items {
    grid-template-columns: 1fr;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}
</style>