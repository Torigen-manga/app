import type {
  AppPreferences,
  LayoutPreferences,
  LibraryHistoryPreferences,
  ReaderPreferences,
  SystemBehaviorPreferences,
  ExperimentalPreferences
} from '@shared/types/preferences'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { invoke } from '@renderer/config/ipc'
import { toast } from 'sonner'

const PREFERENCES_QUERY_KEY = ['preferences'] as const

function usePreferences() {
  const queryClient = useQueryClient()

  const {
    data: preferences,
    isLoading: loading,
    error,
    refetch: reloadPreferences
  } = useQuery({
    queryKey: PREFERENCES_QUERY_KEY,
    queryFn: async () => {
      const preferences: AppPreferences = await invoke('preferences:load')
      return preferences
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })

  const layoutPreferences = preferences?.layoutPreferences
  const readerDisplayPreferences = preferences?.readerDisplayPreferences
  const libraryHistoryPreferences = preferences?.libraryHistoryPreferences
  const systemBehaviorPreferences = preferences?.systemBehaviorPreferences
  const experimentalPreferences = preferences?.experimentalPreferences

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: Partial<AppPreferences>) => {
      try {
        const currentPreferences = queryClient.getQueryData<AppPreferences>(PREFERENCES_QUERY_KEY)

        if (!currentPreferences) {
          throw new Error('No current preferences available')
        }

        const updatedPreferences = { ...currentPreferences, ...newPreferences }

        await invoke('preferences:save', updatedPreferences)
        return updatedPreferences
      } catch (error) {
        console.error('Failed to save preferences:', error)
        throw error
      }
    },
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(PREFERENCES_QUERY_KEY, updatedPreferences)
    },
    onError: (err) => {
      toast.error('Failed to update preferences', {
        description: err instanceof Error ? err.message : 'Unknown error'
      })
    }
  })

  const resetPreferences = useMutation({
    mutationFn: async () => {
      try {
        await invoke('preferences:reset')
        await queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY })
      } catch (error) {
        console.error('Failed to reset preferences:', error)
        throw new Error('Failed to reset preferences')
      }
    },
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(PREFERENCES_QUERY_KEY, updatedPreferences)
      toast.success('Preferences reset to default successfully')
    },
    onError: (err) => {
      toast.error('Failed to reset preferences', {
        description: err instanceof Error ? err.message : 'Unknown error'
      })
    }
  })

  function updatePreferences(newPreferences: Partial<AppPreferences>) {
    return updatePreferencesMutation.mutateAsync(newPreferences)
  }

  const updateLayoutPreferences = (newLayout: Partial<LayoutPreferences>) => {
    if (!preferences) return
    return updatePreferences({
      layoutPreferences: { ...preferences.layoutPreferences, ...newLayout }
    })
  }

  const updateReaderPreferences = (newReader: Partial<ReaderPreferences>) => {
    if (!preferences) return
    return updatePreferences({
      readerDisplayPreferences: { ...preferences.readerDisplayPreferences, ...newReader }
    })
  }

  const updateLibraryHistoryPreferences = (newHistory: Partial<LibraryHistoryPreferences>) => {
    if (!preferences) return
    return updatePreferences({
      libraryHistoryPreferences: { ...preferences.libraryHistoryPreferences, ...newHistory }
    })
  }

  const updateSystemBehaviorPreferences = (newSystem: Partial<SystemBehaviorPreferences>) => {
    if (!preferences) return
    return updatePreferences({
      systemBehaviorPreferences: { ...preferences.systemBehaviorPreferences, ...newSystem }
    })
  }

  const updateExperimentalPreferences = (newExperimental: Partial<ExperimentalPreferences>) => {
    if (!preferences) return
    return updatePreferences({
      experimentalPreferences: { ...preferences.experimentalPreferences, ...newExperimental }
    })
  }

  return {
    // Load Preferences
    preferences,
    loading,
    error,
    reloadPreferences,

    // Update Preferences
    updatePreferences,
    isUpdating: updatePreferencesMutation.isPending,
    updateError: updatePreferencesMutation.error,

    // Reset Preferences
    resetPreferences,
    isResetting: resetPreferences.isPending,
    resetError: resetPreferences.error,

    // Specific Preferences
    layoutPreferences,
    readerDisplayPreferences,
    libraryHistoryPreferences,
    systemBehaviorPreferences,
    experimentalPreferences,

    //  Update Specific Preferences
    updateLayoutPreferences,
    updateReaderPreferences,
    updateLibraryHistoryPreferences,
    updateSystemBehaviorPreferences,
    updateExperimentalPreferences
  }
}

export { usePreferences }
