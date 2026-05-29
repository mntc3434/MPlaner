import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Vibration, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function WorkoutScreen() {
  const { todaysWorkout, toggleExerciseDone, logExerciseWeight, theme, exercisePRs } = useApp();
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const sessionRef = useRef(null);

  useEffect(() => {
    sessionRef.current = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    return () => clearInterval(sessionRef.current);
  }, []);

  if (!todaysWorkout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.restDay}>
          <MaterialCommunityIcons name="lightning-bolt" size={64} color="#00ffaa" />
          <Text style={[styles.restTitle, { color: theme.text }]}>RECOVERY MODE</Text>
          <Text style={[styles.restSub, { color: theme.textSecondary }]}>Your muscles are building right now. Stay hydrated and rest well.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = todaysWorkout.exercises.filter(e => e.isDone).length;
  const progress = (completedCount / todaysWorkout.exercises.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Elite Terminal Header */}
        <View style={[styles.terminalHeader, { backgroundColor: theme.glass, borderColor: theme.border }]}>
            <View style={styles.terminalTop}>
                <View>
                    <Text style={[styles.terminalDate, { color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }]}>{format(new Date(), 'EEEE • HH:mm')}</Text>
                    <Text style={[styles.terminalTitle, { color: '#fff', fontSize: 26 }]}>{(todaysWorkout.splitType || 'DAILY SPLIT').toUpperCase()}</Text>
                </View>
                <View style={[styles.statusIndicator, { backgroundColor: theme.mode === 'dark' ? '#00ffaa' : '#2ecc71' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#000' }]}>{Math.round(progress)}% DONE</Text>
                </View>
            </View>

            <View style={styles.compactGrid}>
                <View style={styles.gridCell}>
                    <Ionicons name="flash" size={12} color={theme.mode === 'dark' ? '#00ffaa' : '#2ecc71'} />
                    <Text style={[styles.cellVal, { color: '#fff' }]}>{todaysWorkout.intensity}</Text>
                </View>
                <View style={styles.gridCell}>
                    <Ionicons name="flame" size={12} color="#ff6400" />
                    <Text style={[styles.cellVal, { color: '#fff' }]}>~{todaysWorkout.exercises.length * 45} KC</Text>
                </View>
                <View style={styles.gridCell}>
                    <Ionicons name="time" size={12} color={theme.mode === 'dark' ? '#00ffaa' : '#2ecc71'} />
                    <Text style={[styles.cellVal, { color: '#fff' }]}>{todaysWorkout.duration || '60m'}</Text>
                </View>
            </View>

            <View style={[styles.microMetrics, { borderTopColor: theme.border }]}>
                <Text style={styles.microText}><Text style={{ color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }}>WATER:</Text> 500ML</Text>
                <Text style={styles.microText}><Text style={{ color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }}>REST:</Text> 60S</Text>
                <Text style={styles.microText}><Text style={{ color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }}>VOL:</Text> MAX</Text>
            </View>

            <View style={styles.focusBar}>
               <Text style={[styles.focusText, { color: theme.mode === 'dark' ? '#00ffaa' : '#2ecc71' }]}>
                  FOCUS: {todaysWorkout.focus.toUpperCase() || 'STRENGTH'}
               </Text>
            </View>
        </View>

        {/* Stacked Routine Cards */}
        <View style={styles.routineStack}>
            {todaysWorkout.exercises.map((exercise) => (
                <EliteStackCard 
                    key={exercise.id}
                    exercise={exercise}
                    theme={theme}
                    onToggle={() => {
                        toggleExerciseDone(exercise.id);
                        Vibration.vibrate(50);
                    }}
                    onLog={(w) => logExerciseWeight(exercise.id, w)}
                    pr={exercisePRs[exercise.id]}
                />
            ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function EliteStackCard({ exercise, theme, onToggle, onLog, pr }) {
    const [expanded, setExpanded] = useState(false);
    const [weight, setWeight] = useState(String(exercise.loggedWeight || ''));

    return (
        <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => setExpanded(!expanded)}
            style={[
                styles.eliteStackCard, 
                { backgroundColor: theme.glass, borderColor: exercise.isDone ? (theme.mode === 'dark' ? '#00ffaa' : '#2ecc71') : theme.border },
                exercise.isDone && styles.eliteStackCardDone
            ]}
        >
            <View style={styles.stackCardHeader}>
                <View style={styles.stackCardMain}>
                    <Text style={[styles.stackCardName, { color: theme.text }, exercise.isDone && styles.stackCardNameDone]}>{(exercise.name || 'EXERCISE').toUpperCase()}</Text>
                    <View style={styles.stackCardMeta}>
                        <Text style={[styles.stackCardSub, { color: theme.textSecondary }]}>{exercise.sets || 0} SETS • {exercise.reps || 0} REPS</Text>
                        <View style={[styles.stackToolBadge, { backgroundColor: theme.mode === 'dark' ? '#111' : '#f0f0f0' }]}>
                             <Text style={[styles.stackToolText, { color: theme.textMuted }]}>{(exercise.equipment || exercise.muscle || 'BODYWEIGHT').toUpperCase()}</Text>
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity style={[styles.checkNode, { backgroundColor: exercise.isDone ? (theme.mode === 'dark' ? '#00ffaa' : '#2ecc71') : 'rgba(255,255,255,0.05)' }]} onPress={onToggle}>
                    {exercise.isDone && <Ionicons name="checkmark" size={16} color="#000" />}
                </TouchableOpacity>
            </View>

            {expanded && (
                <View style={styles.stackExpand}>
                    <View style={[styles.stackDivider, { backgroundColor: theme.border }]} />
                    <Text style={[styles.stackLabel, { color: theme.textMuted }]}>EXECUTION PROTOCOL</Text>
                    <Text style={[styles.stackDesc, { color: theme.textSecondary }]}>{exercise.description}</Text>
                    
                    <View style={styles.stackLogRow}>
                        <View style={styles.stackLogBox}>
                            <Text style={[styles.stackLabel, { color: theme.textMuted }]}>SESSION LOAD (KG)</Text>
                            <TextInput 
                                style={[styles.stackInput, { color: theme.text }]}
                                placeholder="00"
                                placeholderTextColor={theme.textMuted}
                                keyboardType="decimal-pad"
                                value={weight}
                                onChangeText={setWeight}
                            />
                        </View>
                        <TouchableOpacity 
                            style={[styles.stackActionBtn, { backgroundColor: theme.mode === 'dark' ? '#00ffaa' : '#2ecc71' }]}
                            onPress={() => { onLog(weight); setExpanded(false); }}
                        >
                            <Text style={[styles.stackActionTxt, { color: theme.mode === 'dark' ? '#000' : '#fff' }]}>LOG SET</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  
  terminalHeader: { padding: 20, borderRadius: 25, borderWidth: 1.5, marginBottom: 25 },
  terminalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  terminalDate: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  terminalTitle: { fontWeight: '900', marginTop: 2, letterSpacing: -0.5 },
  statusIndicator: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusBadgeText: { fontSize: 9, fontWeight: '900' },

  compactGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  gridCell: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cellVal: { fontSize: 14, fontWeight: '900' },

  microMetrics: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, marginBottom: 10 },
  microText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  focusBar: { paddingVertical: 5 },
  focusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  routineStack: { gap: 15 },
  eliteStackCard: { padding: 20, borderRadius: 25, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  eliteStackCardDone: { borderLeftWidth: 5 },
  stackCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stackCardMain: { flex: 1 },
  stackCardName: { fontSize: 15, fontWeight: '900', letterSpacing: 0.5, marginBottom: 8 },
  stackCardNameDone: { opacity: 0.3, textDecorationLine: 'line-through' },
  stackCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stackCardSub: { fontSize: 11, fontWeight: '700' },
  
  stackToolBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  stackToolText: { fontSize: 8, fontWeight: '900' },
  
  checkNode: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  
  stackExpand: { marginTop: 20 },
  stackDivider: { height: 1, width: '100%', marginBottom: 15 },
  stackLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  stackDesc: { fontSize: 13, lineHeight: 20, marginBottom: 25 },

  stackLogRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 20 },
  stackLogBox: { flex: 1 },
  stackInput: { fontSize: 32, fontWeight: '900', padding: 0 },
  stackActionBtn: { paddingHorizontal: 25, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stackActionTxt: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },

  restDay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  restTitle: { fontSize: 26, fontWeight: '900', marginTop: 25, letterSpacing: 2 },
  restSub: { fontSize: 15, textAlign: 'center', marginTop: 15, lineHeight: 24, opacity: 0.6 },
});
