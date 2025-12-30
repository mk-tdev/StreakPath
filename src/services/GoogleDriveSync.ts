import { Habit } from '../utils/types';

/**
 * Service to handle Google Drive synchronization.
 * Requires Google Sign-in and Drive API access.
 */
export const GoogleDriveSync = {
  /**
   * Syncs habits to Google Drive appData folder.
   */
  async syncToDrive(habits: Habit[]): Promise<void> {
    console.warn('Google Drive Sync: syncToDrive not fully implemented. Requires GDrive API setup.');
    // TODO: Implement using Google Drive REST API
  },

  /**
   * Fetches habits from Google Drive appData folder.
   */
  async fetchFromDrive(): Promise<Habit[] | null> {
    console.warn('Google Drive Sync: fetchFromDrive not fully implemented.');
    return null;
  }
};
