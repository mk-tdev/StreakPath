import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/Theme';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from '../components/HabitCard';
import { AddHabitModal } from '../components/AddHabitModal';
import { Plus, User, Search, X } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { Habit } from '../utils/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DashboardProps {
  onSelectHabit: (habit: Habit) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectHabit }) => {
  const { habits, groups, addHabit, loading } = useHabits();
  const { userState, guestName, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  // Filter and group habits
  const sections = useMemo(() => {
    // Filter habits by search query
    const filteredHabits = habits.filter(habit => {
      const query = searchQuery.toLowerCase();
      return habit.name.toLowerCase().includes(query) || 
             (habit.group?.toLowerCase().includes(query));
    });

    // Group habits by their group field
    const groupedHabits: { [key: string]: Habit[] } = {};
    filteredHabits.forEach(habit => {
      const group = habit.group || 'General';
      if (!groupedHabits[group]) {
        groupedHabits[group] = [];
      }
      groupedHabits[group].push(habit);
    });

    // Convert to SectionList format and sort groups alphabetically
    return Object.keys(groupedHabits)
      .sort()
      .map(group => ({
        title: group,
        data: groupedHabits[group],
      }));
  }, [habits, searchQuery]);

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>
          {userState.user?.displayName || (userState.isGuest ? 'Guest' : 'User')}
        </Text>
      </View>
      <TouchableOpacity onPress={signOut} style={styles.profileButton}>
        <User color={Theme.colors.text} size={24} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Search color={Theme.colors.textSecondary} size={20} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search habits or groups..."
        placeholderTextColor={Theme.colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <X color={Theme.colors.textSecondary} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionBadgeText}>
          {sections.find(s => s.title === section.title)?.data.length || 0}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  // Memoize header to prevent re-renders
  const ListHeader = React.useMemo(() => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>
          {userState.user?.displayName || (userState.isGuest ? 'Guest' : 'User')}
        </Text>
      </View>
      <TouchableOpacity onPress={signOut} style={styles.profileButton}>
        <User color={Theme.colors.text} size={24} />
      </TouchableOpacity>
    </View>
  ), [insets.top, userState, signOut]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Search bar OUTSIDE SectionList to prevent focus loss */}
      <View style={styles.fixedHeader}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>
              {userState.user?.displayName || (userState.isGuest ? (guestName || 'Guest') : 'User')}
            </Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.profileButton}>
            <User color={Theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Search color={Theme.colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search habits or groups..."
            placeholderTextColor={Theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={Theme.colors.textSecondary} size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard 
            habit={item} 
            onPress={() => onSelectHabit(item)} 
          />
        )}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No habits found matching your search.' : 'No habits yet. Start one today!'}
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus color="white" size={32} />
      </TouchableOpacity>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addHabit}
        existingGroups={groups}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  listContent: {
    padding: Theme.spacing.lg,
    paddingBottom: 100,
  },
  fixedHeader: {
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
  },
  greeting: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
  },
  username: {
    color: Theme.colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Theme.colors.text,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  sectionTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  sectionBadge: {
    backgroundColor: Theme.colors.primary + '30',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  sectionBadgeText: {
    color: Theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    right: Theme.spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
