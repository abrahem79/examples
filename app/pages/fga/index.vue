<template>
  <section>
    <h3>Fine-Grained Authorization (FGA)</h3>
    
    <div class="intro-panel">
      <h4>Welcome to the FGA Demo</h4>
      <p>
        WorkOS Fine-Grained Authorization (FGA) is a centralized authorization service for customer applications. 
        This demo showcases the key features and use cases of FGA, including role-based access control (RBAC), 
        fine-grained access control (FGAC), and various authorization patterns.
      </p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <h5>🔐 Check API</h5>
        <p>Perform fast access checks from your application</p>
        <code>Is user:alice an editor of document:report-2024?</code>
      </div>
      
      <div class="feature-card">
        <h5>🔍 Query API</h5>
        <p>Quickly lookup which resources users have access to</p>
        <code>Which documents can user:bob edit?</code>
      </div>
      
      <div class="feature-card">
        <h5>📊 Authorization Logging</h5>
        <p>Central log of all authorization events & operations</p>
        <code>Audit trail for debugging and compliance</code>
      </div>
      
      <div class="feature-card">
        <h5>🏗️ Pre-built Templates</h5>
        <p>Common access control patterns</p>
        <code>RBAC, multi-tenancy, pricing tiers</code>
      </div>
    </div>

    <div class="current-user-panel">
      <h4>Current Demo User</h4>
      <div class="user-info">
        <div class="user-details">
          <strong>{{ currentUser.name }}</strong> ({{ currentUser.email }})
          <div class="user-roles">
            Roles: {{ currentUser.roles?.join(', ') || 'None' }}
          </div>
        </div>
        <div class="user-switcher">
          <label for="user-select">Switch User:</label>
          <select v-model="selectedUserId" @change="switchUser" id="user-select">
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="demo-sections">
      <h4>Try the FGA APIs</h4>
      
      <div class="api-demo-grid">
        <div class="api-section">
          <FgaAuthCheck />
        </div>
        
        <div class="api-section">
          <FgaResourceList />
        </div>
      </div>
    </div>

    <div class="advanced-tools">
      <h4>Advanced FGA Tools</h4>
      
      <div class="tools-tabs">
        <button 
          v-for="tool in tools" 
          :key="tool.id"
          @click="activeTool = tool.id"
          class="tool-tab"
          :class="{ active: activeTool === tool.id }"
        >
          {{ tool.label }}
        </button>
      </div>
      
      <div class="tool-content">
        <FgaPermissionMatrix v-if="activeTool === 'matrix'" />
        <FgaRoleManager v-if="activeTool === 'roles'" />
      </div>
    </div>

    <div class="use-cases-nav">
      <h4>Explore Use Cases</h4>
      <div class="nav-grid">
        <NuxtLink to="/fga/rbac" class="use-case-link">
          <h5>Role-Based Access Control</h5>
          <p>Traditional RBAC with roles and permissions</p>
        </NuxtLink>
        
        <NuxtLink to="/fga/fgac" class="use-case-link">
          <h5>Fine-Grained Access Control</h5>
          <p>Resource-level permissions and relationships</p>
        </NuxtLink>
        
        <NuxtLink to="/fga/collaboration" class="use-case-link">
          <h5>Document Collaboration</h5>
          <p>Sharing and collaboration patterns</p>
        </NuxtLink>
        
        <NuxtLink to="/fga/organization" class="use-case-link">
          <h5>Organization Hierarchies</h5>
          <p>Complex organizational structures</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { currentUser, getUsers, setCurrentUser } = useFGA()

const users = getUsers()
const selectedUserId = ref(currentUser.value.id)

const activeTool = ref('matrix')

const tools = [
  { id: 'matrix', label: 'Permission Matrix' },
  { id: 'roles', label: 'Role Manager' }
]

const switchUser = () => {
  const user = users.find(u => u.id === selectedUserId.value)
  if (user) {
    setCurrentUser(user)
  }
}
</script>

<style scoped>
.intro-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.intro-panel h4 {
  margin-top: 0;
  font-size: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card h5 {
  margin-top: 0;
  color: #1f2937;
  font-size: 1.1rem;
}

.feature-card code {
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.5rem;
}

.current-user-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.current-user-panel h4 {
  margin-top: 0;
  color: #1e293b;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.user-details strong {
  color: #1e293b;
  font-size: 1.1rem;
}

.user-roles {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.user-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-switcher label {
  font-weight: 500;
  color: #374151;
}

.user-switcher select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.demo-sections {
  margin-bottom: 2rem;
}

.api-demo-grid {
  display: grid;
  gap: 2rem;
}

.api-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.advanced-tools {
  margin-bottom: 2rem;
}

.tools-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tool-tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tool-tab:hover {
  color: #374151;
}

.tool-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tool-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.use-cases-nav h4 {
  color: #1e293b;
  margin-bottom: 1rem;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.use-case-link {
  display: block;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.use-case-link:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.use-case-link h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.use-case-link p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    align-items: start;
  }
  
  .user-switcher {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>