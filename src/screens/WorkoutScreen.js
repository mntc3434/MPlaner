import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Vibration, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');

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

export default function WorkoutScreen() {
  const { todaysWorkout, toggleExerciseDone, logExerciseWeight, exercisePRs, theme, workoutLog } = useApp();
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const timerRef = useRef(null);
  const sessionRef = useRef(null);

  // Time and Date
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    sessionRef.current = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    return () => {
      clearInterval(timeInterval);
      clearInterval(sessionRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerActive && seconds > 0) {
      timerRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      Vibration.vibrate([0, 500, 200, 500]);
      setTimerActive(false);
      clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, seconds]);

  const startTimer = (secs) => {
    setSeconds(secs);
    setTimerActive(true);
  };

  const formattedSessionTime = () => {
    const mins = Math.floor(sessionSeconds / 60);
    const secs = sessionSeconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // Weekly Strip Logic
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i));

  if (!todaysWorkout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
         <View style={styles.topBar}>
          <View>
            <Text style={[styles.topDate, { color: theme.textSecondary }]}>{format(currentTime, 'EEEE, MMM do')}</Text>
            <Text style={[styles.topTime, { color: theme.text }]}>{format(currentTime, 'pp')}</Text>
          </View>
        </View>
        
        {/* Render Week Strip even on Rest Days */}
        <View style={styles.weekStrip}>
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, new Date());
            const hasWorkout = [1,2,3,4,5].includes(day.getDay());
            return (
              <View key={i} style={[styles.dayBox, isToday && { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary }]}>
                <Text style={[styles.dayName, { color: isToday ? COLORS.primary : theme.textSecondary }]}>{format(day, 'EEE')}</Text>
                <Text style={[styles.dayNum, { color: isToday ? theme.text : theme.textMuted }]}>{format(day, 'd')}</Text>
                {hasWorkout && <View style={[styles.workoutDot, { backgroundColor: COLORS.primary }]} />}
              </View>
            );
          })}
        </View>

        <View style={styles.restDay}>
          <MaterialCommunityIcons name="moon-waning-crescent" size={64} color={theme.textSecondary} />
          <Text style={[styles.restTitle, { color: theme.text }]}>Rest & Grow Mode</Text>
          <Text style={[styles.restSub, { color: theme.textSecondary }]}>No workout scheduled for today. Enjoy your recovery!</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (todaysWorkout.exercises.filter(e => e.isDone).length / todaysWorkout.exercises.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.topDate, { color: theme.textSecondary }]}>{format(currentTime, 'EEEE, MMM do')}</Text>
          </View>
        </View>

        {/* New Weekly Strip */}
        <View style={styles.weekStrip}>
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, new Date());
            const hasWorkout = [1,2,3,4,5].includes(day.getDay()); 
            return (
              <View key={i} style={[styles.dayBox, isToday && { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary }]}>
                <Text style={[styles.dayName, { color: isToday ? COLORS.primary : theme.textSecondary }]}>{format(day, 'EEE')}</Text>
                <Text style={[styles.dayNum, { color: isToday ? theme.text : theme.textMuted }]}>{format(day, 'd')}</Text>
                {hasWorkout && <View style={[styles.workoutDot, { backgroundColor: COLORS.primary }]} />}
              </View>
            );
          })}
        </View>

        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>{todaysWorkout.splitType}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{todaysWorkout.focus}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.timerBtn, timerActive && styles.timerBtnActive, { borderColor: theme.glassBorder }]} 
            onPress={() => setTimerActive(!timerActive)}
          >
            <Ionicons name="timer-outline" size={20} color={timerActive ? '#000' : COLORS.primary} />
            <Text style={[styles.timerText, { color: timerActive ? '#000' : theme.text }]}>
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>{Math.round(progress)}% Session Done</Text>
        </View>

        {timerActive && (
          <GlassCard theme={theme} style={styles.timerControls}>
            <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>REST DURATION</Text>
            <View style={styles.timerQuickRow}>
              {[45, 60, 90].map(s => (
                <TouchableOpacity key={s} style={styles.quickTime} onPress={() => startTimer(s)}>
                  <Text style={styles.quickTimeText}>{s}s</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.timerStop} onPress={() => { setTimerActive(false); setSeconds(60); }}>
                <Ionicons name="stop" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Routine</Text>
        {todaysWorkout.exercises.map((exercise) => (
          <AdvancedExerciseItem 
            key={exercise.id} 
            exercise={exercise} 
            theme={theme} 
            onToggle={() => {
              toggleExerciseDone(exercise.id);
              if (!exercise.isDone) startTimer(60); 
            }}
            onLogWeight={(w) => logExerciseWeight(exercise.id, w)}
            pr={exercisePRs[exercise.id]}
          />
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AdvancedExerciseItem({ exercise, theme, onToggle, onLogWeight, pr }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weightInput, setWeightInput] = useState(String(exercise.loggedWeight || ''));

  return (
    <GlassCard theme={theme} style={[styles.exCard, exercise.isDone && styles.exCardDone]}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.exHeader}
      >
        <View style={styles.exLeft}>
          <View style={styles.iconBox}>
             <MaterialCommunityIcons 
                name={exercise.name.toLowerCase().includes('press') ? 'weight-lifter' : 'arm-flex-outline'} 
                size={22} 
                color={exercise.isDone ? COLORS.primary : theme.textSecondary} 
             />
          </View>
          <View>
            <Text style={[styles.exName, { color: theme.text }, exercise.isDone && styles.exNameDone]}>{exercise.name}</Text>
            <Text style={[styles.exMeta, { color: theme.textMuted }]}>{exercise.sets} Sets • {exercise.reps} Reps</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.checkBtn} onPress={onToggle}>
          <Ionicons 
            name={exercise.isDone ? "checkmark-done-circle" : "add-circle-outline"} 
            size={32} 
            color={exercise.isDone ? COLORS.primary : theme.textMuted} 
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.exDetails, { borderTopColor: theme.border }]}>
          <View style={styles.instructionScroll}>
            <Text style={[styles.detailTitle, { color: COLORS.primary }]}>MOVEMENT GUIDE</Text>
            <Text style={[styles.exDesc, { color: theme.text }]}>{exercise.description}</Text>
            <View style={[styles.stepBox, { backgroundColor: theme.glass }]}>
              <Text style={[styles.stepText, { color: theme.text }]}>
                <Text style={{ fontWeight: '800', color: COLORS.primary }}>COACH TIP:</Text> {exercise.tip}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.chipLabel}>PERSONAL BEST</Text>
              <Text style={[styles.chipVal, { color: theme.text }]}>{pr ? `${pr.weight}kg` : '--'}</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.chipLabel}>LOG WEIGHT</Text>
              <TextInput
                style={[styles.chipInput, { color: COLORS.primary }]}
                placeholder="0.0"
                placeholderTextColor={theme.textMuted}
                keyboardType="decimal-pad"
                value={weightInput}
                onChangeText={setWeightInput}
                onBlur={() => weightInput && onLogWeight(weightInput)}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={() => onLogWeight(weightInput)}>
            <Text style={styles.saveBtnText}>Save Log</Text>
          </TouchableOpacity>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: SPACING.md },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  topDate: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  topTime: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  sessionBox: { alignItems: 'flex-end' },
  sessionLabel: { fontSize: 8, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1 },
  sessionVal: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },

  weekStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg, paddingVertical: SPACING.sm },
  dayBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  dayName: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  dayNum: { fontSize: 16, fontWeight: '900', marginTop: 2 },
  workoutDot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 13, marginTop: 2 },
  progressContainer: { marginBottom: SPACING.lg },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  progressText: { fontSize: 10, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  timerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  timerBtnActive: { backgroundColor: COLORS.primary },
  timerText: { fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timerControls: { padding: SPACING.sm, marginBottom: SPACING.md, backgroundColor: 'rgba(46, 204, 113, 0.05)' },
  timerLabel: { fontSize: 9, fontWeight: '800', textAlign: 'center', letterSpacing: 1, marginBottom: 8 },
  timerQuickRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  quickTime: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  quickTimeText: { color: COLORS.primary, fontWeight: '800', fontSize: 11 },
  timerStop: { backgroundColor: COLORS.error, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: SPACING.md },
  glassCardWrapper: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, marginBottom: SPACING.sm },
  glassEffect: { borderRadius: RADIUS.lg },
  glassContent: { padding: 0 },
  exCard: { marginBottom: SPACING.sm },
  exCardDone: { borderColor: 'rgba(46, 204, 113, 0.3)' },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  exLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  exName: { fontSize: 15, fontWeight: '700' },
  exNameDone: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  exMeta: { fontSize: 12, marginTop: 2 },
  checkBtn: { padding: 4 },
  exDetails: { padding: SPACING.md, borderTopWidth: 1 },
  detailTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  exDesc: { fontSize: 14, lineHeight: 20, marginBottom: SPACING.md },
  stepBox: { padding: 12, borderRadius: RADIUS.md, marginBottom: SPACING.lg },
  stepText: { fontSize: 13, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  statChip: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: RADIUS.md, alignItems: 'center' },
  chipLabel: { fontSize: 8, fontWeight: '800', color: COLORS.textMuted, marginBottom: 4 },
  chipVal: { fontSize: 16, fontWeight: '800' },
  chipInput: { fontSize: 20, fontWeight: '900', textAlign: 'center', width: '100%' },
  saveBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  saveBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 12 },
  restDay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  restTitle: { fontSize: 24, fontWeight: '900', marginTop: SPACING.lg },
  restSub: { fontSize: 15, textAlign: 'center', marginTop: 10, lineHeight: 22 },
});
