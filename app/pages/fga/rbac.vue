<template>
  <section>
    <h3>Role-Based Access Control (RBAC)</h3>
    
    <div class="breadcrumb">
      <NuxtLink to="/fga">FGA</NuxtLink> → RBAC
    </div>

    <div class="intro-panel">
      <h4>Understanding RBAC</h4>
      <p>
        Role-Based Access Control (RBAC) is one of the most common forms of access control. 
        It involves three main entities: <strong>roles</strong>, <strong>permissions</strong>, and <strong>users</strong>. 
        Permissions define behaviors that are grouped together into roles (e.g. admin, owner). 
        Roles are then assigned to users to grant them the ability to perform a group of behaviors.
      </p>
    </div>

    <div class="rbac-overview">
      <div class="roles-section">
        <h4>Available Roles</h4>
        <div class="roles-grid">
          <div v-for="role in roles" :key="role.id" class="role-card">
            <h5>{{ role.name }}</h5>
            <p>{{ role.description }}</p>
            <div class="permissions-list">
              <strong>Permissions:</strong>
              <span v-for="permission in role.permissions" :key="permission" class="permission-tag">
                {{ permission }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="users-roles-section">
        <h4>User Role Assignments</h4>
        <div class="users-grid">
          <div v-for="user in users" :key="user.id" class="user-card">
            <div class="user-info">
              <strong>{{ user.name }}</strong>
              <div class="user-email">{{ user.email }}</div>
            </div>
            <div class="user-roles">
              <span v-for="role in user.roles" :key="role" class="role-tag">
                {{ role }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rbac-demo">
      <h4>RBAC Authorization Checks</h4>
      <p>
        In traditional RBAC, authorization is typically checked by verifying if a user has the required role. 
        However, with FGA, we can model RBAC more flexibly by treating roles as relations to resources.
      </p>
      
      <div class="demo-scenarios">
        <div class="scenario">
          <h5>Scenario 1: Document Access by Role</h5>
          <p>Check if users with different roles can access documents:</p>
          
          <div class="scenario-tests">
            <div v-for="test in documentAccessTests" :key="test.id" class="test-case">
              <div class="test-description">
                Can <strong>{{ test.userName }}</strong> ({{ test.userRole }}) {{ test.action }} 
                <strong>{{ test.resourceName }}</strong>?
              </div>
              <button @click="runTest(test)" :disabled="test.loading" class="test-button">
                {{ test.loading ? 'Testing...' : 'Test' }}
              </button>
              <div v-if="test.result" class="test-result" :class="{ allowed: test.result.allowed, denied: !test.result.allowed }">
                {{ test.result.allowed ? '✅ ALLOWED' : '❌ DENIED' }}
                <small>{{ test.result.reason }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="scenario">
          <h5>Scenario 2: Role Hierarchy</h5>
          <p>Test how role hierarchies work - admins can do everything, editors can edit but not manage, viewers can only view:</p>
          
          <div class="hierarchy-matrix">
            <table class="permissions-matrix">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>View Documents</th>
                  <th>Edit Documents</th>
                  <th>Manage Users</th>
                  <th>Admin Functions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in rbacHierarchy" :key="role.name">
                  <td><strong>{{ role.name }}</strong></td>
                  <td>{{ role.canView ? '✅' : '❌' }}</td>
                  <td>{{ role.canEdit ? '✅' : '❌' }}</td>
                  <td>{{ role.canManage ? '✅' : '❌' }}</td>
                  <td>{{ role.canAdmin ? '✅' : '❌' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="interactive-demo">
      <h4>Interactive RBAC Demo</h4>
      <p>Try the Check API with different role-based scenarios:</p>
      <FgaAuthCheck />
    </div>

    <div class="next-steps">
      <h4>Limitations of Traditional RBAC</h4>
      <div class="limitations-grid">
        <div class="limitation-card">
          <h5>🚫 Role Explosion</h5>
          <p>As applications grow, the number of roles can explode, especially in multi-tenant scenarios where different customers need different role structures.</p>
        </div>
        
        <div class="limitation-card">
          <h5>🚫 Lack of Context</h5>
          <p>Traditional RBAC doesn't handle resource-specific permissions well. A user might be an editor of some documents but not others.</p>
        </div>
        
        <div class="limitation-card">
          <h5>🚫 Inflexibility</h5>
          <p>Static role definitions make it hard to implement dynamic or contextual authorization rules.</p>
        </div>
      </div>
      
      <div class="next-link">
        <NuxtLink to="/fga/fgac" class="next-button">
          See how Fine-Grained Access Control solves these problems →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TestCase {
  id: string
  userName: string
  userRole: string
  action: string
  resourceName: string
  user: string
  relation: string
  resource: string
  loading: boolean
  result?: any
}

const { getRoles, getUsers } = useFGA()
const { performCheck } = useFGACheck()

const roles = getRoles()
const users = getUsers()

const documentAccessTests = ref<TestCase[]>([
  {
    id: 'test1',
    userName: 'Alice Johnson',
    userRole: 'admin',
    action: 'view',
    resourceName: '2024 Annual Report',
    user: 'user:alice',
    relation: 'viewer',
    resource: 'document:report-2024',
    loading: false
  },
  {
    id: 'test2',
    userName: 'Bob Smith',
    userRole: 'editor',
    action: 'edit',
    resourceName: 'Strategy Plan',
    user: 'user:bob',
    relation: 'editor',
    resource: 'document:strategy-plan',
    loading: false
  },
  {
    id: 'test3',
    userName: 'Charlie Brown',
    userRole: 'viewer',
    action: 'edit',
    resourceName: '2024 Annual Report',
    user: 'user:charlie',
    relation: 'editor',
    resource: 'document:report-2024',
    loading: false
  },
])

const rbacHierarchy = [
  { name: 'Admin', canView: true, canEdit: true, canManage: true, canAdmin: true },
  { name: 'Manager', canView: true, canEdit: true, canManage: true, canAdmin: false },
  { name: 'Editor', canView: true, canEdit: true, canManage: false, canAdmin: false },
  { name: 'Viewer', canView: true, canEdit: false, canManage: false, canAdmin: false },
]

const runTest = async (test: TestCase) => {
  test.loading = true
  try {
    const result = await performCheck({
      user: test.user,
      relation: test.relation,
      resource: test.resource
    })
    test.result = result
  } catch (error) {
    test.result = { allowed: false, reason: 'Test failed', timestamp: new Date().toISOString() }
  } finally {
    test.loading = false
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.intro-panel h4 {
  margin-top: 0;
}

.rbac-overview {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.roles-grid, .users-grid {
  display: grid;
  gap: 1rem;
}

.role-card, .user-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.role-card h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.permissions-list {
  margin-top: 1rem;
}

.permission-tag, .role-tag {
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin: 0.25rem 0.25rem 0 0;
}

.role-tag {
  background: #dcfce7;
  color: #166534;
}

.user-info strong {
  color: #1f2937;
}

.user-email {
  color: #6b7280;
  font-size: 0.875rem;
}

.user-roles {
  margin-top: 0.5rem;
}

.demo-scenarios {
  display: grid;
  gap: 2rem;
}

.scenario {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.test-case {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  margin: 0.5rem 0;
}

.test-description {
  flex: 1;
}

.test-button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.test-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
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

.permissions-matrix {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.permissions-matrix th,
.permissions-matrix td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.permissions-matrix th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
}

.limitations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.limitation-card {
  background: #fef7cd;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 1.5rem;
}

.limitation-card h5 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
}

.limitation-card p {
  color: #78350f;
  margin: 0;
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

@media (min-width: 768px) {
  .rbac-overview {
    grid-template-columns: 1fr 1fr;
  }
  
  .roles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>