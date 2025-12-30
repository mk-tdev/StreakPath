import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { HabitProvider, useHabits } from './src/context/HabitContext';
import { Dashboard } from './src/screens/Dashboard';
import { HabitDetail } from './src/screens/HabitDetail';
import { Login } from './src/screens/Login';
import { Habit } from './src/utils/types';
import { Theme } from './src/theme/Theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppNavigator: React.FC = () => {
  const { userState } = useAuth();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  if (!userState.user && !userState.isGuest) {
    return <Login />;
  }

  if (selectedHabitId) {
    return (
      <HabitDetail 
        habitId={selectedHabitId} 
        onBack={() => setSelectedHabitId(null)} 
      />
    );
  }

  return <Dashboard onSelectHabit={(habit: Habit) => setSelectedHabitId(habit.id)} />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <HabitProvider>
          <View style={styles.container}>
            <AppNavigator />
          </View>
        </HabitProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
});
