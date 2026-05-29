import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { BarChart } from 'react-native-chart-kit';
import { format, subDays } from 'date-fns';

const { width } = Dimensions.get('window');
const BOTTLE_HEIGHT = 280;

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

export default function WaterTrackerScreen({ navigation }) {
  const { theme, todaysWater, addWater, resetWater, waterLog } = useApp();
  const safeWaterLog = waterLog || {};
  const [waveAnim] = useState(new Animated.Value(0));

  const GOAL = 3000;
  const progress = Math.min(todaysWater / GOAL, 1);
  const remaining = Math.max(0, GOAL - todaysWater);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Weekly chart data
  const { barData, weeklyTotal, bestDay } = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i)).reverse();
    const values = last7Days.map(d => (safeWaterLog[format(d, 'yyyy-MM-dd')] || 0) / 1000);
    const hasData = values.some(v => v > 0);
    const total = values.reduce((a, b) => a + b, 0);
    const maxIdx = values.indexOf(Math.max(...values));

    return {
      barData: {
        labels: last7Days.map(d => format(d, 'EEE')),
        datasets: [{ data: hasData ? values : values.map(() => 0.01) }],
      },
      weeklyTotal: total.toFixed(1),
      bestDay: last7Days[maxIdx] ? format(last7Days[maxIdx], 'EEEE') : '--',
    };
  }, [safeWaterLog]);

  // Quick-add amounts
  const quickAmounts = [
    { amount: 150, label: '150ml', icon: 'coffee-outline' },
    { amount: 250, label: '250ml', icon: 'cup-water' },
    { amount: 500, label: '500ml', icon: 'water' },
    { amount: 750, label: '750ml', icon: 'bottle-soda-classic-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Hydration</Text>
        <TouchableOpacity onPress={resetWater}>
          <Ionicons name="refresh-outline" size={24} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Water Bottle Visual */}
        <View style={styles.bottleSection}>
          <View style={[styles.waterContainer, { backgroundColor: theme.surface }]}>
            <View
              style={[
                styles.waveContainer,
                { height: `${Math.max(progress * 100, 2)}%` }
              ]}
            >
              <Svg style={styles.wave} width={width * 2} height={40} viewBox={`0 0 ${width * 2} 40`}>
                <Path
                  d={`M0 20 C${width/2} 0, ${width/2} 40, ${width} 20 C${width*1.5} 0, ${width*1.5} 40, ${width*2} 20 V40 H0 Z`}
                  fill={COLORS.primary}
                />
              </Svg>
              <View style={[styles.fill, { backgroundColor: COLORS.primary }]} />
            </View>

            <View style={styles.overlay}>
              <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
              <Text style={styles.amount}>{todaysWater} / {GOAL} ml</Text>
            </View>
          </View>
        </View>

        {/* Status Row */}
        <View style={styles.statusRow}>
          <GlassCard theme={theme} style={styles.statusCard}>
            <MaterialCommunityIcons name="water-check" size={20} color={COLORS.primary} />
            <Text style={[styles.statusVal, { color: theme.text }]}>{todaysWater}ml</Text>
            <Text style={[styles.statusLabel, { color: theme.textMuted }]}>Consumed</Text>
          </GlassCard>
          <GlassCard theme={theme} style={styles.statusCard}>
            <MaterialCommunityIcons name="water-alert" size={20} color={COLORS.warning} />
            <Text style={[styles.statusVal, { color: theme.text }]}>{remaining}ml</Text>
            <Text style={[styles.statusLabel, { color: theme.textMuted }]}>Remaining</Text>
          </GlassCard>
          <GlassCard theme={theme} style={styles.statusCard}>
            <MaterialCommunityIcons name="target" size={20} color={COLORS.accent} />
            <Text style={[styles.statusVal, { color: theme.text }]}>{GOAL / 1000}L</Text>
            <Text style={[styles.statusLabel, { color: theme.textMuted }]}>Goal</Text>
          </GlassCard>
        </View>

        {/* Quick Add Buttons */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Add</Text>
        <View style={styles.quickGrid}>
          {quickAmounts.map((item) => (
            <TouchableOpacity
              key={item.amount}
              style={[styles.quickBtn, { borderColor: theme.glassBorder }]}
              onPress={() => addWater(item.amount)}
              activeOpacity={0.7}
            >
              <BlurView intensity={20} tint={theme.mode} style={styles.quickBtnInner}>
                <MaterialCommunityIcons name={item.icon} size={28} color={COLORS.primary} />
                <Text style={[styles.quickBtnText, { color: theme.text }]}>+{item.label}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Trend */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Trend</Text>
        <GlassCard theme={theme} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>WEEKLY TOTAL</Text>
              <Text style={[styles.chartBigVal, { color: theme.text }]}>{weeklyTotal}L</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>BEST DAY</Text>
              <Text style={[styles.chartSmallVal, { color: COLORS.primary }]}>{bestDay}</Text>
            </View>
          </View>
          <BarChart
            data={barData}
            width={width - 72}
            height={180}
            yAxisLabel=""
            yAxisSuffix="L"
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
              labelColor: () => theme.textSecondary,
              barPercentage: 0.5,
              propsForBackgroundLines: { stroke: theme.border, strokeDasharray: '' },
            }}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </GlassCard>

        {/* Tip Card */}
        <GlassCard theme={theme} style={styles.tipCard}>
          <View style={styles.tipRow}>
            <View style={[styles.tipIcon, { backgroundColor: COLORS.warning + '15' }]}>
              <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: theme.text }]}>Hydration Tip</Text>
              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                Drinking water before meals can increase satiety and help with calorie control. Aim for at least 8 glasses a day.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Bottom Spacer for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  title: { fontSize: 20, fontWeight: '900' },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 20,
  },

  // Bottle Section
  bottleSection: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  waterContainer: {
    width: width * 0.55,
    height: BOTTLE_HEIGHT,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  wave: {
    position: 'absolute',
    top: -39,
  },
  fill: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  amount: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    marginTop: 6,
    opacity: 0.9,
  },

  // Status Cards
  statusRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
    gap: 4,
    marginBottom: 0,
  },
  statusVal: { fontSize: 16, fontWeight: '800' },
  statusLabel: { fontSize: 10, fontWeight: '700' },

  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },

  // Quick Add
  quickGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  quickBtn: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  quickBtnInner: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    gap: 6,
  },
  quickBtnText: {
    fontWeight: '800',
    fontSize: 12,
  },

  // Chart
  chartCard: {
    padding: 0,
    marginBottom: SPACING.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    marginBottom: 8,
  },
  chartLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  chartBigVal: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  chartSmallVal: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  chart: {
    marginLeft: -8,
    borderRadius: 12,
  },

  // Tip
  tipCard: {
    padding: 0,
    marginBottom: 0,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  tipText: { fontSize: 13, lineHeight: 18 },

  // GlassCard shared
  glassCardWrapper: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  glassEffect: { borderRadius: RADIUS.lg },
  glassContent: { padding: SPACING.md },
});
