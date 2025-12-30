import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Theme } from '../theme/Theme';
import { X, Check, Plus, ChevronDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string, color: string, group?: string) => void;
  existingGroups: string[];
}

const ICONS = ['Activity', 'Apple', 'Moon', 'Book', 'Coffee', 'Heart', 'Smile', 'Sun'];
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#94a3b8'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose, onAdd, existingGroups }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedGroup, setSelectedGroup] = useState<string>('General');
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const insets = useSafeAreaInsets();

  // Combine existing groups with "General" at the start
  const allGroups = ['General', ...existingGroups.filter(g => g !== 'General')];

  const handleAdd = () => {
    if (name.trim()) {
      const finalGroup = isCreatingNewGroup && newGroupName.trim() 
        ? newGroupName.trim() 
        : selectedGroup;
      onAdd(name, selectedIcon, selectedColor, finalGroup);
      // Reset form
      setName('');
      setSelectedGroup('General');
      setIsCreatingNewGroup(false);
      setNewGroupName('');
      onClose();
    }
  };

  const handleSelectGroup = (group: string) => {
    setSelectedGroup(group);
    setIsCreatingNewGroup(false);
    setShowGroupPicker(false);
  };

  const handleCreateNewGroup = () => {
    setIsCreatingNewGroup(true);
    setShowGroupPicker(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>New Habit</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={Theme.colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.label}>HABIT NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Go for a walk"
              placeholderTextColor={Theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoFocus
            />

            <Text style={styles.label}>GROUP</Text>
            {isCreatingNewGroup ? (
              <View style={styles.newGroupContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter new group name"
                  placeholderTextColor={Theme.colors.textSecondary}
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                  autoFocus
                />
                <TouchableOpacity 
                  style={styles.cancelNewGroup}
                  onPress={() => {
                    setIsCreatingNewGroup(false);
                    setNewGroupName('');
                  }}
                >
                  <X color={Theme.colors.textSecondary} size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.groupSelector}
                onPress={() => setShowGroupPicker(!showGroupPicker)}
              >
                <Text style={styles.groupSelectorText}>{selectedGroup}</Text>
                <ChevronDown color={Theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            )}

            {showGroupPicker && (
              <View style={styles.groupPicker}>
                {allGroups.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.groupOption,
                      selectedGroup === group && styles.groupOptionSelected
                    ]}
                    onPress={() => handleSelectGroup(group)}
                  >
                    <Text style={[
                      styles.groupOptionText,
                      selectedGroup === group && styles.groupOptionTextSelected
                    ]}>{group}</Text>
                    {selectedGroup === group && (
                      <Check color={Theme.colors.primary} size={16} />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.createNewGroupOption}
                  onPress={handleCreateNewGroup}
                >
                  <Plus color={Theme.colors.primary} size={16} />
                  <Text style={styles.createNewGroupText}>Create New Group</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.label}>ICON</Text>
            <View style={styles.iconGrid}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconItem,
                    selectedIcon === icon && { borderColor: Theme.colors.primary, borderWidth: 2 }
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={{color: Theme.colors.text}}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>COLOR</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color },
                    selectedColor === color && { borderColor: Theme.colors.text, borderWidth: 2 }
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={[styles.addButton, { marginBottom: Math.max(insets.bottom, 16) }]} 
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>Create Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    height: '85%',
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  title: {
    color: Theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  label: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  input: {
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.text,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  groupSelector: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupSelectorText: {
    color: Theme.colors.text,
    fontSize: 16,
  },
  groupPicker: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginTop: Theme.spacing.sm,
    overflow: 'hidden',
  },
  groupOption: {
    padding: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  groupOptionSelected: {
    backgroundColor: Theme.colors.primary + '20',
  },
  groupOptionText: {
    color: Theme.colors.text,
    fontSize: 16,
  },
  groupOptionTextSelected: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  createNewGroupOption: {
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  createNewGroupText: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  newGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  cancelNewGroup: {
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  iconItem: {
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.full,
  },
  addButton: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
  },
  addButtonText: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
