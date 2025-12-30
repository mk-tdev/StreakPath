import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/Theme';
import { useAuth } from '../context/AuthContext';
import { Chrome as Google, UserCircle, Sparkles } from 'lucide-react-native';

export const Login: React.FC = () => {
  const { loginAsGuest, guestName } = useAuth();
  const [showNameModal, setShowNameModal] = useState(false);
  const [name, setName] = useState(guestName || '');

  const handleGoogleLogin = () => {
    Alert.alert(
      'Coming Soon',
      'Google Sign-in will be available in a future update. For now, please continue as a guest.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleGuestPress = () => {
    setShowNameModal(true);
  };

  const handleContinue = () => {
    const trimmedName = name.trim();
    loginAsGuest(trimmedName || undefined);
    setShowNameModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={styles.title}>StreakPath</Text>
          <Text style={styles.subtitle}>Cultivate habits that stick.</Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Highlighted Guest Button - Primary action for beta */}
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={handleGuestPress}
            activeOpacity={0.8}
          >
            <View style={styles.recommendedBadge}>
              <Sparkles color="#fff" size={12} />
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
            <UserCircle color="#fff" size={28} style={styles.buttonIcon} />
            <Text style={styles.guestButtonText}>Get Started</Text>
            <Text style={styles.guestSubtext}>Quick setup, no account needed</Text>
          </TouchableOpacity>

          {/* De-emphasized Google Button */}
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Google color={Theme.colors.textSecondary} size={20} style={styles.buttonIcon} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Your data is stored locally on your device.
        </Text>
      </View>

      {/* Name Input Modal */}
      <Modal visible={showNameModal} animationType="fade" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What should we call you?</Text>
            <Text style={styles.modalSubtitle}>This helps personalize your experience</Text>
            
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name"
              placeholderTextColor={Theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.skipButton}
                onPress={() => {
                  setName('');
                  handleContinue();
                }}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  logoText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    color: Theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: Theme.spacing.md,
  },
  guestButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.xl,
    width: '100%',
    backgroundColor: Theme.colors.primary,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.success,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
    gap: 4,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Theme.spacing.sm,
  },
  guestSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    width: '100%',
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    opacity: 0.7,
  },
  googleButtonText: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  comingSoonBadge: {
    marginLeft: Theme.spacing.sm,
    backgroundColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  comingSoonText: {
    color: Theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: Theme.spacing.sm,
  },
  footerText: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
    position: 'absolute',
    bottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: Theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.xl,
  },
  nameInput: {
    backgroundColor: Theme.colors.background,
    color: Theme.colors.text,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    fontSize: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  skipButton: {
    flex: 1,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  skipButtonText: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
