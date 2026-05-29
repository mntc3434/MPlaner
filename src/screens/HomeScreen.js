import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

function GlassCard({ children, style, theme }) {
  return (
    <View style={[styles.glassCardWrapper, { borderColor: theme.glassBorder }, style]}>
      <BlurView intensity={20} tint={theme.mode === 'light' ? 'light' : 'dark'} style={styles.glassEffect}>
        <View style={styles.glassContent}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { 
    userProfile, weightGained, progressToGoal, logWeight, 
    caloriesEaten, todaysMeals, todaysWorkout, exercisesDone,
    theme, themeMode, toggleTheme
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const today = format(new Date(), 'EEEE, MMM d');

  async function handleLog() {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w < 30) return;
    await logWeight(w);
    setShowModal(false);
    setWeightInput('');
  }

  const totalExercises = todaysWorkout?.exercises?.length || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.dateText, { color: theme.textSecondary }]}>{today}</Text>
            <Text style={[styles.greeting, { color: theme.text }]}>Hey {userProfile.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.themeBtn, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]} 
              onPress={toggleTheme}
            >
              <Ionicons 
                name={themeMode === 'dark' ? "sunny-outline" : "moon-outline"} 
                size={22} 
                color={theme.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.profileBtn, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]} 
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="person-outline" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Card */}
        <GlassCard theme={theme} style={styles.heroCard}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>CURRENT WEIGHT</Text>
          <View style={styles.weightRow}>
            <Text style={[styles.weightValue, { color: theme.text }]}>{userProfile.currentWeight.toFixed(1)}</Text>
            <Text style={[styles.weightUnit, { color: theme.textSecondary }]}>{userProfile.units}</Text>
          </View>
          <View style={styles.gainRow}>
            <View style={[styles.gainBadge, { backgroundColor: COLORS.primary + '15' }]}>
              <Ionicons name="trending-up" size={14} color={COLORS.primary} />
              <Text style={styles.gainText}>+{weightGained.toFixed(1)} gained</Text>
            </View>
          </View>
          
          <View style={styles.goalInfo}>
            <Text style={[styles.goalLabel, { color: theme.textSecondary }]}>Progress to {userProfile.goalWeight} {userProfile.units}</Text>
            <Text style={styles.goalPct}>{progressToGoal.toFixed(0)}%</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${progressToGoal}%` }]} />
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.glassBorder }]} onPress={() => setShowModal(true)}>
            <BlurView intensity={25} tint={themeMode === 'light' ? 'light' : 'dark'} style={styles.actionInner}>
              <Ionicons name="scale-outline" size={24} color={COLORS.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>Log Weight</Text>
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.glassBorder }]} onPress={() => navigation.navigate('Meals')}>
            <BlurView intensity={25} tint={themeMode === 'light' ? 'light' : 'dark'} style={styles.actionInner}>
              <Ionicons name="restaurant-outline" size={24} color={COLORS.accent} />
              <Text style={[styles.actionText, { color: theme.text }]}>Log Meal</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Mini Stats */}
        <View style={styles.miniGrid}>
          <GlassCard theme={theme} style={styles.miniCard}>
            <MaterialCommunityIcons name="fire" size={22} color={COLORS.warning} />
            <Text style={[styles.miniValue, { color: theme.text }]}>{caloriesEaten}</Text>
            <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>Kcal Today</Text>
          </GlassCard>
          <GlassCard theme={theme} style={styles.miniCard}>
            <Ionicons name="fitness" size={22} color={COLORS.primary} />
            <Text style={[styles.miniValue, { color: theme.text }]}>{exercisesDone} / {totalExercises}</Text>
            <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>Exercises</Text>
          </GlassCard>
        </View>

        {/* Training Shortcut */}
        <TouchableOpacity onPress={() => navigation.navigate('Workout')}>
          <GlassCard theme={theme} style={styles.workoutShortcut}>
            <View style={styles.workoutInfo}>
              <Text style={[styles.workoutTitle, { color: theme.text }]}>
                {todaysWorkout ? todaysWorkout.splitType : 'Rest Day'}
              </Text>
              <Text style={[styles.workoutSub, { color: theme.textSecondary }]}>
                {todaysWorkout ? todaysWorkout.focus : 'Focus on recovery'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </GlassCard>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={60} tint={themeMode} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalContent, { backgroundColor: theme.surfaceLight, borderColor: theme.glassBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Update Weight</Text>
            <TextInput
              style={[styles.modalInput, { color: COLORS.primary }]}
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={theme.textMuted}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.glass }]} onPress={() => setShowModal(false)}>
                <Text style={{ color: theme.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleLog}>
                <Text style={{ color: '#000', fontWeight: '800' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg, marginTop: SPACING.sm },
  headerRight: { flexDirection: 'row', gap: SPACING.sm },
  dateText: { fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' },
  greeting: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  profileBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  themeBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  
  glassCardWrapper: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, marginBottom: SPACING.md },
  glassEffect: { borderRadius: RADIUS.lg },
  glassContent: { padding: SPACING.lg },
  
  heroCard: { padding: 0 },
  cardLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  weightRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: SPACING.sm },
  weightValue: { fontSize: 48, fontWeight: '900' },
  weightUnit: { fontSize: 20, marginBottom: 8, marginLeft: 6 },
  gainRow: { marginTop: SPACING.sm, marginBottom: SPACING.xl },
  gainBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  gainText: { color: COLORS.primary, fontSize: 12, fontWeight: '700', marginLeft: 4 },
  
  goalInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  goalLabel: { fontSize: 13 },
  goalPct: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

  actionRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl },
  actionBtn: { flex: 1, borderRadius: RADIUS.md, overflow: 'hidden', borderWidth: 1 },
  actionInner: { padding: SPACING.md, alignItems: 'center', gap: 8 },
  actionText: { fontSize: 13, fontWeight: '700' },

  miniGrid: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  miniCard: { flex: 1, padding: SPACING.md, marginBottom: 0, gap: 4 },
  miniValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  miniLabel: { fontSize: 12 },

  workoutShortcut: { padding: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  workoutInfo: { flex: 1 },
  workoutTitle: { fontSize: 16, fontWeight: '700' },
  workoutSub: { fontSize: 12, marginTop: 2 },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  modalContent: { width: '100%', borderRadius: RADIUS.xl, padding: SPACING.xl, borderWidth: 1, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: SPACING.xl },
  modalInput: { fontSize: 48, fontWeight: '900', textAlign: 'center', width: '100%', marginBottom: SPACING.xl },
  modalButtons: { flexDirection: 'row', gap: SPACING.md, width: '100%' },
  modalCancel: { flex: 1, padding: SPACING.md, alignItems: 'center', borderRadius: RADIUS.md },
  modalSave: { flex: 1, padding: SPACING.md, alignItems: 'center', borderRadius: RADIUS.md, backgroundColor: COLORS.primary },
});
