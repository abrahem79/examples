// Fine-Grained Authorization Types

export interface FGAUser {
  id: string
  name: string
  email: string
  roles?: string[]
}

export interface FGAResource {
  id: string
  type: string
  name: string
  owner?: string
  attributes?: Record<string, any>
}

export interface FGARelation {
  user: string
  relation: string
  resource: string
}

export interface FGACheckRequest {
  user: string
  relation: string
  resource: string
}

export interface FGACheckResponse {
  allowed: boolean
  reason?: string
  timestamp: string
}

export interface FGAQueryRequest {
  user: string
  relation: string
  resourceType?: string
}

export interface FGAQueryResponse {
  resources: FGAResource[]
  total: number
  timestamp: string
}

export interface FGARole {
  id: string
  name: string
  permissions: string[]
  description?: string
}

export interface FGAPermission {
  id: string
  name: string
  description: string
  actions: string[]
}

// Common relation types
export const FGA_RELATIONS = {
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  ADMIN: 'admin',
  MEMBER: 'member',
  MANAGER: 'manager',
  CONTRIBUTOR: 'contributor',
} as const

// Common resource types
export const FGA_RESOURCE_TYPES = {
  DOCUMENT: 'document',
  PROJECT: 'project',
  ORGANIZATION: 'organization',
  TEAM: 'team',
  REPORT: 'report',
  APPLICATION: 'application',
} as const

// Common actions
export const FGA_ACTIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  SHARE: 'share',
  MANAGE: 'manage',
  EDIT: 'edit',
  VIEW: 'view',
  ADMIN: 'admin',
} as const