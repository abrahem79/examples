<template>
  <section>
    <h3>Document Collaboration & Sharing</h3>
    
    <div class="breadcrumb">
      <NuxtLink to="/fga">FGA</NuxtLink> → Collaboration
    </div>

    <div class="intro-panel">
      <h4>Collaboration Patterns with FGA</h4>
      <p>
        One of the most common use cases for Fine-Grained Authorization is enabling access control 
        on user-generated content, similar to Google Docs, Box, or Dropbox. FGA makes it easy to 
        implement flexible sharing and collaboration patterns.
      </p>
    </div>

    <div class="collaboration-patterns">
      <h4>Common Collaboration Patterns</h4>
      <div class="patterns-grid">
        <div class="pattern-card">
          <h5>👑 Ownership Model</h5>
          <p>Users own documents they create and have full control</p>
          <ul>
            <li>Create, edit, delete their own documents</li>
            <li>Share with others at different permission levels</li>
            <li>Transfer ownership to other users</li>
          </ul>
        </div>
        
        <div class="pattern-card">
          <h5>👥 Team Collaboration</h5>
          <p>Teams work together on shared documents</p>
          <ul>
            <li>Team members have default access to team documents</li>
            <li>Team leads can manage permissions</li>
            <li>External collaborators can be invited</li>
          </ul>
        </div>
        
        <div class="pattern-card">
          <h5>🔗 Link Sharing</h5>
          <p>Share documents via links with specific permissions</p>
          <ul>
            <li>Public links for view-only access</li>
            <li>Private links with expiration dates</li>
            <li>Comment-only or edit permissions</li>
          </ul>
        </div>
        
        <div class="pattern-card">
          <h5>📋 Request Access</h5>
          <p>Users can request access to documents</p>
          <ul>
            <li>Send access requests to document owners</li>
            <li>Approve/deny requests with specific permissions</li>
            <li>Temporary access grants</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="document-demo">
      <h4>Document Sharing Simulation</h4>
      <p>Explore how different users can interact with documents based on their permissions:</p>
      
      <div class="documents-section">
        <h5>Available Documents</h5>
        <div class="documents-grid">
          <div v-for="doc in documents" :key="doc.id" class="document-card">
            <div class="document-header">
              <h6>{{ doc.name }}</h6>
              <span class="document-type">{{ doc.type }}</span>
            </div>
            <div class="document-owner">
              <strong>Owner:</strong> {{ getUserName(doc.owner) }}
            </div>
            <div class="document-sharing">
              <h6>Shared With:</h6>
              <div class="sharing-list">
                <div v-for="share in getDocumentShares(doc.id)" :key="share.user" class="share-item">
                  <span class="share-user">{{ getUserName(share.user) }}</span>
                  <span class="share-permission" :class="share.relation">{{ share.relation }}</span>
                </div>
                <div v-if="getDocumentShares(doc.id).length === 0" class="no-shares">
                  Not shared with anyone
                </div>
              </div>
            </div>
            <div class="document-actions">
              <button @click="simulateAccess(doc, 'view')" class="action-btn view">
                👁️ View
              </button>
              <button @click="simulateAccess(doc, 'edit')" class="action-btn edit">
                ✏️ Edit
              </button>
              <button @click="simulateAccess(doc, 'share')" class="action-btn share">
                🔗 Share
              </button>
              <button @click="simulateAccess(doc, 'delete')" class="action-btn delete">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="current-user-section">
        <h5>Acting as: {{ currentUser.name }}</h5>
        <div class="user-switcher">
          <label>Switch User:</label>
          <select v-model="selectedUserId" @change="switchUser">
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="sharing-workflows">
      <h4>Sharing Workflows</h4>
      <div class="workflows-grid">
        <div class="workflow-card">
          <h5>📤 Direct Sharing</h5>
          <div class="workflow-steps">
            <div class="step">
              <span class="step-number">1</span>
              <p>Document owner selects "Share"</p>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <p>Choose users and permission levels</p>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <p>FGA creates user-document relations</p>
            </div>
            <div class="step">
              <span class="step-number">4</span>
              <p>Shared users can access per permissions</p>
            </div>
          </div>
          <div class="workflow-example">
            <code>
              user:alice → shares → document:report-2024<br>
              with user:bob as "editor"<br>
              Result: [user:bob, editor, document:report-2024]
            </code>
          </div>
        </div>
        
        <div class="workflow-card">
          <h5>🔒 Permission Inheritance</h5>
          <div class="workflow-steps">
            <div class="step">
              <span class="step-number">1</span>
              <p>Document belongs to a team/project</p>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <p>Team members automatically get access</p>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <p>FGA checks team membership</p>
            </div>
            <div class="step">
              <span class="step-number">4</span>
              <p>Inherits permissions from team role</p>
            </div>
          </div>
          <div class="workflow-example">
            <code>
              document:report → belongs_to → team:marketing<br>
              user:charlie → member → team:marketing<br>
              Result: user:charlie can view document:report
            </code>
          </div>
        </div>
      </div>
    </div>

    <div class="permission-levels">
      <h4>Permission Levels Explained</h4>
      <div class="levels-grid">
        <div class="level-card viewer">
          <h5>👁️ Viewer</h5>
          <p>Read-only access to documents</p>
          <ul>
            <li>✅ View document content</li>
            <li>✅ Download copies</li>
            <li>❌ Edit content</li>
            <li>❌ Share with others</li>
            <li>❌ Change permissions</li>
          </ul>
        </div>
        
        <div class="level-card editor">
          <h5>✏️ Editor</h5>
          <p>Can modify document content</p>
          <ul>
            <li>✅ View document content</li>
            <li>✅ Edit and save changes</li>
            <li>✅ Leave comments</li>
            <li>❌ Share with others</li>
            <li>❌ Delete document</li>
          </ul>
        </div>
        
        <div class="level-card owner">
          <h5>👑 Owner</h5>
          <p>Full control over the document</p>
          <ul>
            <li>✅ All editor permissions</li>
            <li>✅ Share with others</li>
            <li>✅ Change permissions</li>
            <li>✅ Delete document</li>
            <li>✅ Transfer ownership</li>
          </ul>
        </div>
        
        <div class="level-card commentor">
          <h5>💬 Commentor</h5>
          <p>Can view and add comments</p>
          <ul>
            <li>✅ View document content</li>
            <li>✅ Add comments</li>
            <li>✅ Reply to comments</li>
            <li>❌ Edit content</li>
            <li>❌ Share document</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="access-results" v-if="lastAccessTest">
      <h4>Last Access Test Result</h4>
      <div class="result-card" :class="{ success: lastAccessTest.allowed, failure: !lastAccessTest.allowed }">
        <div class="result-header">
          <span class="result-icon">{{ lastAccessTest.allowed ? '✅' : '❌' }}</span>
          <span class="result-status">{{ lastAccessTest.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED' }}</span>
        </div>
        <div class="result-details">
          <p><strong>Action:</strong> {{ lastAccessTest.action }}</p>
          <p><strong>Document:</strong> {{ lastAccessTest.documentName }}</p>
          <p><strong>User:</strong> {{ lastAccessTest.userName }}</p>
          <p><strong>Reason:</strong> {{ lastAccessTest.reason }}</p>
        </div>
      </div>
    </div>

    <div class="interactive-demo">
      <h4>Interactive Collaboration Demo</h4>
      <div class="demo-grid">
        <FgaAuthCheck />
        <FgaResourceList />
      </div>
    </div>

    <div class="next-steps">
      <div class="next-link">
        <NuxtLink to="/fga/organization" class="next-button">
          Explore Organization Hierarchies →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface AccessTestResult {
  allowed: boolean
  action: string
  documentName: string
  userName: string
  reason: string
}

const { currentUser, getUsers, setCurrentUser, getUserRelations } = useFGA()
const { performCheck } = useFGACheck()

const users = getUsers()
const selectedUserId = ref(currentUser.value.id)
const lastAccessTest = ref<AccessTestResult | null>(null)

const documents = [
  {
    id: 'document:report-2024',
    name: '2024 Annual Report',
    type: 'Financial Report',
    owner: 'user:alice'
  },
  {
    id: 'document:strategy-plan',
    name: 'Strategy Plan',
    type: 'Business Document',
    owner: 'user:bob'
  },
  {
    id: 'project:website-redesign',
    name: 'Website Redesign',
    type: 'Project',
    owner: 'user:alice'
  }
]

const switchUser = () => {
  const user = users.find(u => u.id === selectedUserId.value)
  if (user) {
    setCurrentUser(user)
  }
}

const getUserName = (userId: string) => {
  const user = users.find(u => u.id === userId)
  return user ? user.name : userId
}

const getDocumentShares = (documentId: string) => {
  // Get all relations for this document except the owner
  const doc = documents.find(d => d.id === documentId)
  if (!doc) return []
  
  const allRelations = []
  users.forEach(user => {
    const userRelations = getUserRelations(user.id)
    userRelations.forEach(relation => {
      if (relation.resource === documentId && user.id !== doc.owner) {
        allRelations.push({
          user: user.id,
          relation: relation.relation
        })
      }
    })
  })
  
  return allRelations
}

const simulateAccess = async (document: any, action: string) => {
  const relationMap: Record<string, string> = {
    view: 'viewer',
    edit: 'editor',
    share: 'owner',
    delete: 'owner'
  }
  
  const requiredRelation = relationMap[action]
  if (!requiredRelation) return
  
  try {
    const result = await performCheck({
      user: currentUser.value.id,
      relation: requiredRelation,
      resource: document.id
    })
    
    lastAccessTest.value = {
      allowed: result.allowed,
      action: action.toUpperCase(),
      documentName: document.name,
      userName: currentUser.value.name,
      reason: result.reason || 'Unknown'
    }
  } catch (error) {
    lastAccessTest.value = {
      allowed: false,
      action: action.toUpperCase(),
      documentName: document.name,
      userName: currentUser.value.name,
      reason: 'Access check failed'
    }
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
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.intro-panel h4 {
  margin-top: 0;
  color: #1f2937;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.pattern-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.pattern-card h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.pattern-card ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.pattern-card li {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.document-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.document-header h6 {
  margin: 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.document-type {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.document-owner {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #374151;
}

.document-sharing h6 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 600;
}

.sharing-list {
  margin-bottom: 1rem;
}

.share-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 0.875rem;
}

.share-user {
  color: #374151;
}

.share-permission {
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.share-permission.owner {
  background: #dcfce7;
  color: #166534;
}

.share-permission.editor {
  background: #dbeafe;
  color: #1e40af;
}

.share-permission.viewer {
  background: #f3e8ff;
  color: #7c3aed;
}

.no-shares {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.875rem;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.action-btn.view {
  background: #e0f2fe;
  color: #0c4a6e;
}

.action-btn.edit {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.share {
  background: #dcfce7;
  color: #166534;
}

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn:hover {
  opacity: 0.8;
}

.current-user-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.current-user-section h5 {
  margin: 0 0 1rem 0;
  color: #1e293b;
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

.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.workflow-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.workflow-card h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.workflow-steps {
  margin-bottom: 1rem;
}

.step {
  display: flex;
  align-items: start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.step-number {
  background: #3b82f6;
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.step p {
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
}

.workflow-example {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
}

.workflow-example code {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.level-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.level-card.viewer {
  border-left: 4px solid #7c3aed;
}

.level-card.editor {
  border-left: 4px solid #1e40af;
}

.level-card.owner {
  border-left: 4px solid #166534;
}

.level-card.commentor {
  border-left: 4px solid #ea580c;
}

.level-card h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
}

.level-card ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1rem;
}

.level-card li {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.result-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.result-card.success {
  border-left: 4px solid #059669;
  background: #f0fdf4;
}

.result-card.failure {
  border-left: 4px solid #dc2626;
  background: #fef2f2;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.result-icon {
  font-size: 1.25rem;
}

.result-status {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1f2937;
}

.result-details p {
  margin: 0.25rem 0;
  color: #374151;
  font-size: 0.875rem;
}

.demo-grid {
  display: grid;
  gap: 2rem;
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
  .document-actions {
    justify-content: center;
  }
  
  .workflows-grid {
    grid-template-columns: 1fr;
  }
  
  .levels-grid {
    grid-template-columns: 1fr;
  }
}
</style>