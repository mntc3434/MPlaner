import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { requestNotificationPermissions, cancelAllNotifications } from '../utils/notifications';

function GlassCard({ children, style, theme }) {
  return (
    <View style={[styles.glassCardWrapper, { borderColor: theme.glassBorder }, style]}>
      <BlurView intensity={20} tint={theme.mode} style={styles.glassEffect}>
        <View style={styles.glassContent}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

export default function SettingsScreen() {
  const { userProfile, theme, toggleTheme, themeMode, updateProfile } = useApp();
  const [notifs, setNotifs] = useState(false);

  const [editState, setEditState] = useState({
    name: userProfile.name,
    height: String(userProfile.height),
    startWeight: String(userProfile.startWeight),
    goalWeight: String(userProfile.goalWeight),
    calorieTarget: String(userProfile.calorieTarget),
  });

  const saveUpdates = () => {
    updateProfile({
      name: editState.name,
      height: parseFloat(editState.height) || userProfile.height,
      startWeight: parseFloat(editState.startWeight) || userProfile.startWeight,
      goalWeight: parseFloat(editState.goalWeight) || userProfile.goalWeight,
      calorieTarget: parseInt(editState.calorieTarget) || userProfile.calorieTarget,
    });
    Alert.alert('Profile Updated', 'Your changes have been saved to Minte Planer.');
  };

  async function handleToggleNotifs(val) {
    if (val) {
      const granted = await requestNotificationPermissions();
      if (granted) setNotifs(true);
      else Alert.alert('Permission Denied', 'Please enable notifications in settings.');
    } else {
      await cancelAllNotifications();
      setNotifs(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            <TouchableOpacity style={styles.saveHeaderBtn} onPress={saveUpdates}>
              <Text style={styles.saveHeaderText}>SAVE</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
          <GlassCard theme={theme}>
            <View style={styles.row}>
              <View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Day / Night Mode</Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>Current: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.themeBtn, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]} 
                onPress={toggleTheme}
              >
                <Ionicons name={themeMode === 'dark' ? "sunny" : "moon"} size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </GlassCard>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>User Profile</Text>
          <GlassCard theme={theme}>
            <EditableInput 
              label="Full Name" 
              value={editState.name} 
              onChange={(v) => setEditState(p => ({ ...p, name: v }))} 
              theme={theme} 
            />
            <Divider theme={theme} />
            <EditableInput 
              label="Height (cm)" 
              value={editState.height} 
              keyboardType="number-pad" 
              onChange={(v) => setEditState(p => ({ ...p, height: v }))} 
              theme={theme} 
            />
          </GlassCard>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Weights & Goals</Text>
          <GlassCard theme={theme}>
            <EditableInput 
              label="Starting Weight (kg)" 
              value={editState.startWeight} 
              keyboardType="decimal-pad" 
              onChange={(v) => setEditState(p => ({ ...p, startWeight: v }))} 
              theme={theme} 
            />
            <Divider theme={theme} />
            <EditableInput 
              label="Goal Weight (kg)" 
              value={editState.goalWeight} 
              keyboardType="decimal-pad" 
              onChange={(v) => setEditState(p => ({ ...p, goalWeight: v }))} 
              theme={theme} 
            />
            <Divider theme={theme} />
            <EditableInput 
              label="Daily Calories (kcal)" 
              value={editState.calorieTarget} 
              keyboardType="number-pad" 
              onChange={(v) => setEditState(p => ({ ...p, calorieTarget: v }))} 
              theme={theme} 
            />
          </GlassCard>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Notifications</Text>
          <GlassCard theme={theme}>
            <View style={styles.row}>
              <View>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Push Reminders</Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>Meal and workout alerts</Text>
              </View>
              <Switch
                value={notifs}
                onValueChange={handleToggleNotifs}
                trackColor={{ false: theme.border, true: COLORS.primary }}
                thumbColor={notifs ? '#fff' : '#888'}
              />
            </View>
          </GlassCard>

          <TouchableOpacity style={styles.saveMainBtn} onPress={saveUpdates}>
             <Text style={styles.saveMainTxt}>Confirm All Changes</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EditableInput({ label, value, onChange, keyboardType = 'default', theme }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      <TextInput
        style={[styles.inputField, { color: COLORS.primary, borderBottomColor: theme.border }]}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder="..."
        placeholderTextColor={theme.textMuted}
        selectTextOnFocus
      />
    </View>
  );
}

function Divider({ theme }) {
  return <View style={[styles.divider, { backgroundColor: theme.border }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontSize: 28, fontWeight: '900' },
  saveHeaderBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 },
  saveHeaderText: { fontSize: 12, fontWeight: '900', color: '#000' },

  glassCardWrapper: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, marginBottom: SPACING.sm },
  glassEffect: { borderRadius: RADIUS.lg },
  glassContent: { paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: 11, fontWeight: '700', marginTop: SPACING.lg, marginBottom: SPACING.sm, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  settingSub: { fontSize: 12, marginTop: 2 },
  inputField: { fontSize: 15, fontWeight: '800', textAlign: 'right', minWidth: 100 },
  
  divider: { height: 1 },
  themeBtn: { padding: 8, borderRadius: 12, borderWidth: 1 },
  
  saveMainBtn: { marginTop: SPACING.xl, backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  saveMainTxt: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
});
