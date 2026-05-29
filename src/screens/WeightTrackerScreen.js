import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

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

export default function WeightTrackerScreen() {
  const { userProfile, weightHistory, weightGained, bmi, theme } = useApp();

  const labels = (weightHistory || []).slice(-7).map(e => format(parseISO(e.date), 'EEE'));
  const data = (weightHistory || []).slice(-7).map(e => e.weight);

  const chartData = {
    labels: labels.length > 0 ? labels : ['--'],
    datasets: [{ data: data.length > 0 ? data : [userProfile.currentWeight] }],
  };

  // Advanced Analytics
  const analytics = useMemo(() => {
    if (!weightHistory.length) return null;
    const weights = weightHistory.map(h => h.weight);
    return {
      min: Math.min(...weights).toFixed(1),
      max: Math.max(...weights).toFixed(1),
      avg: (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1),
      streak: 5, // Placeholder for actual weekly consistency check
    };
  }, [weightHistory]);

  const milestones = [
    { title: 'First Entry', unlocked: weightHistory.length > 0, icon: 'flag-outline' },
    { title: '3kg Gained', unlocked: weightGained >= 3, icon: 'trophy-outline' },
    { title: 'Healthy BMI', unlocked: bmi >= 18.5 && bmi <= 25, icon: 'heart-outline' },
    { title: 'Goal Halfway', unlocked: weightGained >= (userProfile.goalWeight - userProfile.startWeight) / 2, icon: 'medal-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Progress</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Analytics & Milestones</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: COLORS.primary + '15' }]}>
            <Text style={styles.statusText}>GAINING</Text>
          </View>
        </View>

        {/* BMI & Analysis Section */}
        <View style={styles.analysisRow}>
          <GlassCard theme={theme} style={styles.bmiCard}>
            <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>YOUR BMI</Text>
            <Text style={[styles.bmiValue, { color: theme.text }]}>{bmi}</Text>
            <View style={[styles.bmiTag, { backgroundColor: bmi < 18.5 ? COLORS.warning + '20' : COLORS.success + '20' }]}>
              <Text style={[styles.bmiTagText, { color: bmi < 18.5 ? COLORS.warning : COLORS.success }]}>
                {bmi < 18.5 ? 'UNDERWEIGHT' : (bmi < 25 ? 'NORMAL' : 'OVERWEIGHT')}
              </Text>
            </View>
          </GlassCard>

          <GlassCard theme={theme} style={styles.statsCard}>
            <View style={styles.statLine}>
              <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>LOW</Text>
              <Text style={[styles.miniVal, { color: theme.text }]}>{analytics?.min || '--'}kg</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statLine}>
              <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>HIGH</Text>
              <Text style={[styles.miniVal, { color: theme.text }]}>{analytics?.max || '--'}kg</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statLine}>
              <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>AVG</Text>
              <Text style={[styles.miniVal, { color: theme.text }]}>{analytics?.avg || '--'}kg</Text>
            </View>
          </GlassCard>
        </View>

        {/* Chart View */}
        <GlassCard theme={theme} style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Body Weight Trend</Text>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>7 DAYS</Text>
            </View>
          </View>
          <LineChart
            data={chartData}
            width={width - 52}
            height={200}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: theme.mode === 'light' ? '#fff' : theme.surface,
              backgroundGradientTo: theme.mode === 'light' ? '#fff' : theme.surface,
              decimalPlaces: 1,
              color: (opacity = 1) => theme.mode === 'dark' ? `rgba(46, 204, 113, ${opacity})` : `rgba(46, 204, 113, 0.8)`,
              labelColor: () => theme.textSecondary,
              propsForDots: { r: '5', strokeWidth: '0', fill: COLORS.primary },
              propsForBackgroundLines: { stroke: theme.border, strokeWidth: 1, strokeDasharray: '' },
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
          />
        </GlassCard>

        {/* Milestones / Achievements */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
        <View style={styles.milestoneGrid}>
          {milestones.map((ms, i) => (
            <GlassCard key={i} theme={theme} style={[styles.milestoneCard, !ms.unlocked && styles.lockedCard]}>
              <View style={[styles.iconCircle, { backgroundColor: ms.unlocked ? COLORS.primary + '20' : theme.border }]}>
                <Ionicons name={ms.unlocked ? ms.icon : 'lock-closed'} size={20} color={ms.unlocked ? COLORS.primary : theme.textMuted} />
              </View>
              <Text style={[styles.msTitle, { color: ms.unlocked ? theme.text : theme.textMuted }]}>{ms.title}</Text>
              <Text style={[styles.msStatus, { color: ms.unlocked ? COLORS.primary : theme.textMuted }]}>
                {ms.unlocked ? 'COMPLETED' : 'LOCKED'}
              </Text>
            </GlassCard>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 14, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },

  analysisRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  bmiCard: { flex: 1.2, padding: SPACING.md },
  cardLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  bmiValue: { fontSize: 32, fontWeight: '900' },
  bmiTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginTop: 8 },
  bmiTagText: { fontSize: 9, fontWeight: '900' },

  statsCard: { flex: 1, padding: SPACING.md, justifyContent: 'space-between' },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniLabel: { fontSize: 10, fontWeight: '700' },
  miniVal: { fontSize: 14, fontWeight: '800' },
  divider: { height: 1, width: '100%', marginVertical: 4 },

  chartContainer: { padding: 0, overflow: 'hidden' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, paddingBottom: 0 },
  chartTitle: { fontSize: 16, fontWeight: '800' },
  periodBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' },
  periodText: { fontSize: 9, fontWeight: '900', color: COLORS.accent },
  chart: { marginTop: 10, paddingRight: 0 },

  sectionTitle: { fontSize: 18, fontWeight: '800', marginTop: SPACING.lg, marginBottom: SPACING.md },
  milestoneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  milestoneCard: { width: (width - SPACING.md * 2 - SPACING.sm) / 2, padding: SPACING.md, alignItems: 'center', marginBottom: 0 },
  lockedCard: { opacity: 0.6 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  msTitle: { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  msStatus: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  glassCardWrapper: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, marginBottom: SPACING.sm },
  glassEffect: { borderRadius: RADIUS.lg },
  glassContent: { padding: SPACING.md },
});
