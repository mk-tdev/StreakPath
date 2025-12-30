import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit } from '../utils/types';
import { HabitStorage } from '../services/HabitStorage';
import { GoogleDriveSync } from '../services/GoogleDriveSync';
import { useAuth } from './AuthContext';

interface HabitContextType {
  habits: Habit[];
  groups: string[]; // Unique group names derived from habits
  addHabit: (name: string, icon: string, color: string, group?: string) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  loading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { userState } = useAuth();

  // Derive unique groups from habits
  const groups = React.useMemo(() => {
    const groupSet = new Set<string>();
    habits.forEach(h => {
      if (h.group) groupSet.add(h.group);
    });
    return Array.from(groupSet).sort();
  }, [habits]);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    setLoading(true);
    const localHabits = await HabitStorage.getHabits();
    if (localHabits.length === 0) {
      const sampleHabit: Habit = {
        id: 'sample-1',
        name: 'Daily Meditation',
        icon: 'Activity',
        color: '#6366f1',
        createdAt: Date.now(),
        frequency: 'daily',
        completions: {},
        group: 'Wellness',
      };
      await HabitStorage.saveHabits([sampleHabit]);
      setHabits([sampleHabit]);
    } else {
      setHabits(localHabits);
    }
    setLoading(false);
  };

  const addHabit = async (name: string, icon: string, color: string, group?: string) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substring(7),
      name,
      icon,
      color,
      createdAt: Date.now(),
      frequency: 'daily',
      completions: {},
      group: group || 'General',
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await HabitStorage.saveHabits(updatedHabits);
    
    if (!userState.isGuest && userState.user) {
      await GoogleDriveSync.syncToDrive(updatedHabits);
    }
  };

  const updateHabit = async (updatedHabit: Habit) => {
    const updatedHabits = habits.map(h => h.id === updatedHabit.id ? updatedHabit : h);
    setHabits(updatedHabits);
    await HabitStorage.saveHabits(updatedHabits);
  };

  const toggleCompletion = async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const currentStatus = habit.completions[date];
    let nextStatus: 'done' | 'fail' | 'skip' | undefined;

    if (!currentStatus) nextStatus = 'done';
    else if (currentStatus === 'done') nextStatus = 'fail';
    else if (currentStatus === 'fail') nextStatus = 'skip';
    else nextStatus = undefined; // 4th tap: switch back to blank

    const newCompletions = { ...habit.completions };
    if (nextStatus) {
      newCompletions[date] = nextStatus;
    } else {
      delete newCompletions[date];
    }

    const updatedHabit = { ...habit, completions: newCompletions };
    await updateHabit(updatedHabit);
  };

  const deleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    setHabits(updatedHabits);
    await HabitStorage.saveHabits(updatedHabits);
    
    if (!userState.isGuest && userState.user) {
      await GoogleDriveSync.syncToDrive(updatedHabits);
    }
  };

  return (
    <HabitContext.Provider value={{ habits, groups, addHabit, updateHabit, toggleCompletion, deleteHabit, loading }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
