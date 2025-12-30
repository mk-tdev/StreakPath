/**
 * Analytics service for tracking user behavior and app usage
 * 
 * Note: Firebase Analytics (firebase/analytics) is web-only and not compatible with React Native.
 * This service provides a no-op implementation for now.
 * 
 * For production analytics, consider:
 * - Expo Analytics (built-in)
 * - Google Analytics 4 for Firebase (requires native modules)
 * - Custom analytics backend
 */

const isDev = __DEV__;

export const Analytics = {
  /**
   * Log a custom event
   */
  logEvent: (eventName: string, params?: Record<string, any>) => {
    if (isDev) {
      console.log('[Analytics]', eventName, params);
    }
    // TODO: Implement with React Native compatible solution
  },

  /**
   * Set user properties
   */
  setUserProperty: (name: string, value: string) => {
    if (isDev) {
      console.log('[Analytics] User Property:', name, value);
    }
    // TODO: Implement with React Native compatible solution
  },

  // Predefined events
  events: {
    // Auth events
    loginGuest: (hasName: boolean) => {
      Analytics.logEvent('login_guest', { has_name: hasName });
    },

    // Habit events
    habitCreated: (group: string) => {
      Analytics.logEvent('habit_created', { 
        group,
        has_group: !!group && group !== 'General'
      });
    },

    habitCompleted: (habitId: string) => {
      Analytics.logEvent('habit_completed', { habit_id: habitId });
    },

    habitDeleted: (habitId: string) => {
      Analytics.logEvent('habit_deleted', { habit_id: habitId });
    },

    // Group events
    groupCreated: (groupName: string) => {
      Analytics.logEvent('group_created', { group_name: groupName });
    },

    // Search events
    searchUsed: (queryLength: number) => {
      Analytics.logEvent('search_used', { query_length: queryLength });
    },

    // Screen views
    screenView: (screenName: string) => {
      Analytics.logEvent('screen_view', { 
        screen_name: screenName,
        screen_class: screenName
      });
    },
  }
};
