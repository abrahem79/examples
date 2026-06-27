<template>
  <section>
    <h3>Organization Hierarchies</h3>
    
    <div class="breadcrumb">
      <NuxtLink to="/fga">FGA</NuxtLink> → Organization
    </div>

    <div class="intro-panel">
      <h4>Modeling Complex Organization Structures</h4>
      <p>
        FGA excels at modeling complex organizational hierarchies found in mid to large-scale enterprises. 
        With FGA, you can define rules like "all members of team X can access report Y" and 
        "all direct reports of manager Z are members of team X", enabling sophisticated organizational access patterns.
      </p>
    </div>

    <div class="hierarchy-examples">
      <h4>Common Organizational Patterns</h4>
      <div class="examples-grid">
        <div class="example-card">
          <h5>🏢 Department-Based Access</h5>
          <p>Access controlled by department membership</p>
          <ul>
            <li>HR department can access employee records</li>
            <li>Finance team can view financial reports</li>
            <li>Engineering can access code repositories</li>
          </ul>
        </div>
        
        <div class="example-card">
          <h5>📊 Management Hierarchy</h5>
          <p>Managers inherit access from their reports</p>
          <ul>
            <li>Team leads can view their team's documents</li>
            <li>Directors can access all department resources</li>
            <li>C-level executives have broad access</li>
          </ul>
        </div>
        
        <div class="example-card">
          <h5>🎯 Project-Based Teams</h5>
          <p>Cross-functional project access</p>
          <ul>
            <li>Project members from different departments</li>
            <li>Project managers coordinate access</li>
            <li>Stakeholders have read-only access</li>
          </ul>
        </div>
        
        <div class="example-card">
          <h5>🌍 Regional Access</h5>
          <p>Geographic-based access control</p>
          <ul>
            <li>Regional managers access local data</li>
            <li>Global teams access all regions</li>
            <li>Compliance varies by region</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="org-chart-demo">
      <h4>Sample Organization Structure</h4>
      <p>Let's explore a sample organization and how FGA models its access patterns:</p>
      
      <div class="org-chart">
        <div class="org-level ceo-level">
          <div class="org-node ceo">
            <div class="node-icon">👑</div>
            <div class="node-info">
              <strong>Alice Johnson</strong>
              <span>CEO</span>
            </div>
          </div>
        </div>
        
        <div class="org-level director-level">
          <div class="org-node director">
            <div class="node-icon">👔</div>
            <div class="node-info">
              <strong>Diana Prince</strong>
              <span>Engineering Director</span>
            </div>
          </div>
          <div class="org-node director">
            <div class="node-icon">💼</div>
            <div class="node-info">
              <strong>Bob Smith</strong>
              <span>Product Director</span>
            </div>
          </div>
        </div>
        
        <div class="org-level manager-level">
          <div class="org-node manager">
            <div class="node-icon">👥</div>
            <div class="node-info">
              <strong>Charlie Brown</strong>
              <span>Engineering Manager</span>
            </div>
          </div>
          <div class="org-node manager">
            <div class="node-icon">📊</div>
            <div class="node-info">
              <strong>Emily Davis</strong>
              <span>Product Manager</span>
            </div>
          </div>
        </div>
        
        <div class="org-level employee-level">
          <div class="org-node employee">
            <div class="node-icon">💻</div>
            <div class="node-info">
              <strong>Frank Wilson</strong>
              <span>Senior Engineer</span>
            </div>
          </div>
          <div class="org-node employee">
            <div class="node-icon">🔧</div>
            <div class="node-info">
              <strong>Grace Lee</strong>
              <span>Engineer</span>
            </div>
          </div>
          <div class="org-node employee">
            <div class="node-icon">📋</div>
            <div class="node-info">
              <strong>Henry Miller</strong>
              <span>Product Analyst</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="access-rules">
      <h4>Organizational Access Rules</h4>
      <p>Here are some example rules that might apply to this organization:</p>
      
      <div class="rules-grid">
        <div class="rule-card">
          <h5>📊 Management Access Rule</h5>
          <div class="rule-logic">
            <code>
              IF user is_manager_of team<br>
              THEN user can view team_reports<br>
              AND user can manage team_resources
            </code>
          </div>
          <p>Managers automatically get access to their team's resources</p>
        </div>
        
        <div class="rule-card">
          <h5>🏢 Department Access Rule</h5>
          <div class="rule-logic">
            <code>
              IF user is_member_of department<br>
              THEN user can view department_documents<br>
              AND user can access department_tools
            </code>
          </div>
          <p>Department members get access to shared departmental resources</p>
        </div>
        
        <div class="rule-card">
          <h5>📈 Hierarchy Inheritance Rule</h5>
          <div class="rule-logic">
            <code>
              IF user is_senior_to other_user<br>
              AND other_user can access resource<br>
              THEN user can access resource
            </code>
          </div>
          <p>Senior roles inherit access from their subordinates</p>
        </div>
        
        <div class="rule-card">
          <h5>🔒 Cross-Department Rule</h5>
          <div class="rule-logic">
            <code>
              IF project is_cross_functional<br>
              AND user is_assigned_to project<br>
              THEN user can access project_resources
            </code>
          </div>
          <p>Cross-functional projects grant access across departments</p>
        </div>
      </div>
    </div>

    <div class="inheritance-demo">
      <h4>Access Inheritance Simulation</h4>
      <p>See how access flows through the organizational hierarchy:</p>
      
      <div class="inheritance-controls">
        <div class="control-group">
          <label>Select Resource:</label>
          <select v-model="selectedResource">
            <option value="engineering-reports">Engineering Reports</option>
            <option value="product-roadmap">Product Roadmap</option>
            <option value="company-strategy">Company Strategy</option>
            <option value="team-budgets">Team Budgets</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Grant Initial Access To:</label>
          <select v-model="initialAccessUser">
            <option value="frank">Frank Wilson (Engineer)</option>
            <option value="grace">Grace Lee (Engineer)</option>
            <option value="henry">Henry Miller (Product Analyst)</option>
            <option value="emily">Emily Davis (Product Manager)</option>
          </select>
        </div>
        
        <button @click="simulateInheritance" class="simulate-btn">
          Simulate Access Inheritance
        </button>
      </div>
      
      <div v-if="inheritanceResult" class="inheritance-result">
        <h5>Access Inheritance Flow</h5>
        <div class="inheritance-flow">
          <div v-for="(step, index) in inheritanceResult.steps" :key="index" class="flow-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <strong>{{ step.user }}</strong> {{ step.action }}
              <code>{{ step.resource }}</code>
              <span class="step-reason">{{ step.reason }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="regional-demo">
      <h4>Regional Access Control</h4>
      <p>FGA can also model geographic hierarchies and regional access patterns:</p>
      
      <div class="regions-grid">
        <div class="region-card">
          <h5>🌍 Global Access</h5>
          <div class="region-users">
            <div class="user-badge global">Alice Johnson (CEO)</div>
            <div class="user-badge global">Diana Prince (Director)</div>
          </div>
          <div class="region-resources">
            <p><strong>Can Access:</strong></p>
            <ul>
              <li>All regional data</li>
              <li>Global reports</li>
              <li>Cross-region analytics</li>
            </ul>
          </div>
        </div>
        
        <div class="region-card">
          <h5>🏙️ North America</h5>
          <div class="region-users">
            <div class="user-badge na">Bob Smith (Product Director)</div>
            <div class="user-badge na">Emily Davis (Manager)</div>
          </div>
          <div class="region-resources">
            <p><strong>Can Access:</strong></p>
            <ul>
              <li>NA customer data</li>
              <li>NA sales reports</li>
              <li>Regional compliance docs</li>
            </ul>
          </div>
        </div>
        
        <div class="region-card">
          <h5>🌏 Asia Pacific</h5>
          <div class="region-users">
            <div class="user-badge apac">Charlie Brown (Manager)</div>
            <div class="user-badge apac">Grace Lee (Engineer)</div>
          </div>
          <div class="region-resources">
            <p><strong>Can Access:</strong></p>
            <ul>
              <li>APAC customer data</li>
              <li>APAC operational reports</li>
              <li>Local compliance requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="complexity-note">
      <h4>Handling Complexity</h4>
      <div class="note-content">
        <p>
          Real organizations often have complex, overlapping hierarchies. FGA handles this complexity by:
        </p>
        <ul>
          <li><strong>Multiple Relations:</strong> Users can have multiple roles and relationships</li>
          <li><strong>Conditional Logic:</strong> Rules can have conditions and prerequisites</li>
          <li><strong>Temporal Access:</strong> Permissions can be time-bound or event-driven</li>
          <li><strong>Audit Trails:</strong> All access decisions are logged for compliance</li>
        </ul>
        
        <div class="complexity-example">
          <h5>Example: Complex Access Scenario</h5>
          <code>
            Emily is a Product Manager in North America who is also<br>
            temporarily assigned to a global project. She should have:<br>
            • Access to NA product data (regional role)<br>
            • Access to global project resources (project assignment)<br>
            • Management access to her direct reports (hierarchy)<br>
            • Time-limited access to sensitive strategy docs (temporary)
          </code>
        </div>
      </div>
    </div>

    <div class="interactive-demo">
      <h4>Interactive Organization Demo</h4>
      <div class="demo-grid">
        <FgaAuthCheck />
        <FgaResourceList />
      </div>
    </div>

    <div class="conclusion">
      <h4>Why FGA for Organizations?</h4>
      <div class="benefits-grid">
        <div class="benefit-card">
          <h5>🔄 Dynamic Relationships</h5>
          <p>Handle org changes without rebuilding permission systems</p>
        </div>
        <div class="benefit-card">
          <h5>📏 Scalable Rules</h5>
          <p>Write rules once, apply to thousands of users and resources</p>
        </div>
        <div class="benefit-card">
          <h5>🔍 Audit Ready</h5>
          <p>Complete audit trails for compliance and security reviews</p>
        </div>
        <div class="benefit-card">
          <h5>⚡ Real-time</h5>
          <p>Access checks happen in milliseconds, even for complex hierarchies</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface InheritanceStep {
  user: string
  action: string
  resource: string
  reason: string
}

interface InheritanceResult {
  steps: InheritanceStep[]
}

const selectedResource = ref('engineering-reports')
const initialAccessUser = ref('frank')
const inheritanceResult = ref<InheritanceResult | null>(null)

const simulateInheritance = () => {
  const userMap: Record<string, string> = {
    frank: 'Frank Wilson',
    grace: 'Grace Lee', 
    henry: 'Henry Miller',
    emily: 'Emily Davis'
  }
  
  const resourceMap: Record<string, string> = {
    'engineering-reports': 'Engineering Reports',
    'product-roadmap': 'Product Roadmap',
    'company-strategy': 'Company Strategy',
    'team-budgets': 'Team Budgets'
  }
  
  const steps: InheritanceStep[] = []
  
  // Initial access grant
  steps.push({
    user: userMap[initialAccessUser.value],
    action: 'gains direct access to',
    resource: resourceMap[selectedResource.value],
    reason: 'Explicitly granted permission'
  })
  
  // Manager inheritance
  if (initialAccessUser.value === 'frank' || initialAccessUser.value === 'grace') {
    steps.push({
      user: 'Charlie Brown (Manager)',
      action: 'inherits access to',
      resource: resourceMap[selectedResource.value],
      reason: 'Manager of team member with access'
    })
  }
  
  if (initialAccessUser.value === 'henry' || initialAccessUser.value === 'emily') {
    steps.push({
      user: 'Bob Smith (Director)',
      action: 'inherits access to',
      resource: resourceMap[selectedResource.value],
      reason: 'Department head with reporting relationship'
    })
  }
  
  // Director inheritance
  if (selectedResource.value === 'engineering-reports' && (initialAccessUser.value === 'frank' || initialAccessUser.value === 'grace')) {
    steps.push({
      user: 'Diana Prince (Director)',
      action: 'inherits access to',
      resource: resourceMap[selectedResource.value],
      reason: 'Engineering Director overseeing department'
    })
  }
  
  // CEO access
  steps.push({
    user: 'Alice Johnson (CEO)',
    action: 'has access to',
    resource: resourceMap[selectedResource.value],
    reason: 'Executive privilege - can access all company resources'
  })
  
  inheritanceResult.value = { steps }
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
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.intro-panel h4 {
  margin-top: 0;
  color: #1f2937;
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

.org-chart {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  overflow-x: auto;
}

.org-level {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
}

.org-level:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 1rem;
  background: #cbd5e1;
}

.org-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  min-width: 150px;
  position: relative;
}

.org-node.ceo {
  border-color: #dc2626;
  background: linear-gradient(135deg, #fef2f2, #ffffff);
}

.org-node.director {
  border-color: #2563eb;
  background: linear-gradient(135deg, #eff6ff, #ffffff);
}

.org-node.manager {
  border-color: #059669;
  background: linear-gradient(135deg, #f0fdf4, #ffffff);
}

.org-node.employee {
  border-color: #7c3aed;
  background: linear-gradient(135deg, #f3e8ff, #ffffff);
}

.node-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.node-info {
  text-align: center;
}

.node-info strong {
  display: block;
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.node-info span {
  color: #6b7280;
  font-size: 0.75rem;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.rule-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #3b82f6;
}

.rule-card h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.rule-logic {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.rule-logic code {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
}

.rule-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.inheritance-controls {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  color: #374151;
}

.control-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.simulate-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  justify-self: start;
}

.simulate-btn:hover {
  background: #2563eb;
}

.inheritance-result {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.inheritance-result h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.inheritance-flow {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flow-step {
  display: flex;
  align-items: start;
  gap: 1rem;
}

.step-number {
  background: #3b82f6;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding: 0.5rem 0;
}

.step-content strong {
  color: #1f2937;
}

.step-content code {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin: 0 0.25rem;
}

.step-reason {
  display: block;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.regions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.region-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.region-card h5 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.region-users {
  margin-bottom: 1rem;
}

.user-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0.25rem 0.25rem 0 0;
}

.user-badge.global {
  background: #fef3c7;
  color: #92400e;
}

.user-badge.na {
  background: #dbeafe;
  color: #1e40af;
}

.user-badge.apac {
  background: #dcfce7;
  color: #166534;
}

.region-resources ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.region-resources li {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.complexity-note {
  background: #fef7cd;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.complexity-note h4 {
  margin-top: 0;
  color: #92400e;
}

.note-content ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.note-content li {
  margin-bottom: 0.5rem;
  color: #78350f;
}

.complexity-example {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.complexity-example h5 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
}

.complexity-example code {
  color: #78350f;
  line-height: 1.6;
}

.demo-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.benefit-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.benefit-card h5 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.benefit-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .inheritance-controls {
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
  
  .simulate-btn {
    grid-column: span 2;
  }
}

@media (max-width: 767px) {
  .org-level {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .regions-grid {
    grid-template-columns: 1fr;
  }
}
</style>