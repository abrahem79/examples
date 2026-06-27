<template>
  <div class="auth-check-component">
    <h4>Authorization Check</h4>
    
    <div class="check-form">
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
        <label for="resource-select">Resource:</label>
        <select v-model="selectedResource" id="resource-select">
          <option v-for="resource in resources" :key="resource.id" :value="resource.id">
            {{ resource.name }} ({{ resource.type }})
          </option>
        </select>
      </div>

      <button 
        @click="performAuthCheck" 
        :disabled="isLoading || !selectedUser || !selectedRelation || !selectedResource"
        class="check-button"
      >
        {{ isLoading ? 'Checking...' : 'Check Authorization' }}
      </button>
    </div>

    <div v-if="lastCheck" class="check-result" :class="{ allowed: lastCheck.allowed, denied: !lastCheck.allowed }">
      <h5>Result:</h5>
      <div class="result-status">
        <span class="status-icon">{{ lastCheck.allowed ? '✅' : '❌' }}</span>
        <span class="status-text">{{ lastCheck.allowed ? 'ALLOWED' : 'DENIED' }}</span>
      </div>
      <p class="result-reason">{{ lastCheck.reason }}</p>
      <small class="result-timestamp">Checked at: {{ formatTimestamp(lastCheck.timestamp) }}</small>
    </div>

    <div v-if="error" class="error-message">
      <strong>Error:</strong> {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { performCheck, isLoading, lastCheck, error, clearCheck } = useFGACheck()
const { getUsers, getResources } = useFGA()

const users = getUsers()
const resources = getResources()

const selectedUser = ref('')
const selectedRelation = ref('')
const selectedResource = ref('')

const performAuthCheck = async () => {
  if (!selectedUser.value || !selectedRelation.value || !selectedResource.value) {
    return
  }

  await performCheck({
    user: selectedUser.value,
    relation: selectedRelation.value,
    resource: selectedResource.value,
  })
}

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

// Clear previous results when form changes
watch([selectedUser, selectedRelation, selectedResource], () => {
  clearCheck()
})
</script>

<style scoped>
.auth-check-component {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: #f8f9fa;
}

.check-form {
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

.check-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.check-button:hover:not(:disabled) {
  background: #2563eb;
}

.check-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.check-result {
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.check-result.allowed {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.check-result.denied {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.result-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.status-icon {
  font-size: 1.25rem;
}

.status-text {
  font-weight: 600;
  font-size: 1.1rem;
}

.result-reason {
  margin: 0.5rem 0;
  color: #374151;
}

.result-timestamp {
  color: #6b7280;
  font-size: 0.75rem;
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
  .check-form {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;
  }
  
  .check-button {
    grid-column: span 3;
    justify-self: start;
  }
}
</style>