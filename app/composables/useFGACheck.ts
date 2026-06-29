import type { FGACheckRequest, FGACheckResponse } from '~/types/fga'

export const useFGACheck = () => {
  const { check } = useFGA()

  // Reactive state for check results
  const isLoading = ref(false)
  const lastCheck = ref<FGACheckResponse | null>(null)
  const error = ref<string | null>(null)

  // Perform an authorization check
  const performCheck = async (request: FGACheckRequest) => {
    if (!request || !request.user || !request.relation || !request.resource) {
      const result: FGACheckResponse = {
        allowed: false,
        reason: 'Invalid check request: user, relation, and resource are required',
        timestamp: new Date().toISOString(),
      }
      lastCheck.value = result
      return result
    }

    isLoading.value = true
    error.value = null
    
    try {
      const result = await check(request)
      lastCheck.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Check failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Quick helper for common checks
  const canEdit = (user: string, resource: string) => {
    return performCheck({ user: user ?? '', relation: 'editor', resource: resource ?? '' })
  }

  const canView = (user: string, resource: string) => {
    return performCheck({ user: user ?? '', relation: 'viewer', resource: resource ?? '' })
  }

  const isOwner = (user: string, resource: string) => {
    return performCheck({ user: user ?? '', relation: 'owner', resource: resource ?? '' })
  }

  const isAdmin = (user: string, resource: string) => {
    return performCheck({ user: user ?? '', relation: 'admin', resource: resource ?? '' })
  }

  // Clear state
  const clearCheck = () => {
    lastCheck.value = null
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    lastCheck: readonly(lastCheck),
    error: readonly(error),
    performCheck,
    canEdit,
    canView,
    isOwner,
    isAdmin,
    clearCheck,
  }
}