import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/Theme';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../utils/types';
import { Calendar, DateData } from 'react-native-calendars';
import { ArrowLeft, Trash2, CheckCircle2, XCircle, MinusCircle } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HabitDetailProps {
  habitId: string;
  onBack: () => void;
}

export const HabitDetail: React.FC<HabitDetailProps> = ({ habitId, onBack }) => {
  const { habits, toggleCompletion, deleteHabit } = useHabits();
  const insets = useSafeAreaInsets();
  
  // Track visible month for stats
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  
  // Fetch habit from context to ensure reactive updates
  const habit = habits.find((h: Habit) => h.id === habitId);

  // All hooks must be called before any early return
  const markedDates = useMemo(() => {
    if (!habit) return {};
    const marked: any = {};
    Object.keys(habit.completions).forEach((date) => {
      const status = habit.completions[date];
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: status === 'done' ? Theme.colors.success : status === 'fail' ? Theme.colors.error : Theme.colors.warning,
            borderRadius: Theme.borderRadius.sm,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    });
    return marked;
  }, [habit?.completions]);

  const calculateStats = () => {
    if (!habit) return { done: 0, total: 0 };
    const completions = Object.entries(habit.completions)
      .filter(([date]) => date.startsWith(currentMonth));
    
    const done = completions.filter(([_, status]) => status === 'done').length;
    return { done, total: completions.length };
  };

  const stats = calculateStats();
  const monthName = new Date(currentMonth + '-02').toLocaleString('default', { month: 'long' });

  const handleDayPress = (day: DateData) => {
    if (!habit) return;
    const today = new Date().toISOString().split('T')[0];
    if (day.dateString > today) {
      // Prevent updating future dates
      return;
    }
    toggleCompletion(habit.id, day.dateString);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(habitId);
            onBack();
          }
        },
      ]
    );
  };

  // Early return AFTER all hooks have been called
  if (!habit) return null;

  const IconComponent = (Icons as any)[habit.icon] || Icons.Circle;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.iconButton} 
          activeOpacity={0.7} 
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <ArrowLeft color={Theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity 
          style={styles.iconButton} 
          activeOpacity={0.7}
          onPress={handleDelete}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Trash2 color={Theme.colors.error} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.habitInfo}>
          <View style={[styles.iconBox, { backgroundColor: habit.color + '20' }]}>
            <IconComponent size={32} color={habit.color} />
          </View>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.habitFrequency}>Daily Habit</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.done}</Text>
            <Text style={styles.statLabel}>{monthName} days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habit.frequency}</Text>
            <Text style={styles.statLabel}>Frequency</Text>
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            theme={{
              backgroundColor: Theme.colors.surface,
              calendarBackground: Theme.colors.surface,
              textSectionTitleColor: Theme.colors.textSecondary,
              selectedDayBackgroundColor: Theme.colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: Theme.colors.primary,
              dayTextColor: Theme.colors.text,
              textDisabledColor: Theme.colors.border,
              dotColor: Theme.colors.primary,
              selectedDotColor: '#ffffff',
              arrowColor: Theme.colors.primary,
              disabledArrowColor: '#d9e1e8',
              monthTextColor: Theme.colors.text,
              indicatorColor: 'blue',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
            markingType={'custom'}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            onMonthChange={(month) => {
              setCurrentMonth(month.dateString.substring(0, 7));
            }}
            enableSwipeMonths={true}
          />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <CheckCircle2 size={16} color={Theme.colors.success} />
            <Text style={styles.legendText}>Done</Text>
          </View>
          <View style={styles.legendItem}>
            <XCircle size={16} color={Theme.colors.error} />
            <Text style={styles.legendText}>Fail</Text>
          </View>
          <View style={styles.legendItem}>
            <MinusCircle size={16} color={Theme.colors.warning} />
            <Text style={styles.legendText}>Skip</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  headerTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    zIndex: 10,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  habitInfo: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  habitName: {
    color: Theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  habitFrequency: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: Theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statLabel: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  calendarContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Theme.spacing.lg,
    marginTop: Theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  legendText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
  }
});
