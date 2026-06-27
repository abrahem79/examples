import type {
  FGAUser,
  FGAResource,
  FGARelation,
  FGACheckRequest,
  FGACheckResponse,
  FGAQueryRequest,
  FGAQueryResponse,
  FGARole,
} from '~/types/fga'
import { FGA_RELATIONS, FGA_RESOURCE_TYPES } from '~/types/fga'

// Mock data for demo purposes
const mockUsers: FGAUser[] = [
  { id: 'user:alice', name: 'Alice Johnson', email: 'alice@example.com', roles: ['admin'] },
  { id: 'user:bob', name: 'Bob Smith', email: 'bob@example.com', roles: ['editor'] },
  { id: 'user:charlie', name: 'Charlie Brown', email: 'charlie@example.com', roles: ['viewer'] },
  { id: 'user:diana', name: 'Diana Prince', email: 'diana@example.com', roles: ['manager'] },
]

const mockResources: FGAResource[] = [
  { id: 'document:report-2024', type: FGA_RESOURCE_TYPES.DOCUMENT, name: '2024 Annual Report', owner: 'user:alice' },
  { id: 'document:strategy-plan', type: FGA_RESOURCE_TYPES.DOCUMENT, name: 'Strategy Plan', owner: 'user:bob' },
  { id: 'project:website-redesign', type: FGA_RESOURCE_TYPES.PROJECT, name: 'Website Redesign', owner: 'user:alice' },
  { id: 'organization:acme-corp', type: FGA_RESOURCE_TYPES.ORGANIZATION, name: 'ACME Corp', owner: 'user:alice' },
  { id: 'team:engineering', type: FGA_RESOURCE_TYPES.TEAM, name: 'Engineering Team', owner: 'user:diana' },
]

const mockRelations: FGARelation[] = [
  // Alice owns and can edit multiple resources
  { user: 'user:alice', relation: FGA_RELATIONS.OWNER, resource: 'document:report-2024' },
  { user: 'user:alice', relation: FGA_RELATIONS.OWNER, resource: 'project:website-redesign' },
  { user: 'user:alice', relation: FGA_RELATIONS.ADMIN, resource: 'organization:acme-corp' },
  
  // Bob can edit some documents
  { user: 'user:bob', relation: FGA_RELATIONS.OWNER, resource: 'document:strategy-plan' },
  { user: 'user:bob', relation: FGA_RELATIONS.EDITOR, resource: 'document:report-2024' },
  { user: 'user:bob', relation: FGA_RELATIONS.MEMBER, resource: 'team:engineering' },
  
  // Charlie has viewer access
  { user: 'user:charlie', relation: FGA_RELATIONS.VIEWER, resource: 'document:report-2024' },
  { user: 'user:charlie', relation: FGA_RELATIONS.VIEWER, resource: 'document:strategy-plan' },
  { user: 'user:charlie', relation: FGA_RELATIONS.MEMBER, resource: 'team:engineering' },
  
  // Diana manages the team
  { user: 'user:diana', relation: FGA_RELATIONS.MANAGER, resource: 'team:engineering' },
  { user: 'user:diana', relation: FGA_RELATIONS.EDITOR, resource: 'project:website-redesign' },
]

const mockRoles: FGARole[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['read', 'write', 'delete', 'manage', 'share'],
    description: 'Full access to all resources and administrative functions'
  },
  {
    id: 'editor',
    name: 'Editor',
    permissions: ['read', 'write', 'share'],
    description: 'Can read, edit, and share resources'
  },
  {
    id: 'viewer',
    name: 'Viewer',
    permissions: ['read'],
    description: 'Can only view resources'
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: ['read', 'write', 'manage'],
    description: 'Can manage teams and resources'
  },
]

export const useFGA = () => {
  // Current user state (for demo purposes)
  const currentUser = useState<FGAUser>('fga-current-user', () => mockUsers[0])

  // Check API - Fast access checks
  const check = async (request: FGACheckRequest): Promise<FGACheckResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const relation = mockRelations.find(
      r => r.user === request.user && 
           r.relation === request.relation && 
           r.resource === request.resource
    )
    
    const allowed = !!relation
    
    return {
      allowed,
      reason: allowed ? `User has ${request.relation} relation to ${request.resource}` : `Access denied: User does not have ${request.relation} relation to ${request.resource}`,
      timestamp: new Date().toISOString()
    }
  }

  // Query API - Find resources user has access to
  const query = async (request: FGAQueryRequest): Promise<FGAQueryResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const userRelations = mockRelations.filter(
      r => r.user === request.user && r.relation === request.relation
    )
    
    let resources = userRelations.map(relation => {
      return mockResources.find(resource => resource.id === relation.resource)
    }).filter(Boolean) as FGAResource[]
    
    // Filter by resource type if specified
    if (request.resourceType) {
      resources = resources.filter(r => r.type === request.resourceType)
    }
    
    return {
      resources,
      total: resources.length,
      timestamp: new Date().toISOString()
    }
  }

  // Helper function to check if current user can perform action on resource
  const canUserPerformAction = async (action: string, resourceId: string): Promise<boolean> => {
    const response = await check({
      user: currentUser.value.id,
      relation: action,
      resource: resourceId
    })
    return response.allowed
  }

  // Get all users (for demo purposes)
  const getUsers = () => mockUsers

  // Get all resources (for demo purposes)
  const getResources = () => mockResources

  // Get all roles (for demo purposes)
  const getRoles = () => mockRoles

  // Get relations for a user (for demo purposes)
  const getUserRelations = (userId: string) => {
    return mockRelations.filter(r => r.user === userId)
  }

  // Switch current user (for demo purposes)
  const setCurrentUser = (user: FGAUser) => {
    currentUser.value = user
  }

  return {
    currentUser: readonly(currentUser),
    check,
    query,
    canUserPerformAction,
    getUsers,
    getResources,
    getRoles,
    getUserRelations,
    setCurrentUser,
  }
}