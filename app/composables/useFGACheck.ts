import type { FGACheckRequest, FGACheckResponse } from '~/types/fga'

export const useFGACheck = () => {
  const { check } = useFGA()

  // Reactive state for check results
  const isLoading = ref(false)
  const lastCheck = ref<FGACheckResponse | null>(null)
  const error = ref<string | null>(null)

  // Perform an authorization check
  const performCheck = async (request: FGACheckRequest) => {
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
    return performCheck({ user, relation: 'editor', resource })
  }

  const canView = (user: string, resource: string) => {
    return performCheck({ user, relation: 'viewer', resource })
  }

  const isOwner = (user: string, resource: string) => {
    return performCheck({ user, relation: 'owner', resource })
  }

  const isAdmin = (user: string, resource: string) => {
    return performCheck({ user, relation: 'admin', resource })
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