import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function VictoryCard({ stats, userProfile }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="dark" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.brand}>MPLANER</Text>
            <Text style={styles.reportType}>WEEKLY VICTORY REPORT</Text>
          </View>
        </View>

        <View style={styles.mainStat}>
          <Text style={styles.statLabel}>TOTAL WEIGHT CHANGE</Text>
          <Text style={styles.statValue}>+{stats.weightDelta.toFixed(1)} <Text style={styles.unit}>kg</Text></Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <MaterialCommunityIcons name="fire" size={20} color={COLORS.warning} />
            <Text style={styles.gridVal}>{stats.avgCalories}</Text>
            <Text style={styles.gridLabel}>AVG KCAL</Text>
          </View>
          <View style={styles.gridItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            <Text style={styles.gridVal}>{stats.calorieConsistency}%</Text>
            <Text style={styles.gridLabel}>CONSISTENCY</Text>
          </View>
          <View style={styles.gridItem}>
            <Ionicons name="water" size={20} color={COLORS.accent} />
            <Text style={styles.gridVal}>{stats.totalWater}L</Text>
            <Text style={styles.gridLabel}>HYDRATION</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Target: {userProfile.goalWeight}kg • Status: CRUSHING IT</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.4)',
    alignSelf: 'center',
    marginVertical: 20,
  },
  card: {
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
  },
  reportType: {
    color: '#A0A0A0',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '900',
  },
  unit: {
    fontSize: 24,
    color: COLORS.primary,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  gridItem: {
    alignItems: 'center',
    gap: 6,
  },
  gridVal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  gridLabel: {
    color: '#666',
    fontSize: 9,
    fontWeight: '900',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});
