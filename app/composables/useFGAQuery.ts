import type { FGAQueryRequest, FGAQueryResponse, FGAResource } from '~/types/fga'
import { FGA_RESOURCE_TYPES } from '~/types/fga'

export const useFGAQuery = () => {
  const { query } = useFGA()

  // Reactive state for query results
  const isLoading = ref(false)
  const lastQuery = ref<FGAQueryResponse | null>(null)
  const error = ref<string | null>(null)

  // Perform a resource query
  const performQuery = async (request: FGAQueryRequest) => {
    if (!request || !request.user || !request.relation) {
      const result: FGAQueryResponse = {
        resources: [],
        total: 0,
        timestamp: new Date().toISOString(),
      }
      lastQuery.value = result
      return result
    }

    isLoading.value = true
    error.value = null
    
    try {
      const result = await query(request)
      lastQuery.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Query failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Quick helpers for common queries
  const getEditableResources = (user: string, resourceType?: string) => {
    return performQuery({ user: user ?? '', relation: 'editor', resourceType })
  }

  const getViewableResources = (user: string, resourceType?: string) => {
    return performQuery({ user: user ?? '', relation: 'viewer', resourceType })
  }

  const getOwnedResources = (user: string, resourceType?: string) => {
    return performQuery({ user: user ?? '', relation: 'owner', resourceType })
  }

  const getManagedResources = (user: string, resourceType?: string) => {
    return performQuery({ user: user ?? '', relation: 'manager', resourceType })
  }

  // Get all documents user can edit
  const getEditableDocuments = (user: string) => {
    return getEditableResources(user ?? '', FGA_RESOURCE_TYPES.DOCUMENT)
  }

  // Get all projects user can view
  const getViewableProjects = (user: string) => {
    return getViewableResources(user ?? '', FGA_RESOURCE_TYPES.PROJECT)
  }

  // Get all teams user manages
  const getManagedTeams = (user: string) => {
    return getManagedResources(user ?? '', FGA_RESOURCE_TYPES.TEAM)
  }

  // Clear state
  const clearQuery = () => {
    lastQuery.value = null
    error.value = null
  }

  // Computed for easy access to resources
  const resources = computed(() => lastQuery.value?.resources || [])
  const resourceCount = computed(() => lastQuery.value?.total || 0)

  return {
    isLoading: readonly(isLoading),
    lastQuery: readonly(lastQuery),
    resources,
    resourceCount,
    error: readonly(error),
    performQuery,
    getEditableResources,
    getViewableResources,
    getOwnedResources,
    getManagedResources,
    getEditableDocuments,
    getViewableProjects,
    getManagedTeams,
    clearQuery,
  }
}