import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../utils/types';

const HABITS_KEY = '@streakpath_habits';

export const HabitStorage = {
  async getHabits(): Promise<Habit[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading habits', e);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(habits);
      await AsyncStorage.setItem(HABITS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving habits', e);
    }
  },

  async addHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits();
    habits.push(habit);
    await this.saveHabits(habits);
  },

  async updateHabit(updatedHabit: Habit): Promise<void> {
    const habits = await this.getHabits();
    const index = habits.findIndex(h => h.id === updatedHabit.id);
    if (index !== -1) {
      habits[index] = updatedHabit;
      await this.saveHabits(habits);
    }
  }
};
