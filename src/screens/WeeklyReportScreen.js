import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Share, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { format, subDays } from 'date-fns';
import VictoryCard from '../components/VictoryCard';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { BarChart, LineChart } from 'react-native-chart-kit';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';

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

export default function WeeklyReportScreen({ navigation }) {
  const { theme, weightHistory, mealLog, waterLog, userProfile } = useApp();
  const viewShotRef = React.useRef();

  const weeklyStats = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
    
    let totalCalories = 0;
    let daysTracked = 0;
    let totalWater = 0;
    
    const calorieData = last7Days.map(day => {
      const key = format(day, 'yyyy-MM-dd');
      let dailyCals = 0;
      if (mealLog[key]) {
        dailyCals = mealLog[key].filter(m => m.isEaten).reduce((sum, m) => sum + m.calories, 0);
        if (dailyCals > 0) {
          totalCalories += dailyCals;
          daysTracked++;
        }
      }
      return dailyCals;
    });

    const waterData = last7Days.map(day => {
      const key = format(day, 'yyyy-MM-dd');
      const amount = waterLog[key] || 0;
      totalWater += amount;
      return amount / 1000; // In Liters
    });

    const chartLabels = last7Days.map(day => format(day, 'EEE'));

    const recentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : userProfile.startWeight;
    const weekAgoWeight = weightHistory.find(h => format(new Date(h.date), 'yyyy-MM-dd') === format(subDays(today, 7), 'yyyy-MM-dd'))?.weight || userProfile.startWeight;
    const weightDelta = recentWeight - weekAgoWeight;

    const calorieGoal = userProfile.calorieTarget || 2500;
    const waterGoalLimit = 3000; // Daily target 3L
    const todayKey = format(today, 'yyyy-MM-dd');
    
    const todayCals = mealLog[todayKey]?.filter(m => m.isEaten).reduce((sum, m) => sum + m.calories, 0) || 0;
    const todayWaterRaw = waterLog[todayKey] || 0;

    return {
      todayCalories: todayCals,
      todayWaterLtrs: (todayWaterRaw / 1000).toFixed(1),
      dailyCalorieProgress: Math.min(100, (todayCals / calorieGoal) * 100),
      dailyWaterProgress: Math.min(100, (todayWaterRaw / waterGoalLimit) * 100),
      daysTracked,
      weightDelta,
      calorieConsistency: Math.round((daysTracked / 7) * 100),
      calorieChart: {
        labels: chartLabels,
        datasets: [{ data: calorieData.map(v => v === 0 ? 0.1 : v) }]
      },
      waterChart: {
        labels: chartLabels,
        datasets: [{ data: waterData.map(v => v === 0 ? 0.01 : v) }]
      },
      avgCalories: daysTracked > 0 ? Math.round(totalCalories / daysTracked) : 0,
      totalWater: (totalWater / 1000).toFixed(1),
    };
  }, [mealLog, waterLog, weightHistory, userProfile]);

  const onShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1.0,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share your Weekly Victory!',
          mimeType: 'image/png',
        });
      } else {
        await Share.share({
          message: `MPlaner Weekly Progress: I've gained ${weeklyStats.weightDelta.toFixed(1)}kg this week! #MPlaner #Fitness`,
        });
      }
    } catch (error) {
      console.log(error.message);
      Alert.alert('Sharing Error', 'Could not generate the progress card image.');
    }
  };

  const exportToExcel = async () => {
    try {
      const today = new Date();
      const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
      
      const data = last7Days.map(day => {
        const key = format(day, 'yyyy-MM-dd');
        return {
          Date: key,
          Calories: mealLog[key]?.filter(m => m.isEaten).reduce((sum, m) => sum + m.calories, 0) || 0,
          Water_ml: waterLog[key] || 0,
          Weight_kg: weightHistory.find(h => h.date === key)?.weight || userProfile.currentWeight,
        };
      });

      // Create Worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "WeeklySummary");

      // Generate Base64
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const uri = FileSystem.cacheDirectory + `MPlaner_Weekly_${format(new Date(), 'MMM_dd')}.xlsx`;
      
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      // Send via Native Share Sheet
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Share Weekly Performance Excel',
        });
      } else {
        Alert.alert('Sharing Unavailable', 'This device does not support file sharing.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Export Error', 'Could not generate or share Excel file.');
    }
  };

  const chartConfig = {
    backgroundColor: theme.background,
    backgroundGradientFrom: theme.mode === 'dark' ? '#0a0a0a' : '#f0f0f0',
    backgroundGradientTo: theme.mode === 'dark' ? '#1a1a1a' : '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => theme.mode === 'dark' ? `rgba(0, 255, 170, ${opacity})` : `rgba(46, 204, 113, ${opacity})`,
    labelColor: (opacity = 1) => theme.text + (Math.round(opacity * 255)).toString(16),
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "2", stroke: theme.mode === 'dark' ? '#00ffaa' : '#2ecc71' },
    propsForLabels: { fontSize: 9, fontWeight: 'bold' }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: theme.glass, borderColor: theme.border }]}>
          <Ionicons name="chevron-back" size={24} color={theme.mode === 'dark' ? '#00ffaa' : '#27ae60'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>ELITE PERFORMANCE</Text>
        <TouchableOpacity onPress={exportToExcel} style={[styles.iconBtn, { backgroundColor: theme.glass, borderColor: theme.border }]}>
          <Ionicons name="share-social" size={22} color={theme.mode === 'dark' ? '#00ffaa' : '#27ae60'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroSection}>
          <GlassCard theme={theme} style={[styles.mainInsightCard, { backgroundColor: theme.glass, borderLeftColor: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardLabel, { color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60', fontSize: 13 }]}>BIOMETRIC FLUX ANALYSIS</Text>
              <View style={[styles.statusDot, { backgroundColor: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }]} />
            </View>
            
            <View style={styles.fluxContainer}>
              <View style={styles.fluxMain}>
                <Ionicons 
                  name={weeklyStats.weightDelta >= 0 ? "trending-up" : "trending-down"} 
                  size={32} 
                  color={theme.mode === 'dark' ? '#00ffaa' : '#2ecc71'} 
                  style={styles.trendArrow}
                />
                <Text style={[styles.deltaValue, { color: theme.text }]}>
                  {weeklyStats.weightDelta >= 0 ? '+' : ''}{weeklyStats.weightDelta.toFixed(1)}
                </Text>
                <Text style={[styles.unit, { color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }]}>KG</Text>
              </View>
              <View style={[styles.glitchLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.targetStatus, { color: theme.textMuted }]}>TARGET ARCHITECTURE: {userProfile.goalWeight} KG</Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.statsGrid}>
           <View style={[styles.statHex, { backgroundColor: theme.glass, borderColor: theme.border }]}>
              <View style={styles.statHexInner}>
                <Text style={[styles.statSmallLabel, { color: theme.textMuted }]}>METABOLIC VELOCITY (TODAY)</Text>
                <View style={styles.statValRow}>
                  <Text style={[styles.statVal, { color: theme.text }]}>{weeklyStats.todayCalories}</Text>
                  <Text style={[styles.statUnit, { color: theme.mode === 'dark' ? '#00ffaa' : '#2ecc71' }]}>KCAL</Text>
                </View>
                <View style={[styles.miniProgressBackground, { backgroundColor: theme.border }]}>
                  <View style={[styles.miniProgressFill, { width: `${weeklyStats.dailyCalorieProgress}%`, backgroundColor: theme.mode === 'dark' ? '#00ffaa' : '#2ecc71' }]} />
                </View>
              </View>
           </View>
 
           <View style={[styles.statHex, { backgroundColor: theme.glass, borderColor: theme.border }]}>
              <View style={styles.statHexInner}>
                <Text style={[styles.statSmallLabel, { color: theme.textMuted }]}>HYDRATION VOLUME (TODAY)</Text>
                <View style={styles.statValRow}>
                  <Text style={[styles.statVal, { color: theme.text }]}>{weeklyStats.todayWaterLtrs}</Text>
                  <Text style={[styles.statUnit, { color: '#00c8ff' }]}>LTR</Text>
                </View>
                <View style={[styles.miniProgressBackground, { backgroundColor: theme.border }]}>
                  <View style={[styles.miniProgressFill, { width: `${weeklyStats.dailyWaterProgress}%`, backgroundColor: '#00c8ff' }]} />
                </View>
              </View>
           </View>
        </View>

        <Text style={[styles.sectionHeader, { color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60', fontSize: 14 }]}>PERFORMANCE LOG (KCAL)</Text>
        <GlassCard theme={theme} style={[styles.neonCard, { backgroundColor: theme.glass }]}>
          <BarChart
            data={weeklyStats.calorieChart}
            width={width - 50}
            height={180}
            fromZero
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => theme.mode === 'dark' ? `rgba(0, 255, 170, ${opacity})` : `rgba(46, 204, 113, ${opacity})`,
              barPercentage: 0.5,
            }}
            style={styles.chartStyle}
            showValuesOnTopOfBars
          />
        </GlassCard>

        <Text style={[styles.sectionHeader, { color: '#00c8ff', fontSize: 14 }]}>HYDRATION MATRIX (L)</Text>
        <GlassCard theme={theme} style={[styles.neonCard, { backgroundColor: theme.glass }]}>
          <LineChart
            data={weeklyStats.waterChart}
            width={width - 50}
            height={180}
            chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(0, 200, 255, ${opacity})`, 
                propsForDots: { r: "5", strokeWidth: "0", fill: '#00c8ff' }
            }}
            bezier
            style={styles.chartStyle}
          />
        </GlassCard>

        <Text style={[styles.sectionHeader, { color: theme.mode === 'dark' ? '#00ffaa' : '#27ae60', fontSize: 14 }]}>STRATEGIC ANALYSIS</Text>
        <GlassCard theme={theme} style={[styles.analysisCard, { backgroundColor: theme.glass, borderLeftColor: theme.mode === 'dark' ? '#00ffaa' : '#27ae60' }]}>
           <Ionicons name="analytics" size={18} color={theme.mode === 'dark' ? '#00ffaa' : '#27ae60'} style={{ marginBottom: 10 }} />
           <Text style={[styles.analysisText, { color: theme.text }]}>
             {weeklyStats.avgCalories < userProfile.calorieTarget 
               ? "METABOLIC DEFICIT DETECTED. BOOST CALORIC DENSITY BY 15% TO MAINTAIN HYPERTROPHY MOMENTUM."
               : "SYSTEM OPTIMIZED. CALORIC INTAKE CORRELATES WITH MUSCLE ACCRETION TARGETS."}
           </Text>
        </GlassCard>

        <Text style={[styles.sectionHeader, { color: '#ffcc00', fontSize: 14 }]}>ELITE MILESTONES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.milestoneScroll}>
            <View style={[styles.milestoneCard, { backgroundColor: theme.glass }]}>
                <MaterialCommunityIcons name="trophy-outline" size={32} color="#ffcc00" />
                <Text style={[styles.milestoneTitle, { color: theme.text }]}>HYDRATION KING</Text>
                <Text style={[styles.milestoneSub, { color: theme.textMuted }]}>7 Days Target Hit</Text>
            </View>
            <View style={[styles.milestoneCard, { backgroundColor: theme.glass }]}>
                <MaterialCommunityIcons name="weight-lifter" size={32} color="#00ffaa" />
                <Text style={[styles.milestoneTitle, { color: theme.text }]}>POWER SURGE</Text>
                <Text style={[styles.milestoneSub, { color: theme.textMuted }]}>New Bench PR</Text>
            </View>
            <View style={[styles.milestoneCard, { backgroundColor: theme.glass }]}>
                <MaterialCommunityIcons name="calendar-check" size={32} color="#ff6400" />
                <Text style={[styles.milestoneTitle, { color: theme.text }]}>IRON WILL</Text>
                <Text style={[styles.milestoneSub, { color: theme.textMuted }]}>5/5 Gym Sessions</Text>
            </View>
        </ScrollView>

        <View style={styles.shareSection}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
              <View style={{ backgroundColor: theme.background, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: theme.border }}>
                <VictoryCard stats={weeklyStats} userProfile={userProfile} />
              </View>
            </ViewShot>
            
            <TouchableOpacity style={[styles.neonBtn, { backgroundColor: theme.mode === 'dark' ? '#00ffaa' : '#2ecc71' }]} onPress={onShare}>
                <Text style={[styles.neonBtnText, { color: theme.mode === 'dark' ? '#000' : '#fff' }]}>EXPORT DATA CARD</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#111' },
  title: { fontSize: 13, fontWeight: '900', letterSpacing: 4 },
  iconBtn: { padding: 8, backgroundColor: '#0a0a0a', borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  scroll: { padding: SPACING.md, paddingBottom: 120 },
  
  heroSection: { marginBottom: SPACING.md },
  mainInsightCard: { padding: 25, backgroundColor: 'rgba(0, 255, 170, 0.02)', borderLeftWidth: 3, borderLeftColor: '#00ffaa' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardLabel: { fontSize: 10, fontWeight: '900', color: '#555', letterSpacing: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, shadowColor: '#00ffaa', shadowRadius: 4, shadowOpacity: 0.8 },
  
  fluxContainer: { width: '100%' },
  fluxMain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  trendArrow: { marginRight: 15 },
  deltaValue: { fontSize: 84, fontWeight: '900', color: '#fff', letterSpacing: -2 },
  unit: { fontSize: 20, fontWeight: '900', color: '#00ffaa', marginLeft: 10, marginBottom: 15 },
  glitchLine: { width: '100%', height: 1, backgroundColor: '#1a1a1a', marginVertical: 15 },
  targetStatus: { fontSize: 9, fontWeight: '800', color: '#444', textAlign: 'center', letterSpacing: 1 },

  statsGrid: { flexDirection: 'row', gap: 12, marginVertical: SPACING.md },
  statHex: { flex: 1, backgroundColor: '#080808', borderRadius: 20, borderWidth: 1, borderColor: '#1a1a1a', padding: 15 },
  statHexInner: { width: '100%' },
  statSmallLabel: { fontSize: 8, fontWeight: '900', color: '#333', marginBottom: 10, letterSpacing: 1 },
  statValRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  statVal: { fontSize: 26, fontWeight: '900', color: '#fff' },
  statUnit: { fontSize: 10, fontWeight: '800', color: '#00ffaa', marginLeft: 4 },
  miniProgressBackground: { width: '100%', height: 2, backgroundColor: '#111', borderRadius: 1, overflow: 'hidden' },
  miniProgressFill: { height: '100%', borderRadius: 1 },

  sectionHeader: { fontSize: 10, fontWeight: '900', color: '#222', marginTop: SPACING.xl, marginBottom: SPACING.md, letterSpacing: 2 },
  neonCard: { paddingVertical: 15, backgroundColor: '#050505' },
  chartStyle: { marginVertical: 8, borderRadius: 16, paddingRight: 40 },

  analysisCard: { padding: 20, backgroundColor: '#070707', borderLeftWidth: 2, borderLeftColor: '#00ffaa' },
  analysisText: { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 0.5, lineHeight: 18 },

  shareSection: { marginTop: SPACING.xl, width: '100%', alignItems: 'center' },
  neonBtn: { width: '100%', marginTop: 20, backgroundColor: '#00ffaa', paddingVertical: 18, borderRadius: 30, shadowColor: '#00ffaa', shadowOpacity: 0.5, shadowRadius: 15, elevation: 10, alignItems: 'center' },
  neonBtnText: { color: '#000', fontWeight: '900', letterSpacing: 2, fontSize: 12 },

  milestoneScroll: { gap: 12, paddingBottom: 10 },
  milestoneCard: { width: 140, padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  milestoneTitle: { fontSize: 10, fontWeight: '900', marginTop: 12, textAlign: 'center' },
  milestoneSub: { fontSize: 8, fontWeight: '700', marginTop: 4, textAlign: 'center' },

  glassCardWrapper: { borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 1, marginBottom: SPACING.sm, borderColor: '#1a1a1a' },
  glassEffect: { borderRadius: RADIUS.xl },
  glassContent: { padding: 0 },
});
