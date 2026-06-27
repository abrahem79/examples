<template>
  <section>
    <h3>Fine-Grained Access Control (FGAC)</h3>
    
    <div class="breadcrumb">
      <NuxtLink to="/fga">FGA</NuxtLink> → FGAC
    </div>

    <div class="intro-panel">
      <h4>Understanding Fine-Grained Access Control</h4>
      <p>
        Fine-Grained Access Control (FGAC) is a more granular form of access control that allows applications 
        to grant users certain behaviors <strong>per resource</strong>, rather than across all resources like traditional RBAC.
      </p>
      <div class="comparison">
        <div class="comparison-item">
          <h5>🔐 Traditional RBAC</h5>
          <code>[admins] can [edit] [reports]</code>
          <p>Coarse-grained: All admins can edit all reports</p>
        </div>
        <div class="comparison-item">
          <h5>🎯 Fine-Grained Access Control</h5>
          <code>[user:alice] can [edit] [report:annual-2024]</code>
          <p>Granular: Specific users can perform specific actions on specific resources</p>
        </div>
      </div>
    </div>

    <div class="fgac-concepts">
      <h4>Key FGAC Concepts</h4>
      <div class="concepts-grid">
        <div class="concept-card">
          <h5>👤 Subject</h5>
          <p>The entity trying to perform an action (user, service, etc.)</p>
          <code>user:alice, service:backup</code>
        </div>
        
        <div class="concept-card">
          <h5>🎬 Action/Relation</h5>
          <p>What the subject wants to do</p>
          <code>edit, view, delete, manage</code>
        </div>
        
        <div class="concept-card">
          <h5>📄 Resource</h5>
          <p>The specific object being accessed</p>
          <code>document:report-2024, project:redesign</code>
        </div>
        
        <div class="concept-card">
          <h5>🔗 Relationship</h5>
          <p>How subjects relate to resources</p>
          <code>owner, editor, viewer, member</code>
        </div>
      </div>
    </div>

    <div class="fgac-advantages">
      <h4>Advantages of FGAC</h4>
      <div class="advantages-grid">
        <div class="advantage-card">
          <h5>🎯 Precision</h5>
          <p>Control access at the individual resource level</p>
          <ul>
            <li>Alice can edit Document A but only view Document B</li>
            <li>Bob can manage Project X but has no access to Project Y</li>
          </ul>
        </div>
        
        <div class="advantage-card">
          <h5>🔄 Flexibility</h5>
          <p>Dynamic relationships that can change over time</p>
          <ul>
            <li>Grant temporary access to specific documents</li>
            <li>Transfer ownership of resources</li>
          </ul>
        </div>
        
        <div class="advantage-card">
          <h5>🏢 Multi-tenancy</h5>
          <p>Perfect for SaaS applications with multiple customers</p>
          <ul>
            <li>Customer A's users can't access Customer B's data</li>
            <li>Each tenant can have different permission structures</li>
          </ul>
        </div>
        
        <div class="advantage-card">
          <h5>📈 Scalability</h5>
          <p>Avoids role explosion in complex systems</p>
          <ul>
            <li>No need for "Editor of Project X" roles</li>
            <li>Relationships scale naturally with resources</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="fgac-demo">
      <h4>FGAC in Action</h4>
      <p>
        Let's explore how FGAC works with our demo data. Notice how different users have different 
        levels of access to different resources:
      </p>
      
      <div class="permission-matrix">
        <h5>Resource-Level Permissions Matrix</h5>
        <div class="matrix-container">
          <table class="matrix-table">
            <thead>
              <tr>
                <th>User</th>
                <th v-for="resource in sampleResources" :key="resource.id" class="resource-header">
                  {{ resource.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in sampleUsers" :key="user.id">
                <td class="user-cell">
                  <strong>{{ user.name }}</strong>
                  <small>{{ user.roles?.join(', ') }}</small>
                </td>
                <td v-for="resource in sampleResources" :key="resource.id" class="permission-cell">
                  <div class="permissions">
                    <span 
                      v-for="permission in getUserResourcePermissions(user.id, resource.id)" 
                      :key="permission"
                      class="permission-badge"
                      :class="permission"
                    >
                      {{ permission }}
                    </span>
                    <span v-if="getUserResourcePermissions(user.id, resource.id).length === 0" class="no-access">
                      No Access
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="test-scenarios">
        <h5>Test Scenarios</h5>
        <p>Click the buttons to test specific access scenarios:</p>
        
        <div class="scenarios-grid">
          <div v-for="scenario in testScenarios" :key="scenario.id" class="scenario-card">
            <div class="scenario-description">
              <strong>{{ scenario.title }}</strong>
              <p>{{ scenario.description }}</p>
            </div>
            <div class="scenario-test">
              <button 
                @click="runScenario(scenario)" 
                :disabled="scenario.loading"
                class="test-button"
              >
                {{ scenario.loading ? 'Testing...' : 'Test' }}
              </button>
              <div v-if="scenario.result" class="scenario-result" :class="{ allowed: scenario.result.allowed, denied: !scenario.result.allowed }">
                {{ scenario.result.allowed ? '✅ ALLOWED' : '❌ DENIED' }}
                <small>{{ scenario.result.reason }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="interactive-demo">
      <h4>Interactive FGAC Demo</h4>
      <p>Try different combinations and see how fine-grained permissions work:</p>
      <div class="demo-grid">
        <FgaAuthCheck />
        <FgaResourceList />
      </div>
    </div>

    <div class="real-world-examples">
      <h4>Real-World FGAC Examples</h4>
      <div class="examples-grid">
        <div class="example-card">
          <h5>📝 Document Management</h5>
          <p>Google Docs-style sharing</p>
          <ul>
            <li>Document owners can share with specific users</li>
            <li>Different permission levels: view, comment, edit</li>
            <li>Time-limited access grants</li>
          </ul>
        </div>
        
        <div class="example-card">
          <h5>💼 Project Management</h5>
          <p>Team-based project access</p>
          <ul>
            <li>Project members can view and edit tasks</li>
            <li>Project managers can invite/remove members</li>
            <li>Clients can view but not edit project details</li>
          </ul>
        </div>
        
        <div class="example-card">
          <h5>🏥 Healthcare Records</h5>
          <p>Patient data access control</p>
          <ul>
            <li>Doctors can access their patients' records</li>
            <li>Nurses can view but not modify treatment plans</li>
            <li>Patients can view their own records</li>
          </ul>
        </div>
        
        <div class="example-card">
          <h5>💰 Financial Services</h5>
          <p>Account and transaction access</p>
          <ul>
            <li>Account holders can view their transactions</li>
            <li>Authorized representatives have limited access</li>
            <li>Auditors can view but not modify records</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="next-steps">
      <div class="next-link">
        <NuxtLink to="/fga/collaboration" class="next-button">
          See FGAC in Document Collaboration →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TestScenario {
  id: string
  title: string
  description: string
  user: string
  relation: string
  resource: string
  loading: boolean
  result?: any
}

const { getUsers, getResources, getUserRelations } = useFGA()
const { performCheck } = useFGACheck()

const sampleUsers = getUsers()
const sampleResources = getResources()

const testScenarios = ref<TestScenario[]>([
  {
    id: 'scenario1',
    title: 'Owner Access Test',
    description: 'Can Alice (admin) edit the 2024 Annual Report she owns?',
    user: 'user:alice',
    relation: 'owner',
    resource: 'document:report-2024',
    loading: false
  },
  {
    id: 'scenario2',
    title: 'Cross-Resource Test',
    description: 'Can Bob (editor) edit a document he doesn\'t own?',
    user: 'user:bob',
    relation: 'owner',
    resource: 'document:report-2024',
    loading: false
  },
  {
    id: 'scenario3',
    title: 'Viewer Limitation Test',
    description: 'Can Charlie (viewer) edit any document?',
    user: 'user:charlie',
    relation: 'editor',
    resource: 'document:strategy-plan',
    loading: false
  },
  {
    id: 'scenario4',
    title: 'Team Management Test',
    description: 'Can Diana (manager) manage the Engineering Team?',
    user: 'user:diana',
    relation: 'manager',
    resource: 'team:engineering',
    loading: false
  }
])

const getUserResourcePermissions = (userId: string, resourceId: string) => {
  const relations = getUserRelations(userId)
  return relations
    .filter(r => r.resource === resourceId)
    .map(r => r.relation)
}

const runScenario = async (scenario: TestScenario) => {
  scenario.loading = true
  try {
    const result = await performCheck({
      user: scenario.user,
      relation: scenario.relation,
      resource: scenario.resource
    })
    scenario.result = result
  } catch (error) {
    scenario.result = { allowed: false, reason: 'Test failed', timestamp: new Date().toISOString() }
  } finally {
    scenario.loading = false
  }
}
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
}

.intro-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.intro-panel h4 {
  margin-top: 0;
}

.comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.comparison-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.comparison-item h5 {
  margin: 0 0 0.5rem 0;
}

.comparison-item code {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  display: block;
  margin: 0.5rem 0;
}

.concepts-grid, .advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.concept-card, .advantage-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.concept-card h5, .advantage-card h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.concept-card code {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.advantage-card ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.advantage-card li {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.matrix-container {
  overflow-x: auto;
  margin: 1rem 0;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.matrix-table th,
.matrix-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e5e7eb;
}

.matrix-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
}

.resource-header {
  text-align: center;
  min-width: 120px;
}

.user-cell {
  background: #f9fafb;
  min-width: 150px;
}

.user-cell small {
  display: block;
  color: #6b7280;
  font-size: 0.75rem;
}

.permission-cell {
  text-align: center;
}

.permissions {
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

.no-access {
  color: #9ca3af;
  font-size: 0.75rem;
  font-style: italic;
}

.scenarios-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.scenario-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.scenario-description {
  flex: 1;
}

.scenario-description strong {
  color: #1f2937;
}

.scenario-description p {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.test-button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  min-width: 80px;
}

.test-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.scenario-result {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
}

.scenario-result.allowed {
  background: #dcfce7;
  color: #166534;
}

.scenario-result.denied {
  background: #fef2f2;
  color: #dc2626;
}

.scenario-result small {
  display: block;
  margin-top: 0.25rem;
  opacity: 0.8;
}

.demo-grid {
  display: grid;
  gap: 2rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.example-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.example-card h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.example-card ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.example-card li {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.next-button {
  display: inline-block;
  background: #059669;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.next-button:hover {
  background: #047857;
}

@media (max-width: 768px) {
  .scenario-card {
    flex-direction: column;
    align-items: start;
  }
  
  .scenario-test {
    align-self: stretch;
  }
  
  .test-button {
    width: 100%;
  }
}
</style>