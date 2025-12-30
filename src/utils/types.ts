export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
  frequency: 'daily' | 'weekly';
  completions: { [date: string]: 'skip' | 'done' | 'fail' };
  group?: string; // Optional group for organization (e.g., "Exercise", "Diet")
}

export interface UserState {
  isGuest: boolean;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
}
