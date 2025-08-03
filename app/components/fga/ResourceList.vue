<template>
  <div class="resource-list-component">
    <h4>Resource Query</h4>
    
    <div class="query-form">
      <div class="form-group">
        <label for="user-select">User:</label>
        <select v-model="selectedUser" id="user-select">
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} ({{ user.email }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="relation-select">Relation:</label>
        <select v-model="selectedRelation" id="relation-select">
          <option value="owner">Owner</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
        </select>
      </div>

      <div class="form-group">
        <label for="resource-type-select">Resource Type (optional):</label>
        <select v-model="selectedResourceType" id="resource-type-select">
          <option value="">All Types</option>
          <option value="document">Document</option>
          <option value="project">Project</option>
          <option value="team">Team</option>
          <option value="organization">Organization</option>
          <option value="application">Application</option>
        </select>
      </div>

      <button 
        @click="performResourceQuery" 
        :disabled="isLoading || !selectedUser || !selectedRelation"
        class="query-button"
      >
        {{ isLoading ? 'Querying...' : 'Query Resources' }}
      </button>
    </div>

    <div v-if="lastQuery" class="query-results">
      <h5>Results: {{ resourceCount }} resource(s) found</h5>
      
      <div v-if="resources.length === 0" class="no-results">
        No resources found matching the criteria.
      </div>
      
      <div v-else class="resources-grid">
        <div 
          v-for="resource in resources" 
          :key="resource.id" 
          class="resource-card"
        >
          <div class="resource-header">
            <h6>{{ resource.name }}</h6>
            <span class="resource-type">{{ resource.type }}</span>
          </div>
          <div class="resource-id">ID: {{ resource.id }}</div>
          <div v-if="resource.owner" class="resource-owner">
            Owner: {{ getUserName(resource.owner) }}
          </div>
          <div v-if="resource.attributes" class="resource-attributes">
            <strong>Attributes:</strong>
            <ul>
              <li v-for="(value, key) in resource.attributes" :key="key">
                {{ key }}: {{ value }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <small class="query-timestamp">
        Queried at: {{ formatTimestamp(lastQuery.timestamp) }}
      </small>
    </div>

    <div v-if="error" class="error-message">
      <strong>Error:</strong> {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { performQuery, isLoading, lastQuery, resources, resourceCount, error, clearQuery } = useFGAQuery()
const { getUsers } = useFGA()

const users = getUsers()

const selectedUser = ref('')
const selectedRelation = ref('')
const selectedResourceType = ref('')

const performResourceQuery = async () => {
  if (!selectedUser.value || !selectedRelation.value) {
    return
  }

  await performQuery({
    user: selectedUser.value,
    relation: selectedRelation.value,
    resourceType: selectedResourceType.value || undefined,
  })
}

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

const getUserName = (userId: string) => {
  const user = users.find(u => u.id === userId)
  return user ? user.name : userId
}

// Clear previous results when form changes
watch([selectedUser, selectedRelation, selectedResourceType], () => {
  clearQuery()
})
</script>

<style scoped>
.resource-list-component {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: #f8f9fa;
}

.query-form {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.query-button {
  padding: 0.75rem 1.5rem;
  background: #059669;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.query-button:hover:not(:disabled) {
  background: #047857;
}

.query-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.query-results {
  margin-top: 1rem;
}

.no-results {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
}

.resources-grid {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.resource-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  transition: box-shadow 0.2s;
}

.resource-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.resource-header h6 {
  margin: 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.resource-type {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.resource-id {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.resource-owner {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.resource-attributes {
  font-size: 0.875rem;
  color: #374151;
}

.resource-attributes ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1rem;
}

.resource-attributes li {
  margin-bottom: 0.25rem;
}

.query-timestamp {
  color: #6b7280;
  font-size: 0.75rem;
  display: block;
  margin-top: 1rem;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .query-form {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;
  }
  
  .query-button {
    grid-column: span 3;
    justify-self: start;
  }

  .resources-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
</style>