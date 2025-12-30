import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Habit } from '../utils/types';
import { Theme } from '../theme/Theme';
import * as Icons from 'lucide-react-native';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const IconComponent = (Icons as any)[habit.icon] || Icons.Circle;

  // Calculate streak or today's status
  const today = new Date().toISOString().split('T')[0];
  const todayStatus = habit.completions[today];

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: Theme.colors.surface }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
        <IconComponent size={24} color={habit.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
        <Text style={styles.status}>
          {todayStatus === 'done' ? 'Completed today' : 'Tap to view progress'}
        </Text>
      </View>
      {todayStatus === 'done' && (
        <View style={styles.badge}>
          <Icons.CheckCircle2 size={16} color={Theme.colors.success} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  status: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  badge: {
    marginLeft: Theme.spacing.sm,
  }
});
