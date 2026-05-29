import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function AchievementModal({ visible, achievement, onClose }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible && opacity._value === 0) return null;

  return (
    <View style={styles.overlay} pointerEvents={visible ? 'auto' : 'none'}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="trophy" size={80} color={COLORS.primary} />
          <View style={styles.sparkles}>
             <Ionicons name="sparkles" size={32} color={COLORS.accent} style={{position: 'absolute', top: -10, right: -10}} />
          </View>
        </View>
        
        <Text style={styles.title}>ACHIEVEMENT UNLOCKED</Text>
        <Text style={styles.achievementName}>{achievement?.title || 'New Milestone!'}</Text>
        <Text style={styles.description}>{achievement?.description || 'You are crushing your fitness goals.'}</Text>
        
        <View style={styles.statsBox}>
           <Text style={styles.statsText}>NEW PERSONAL RECORD</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={onClose}>
          <Text style={styles.btnText}>CONTINUE GRINDING</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    width: width * 0.85,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  iconContainer: {
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  title: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  achievementName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  statsBox: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: SPACING.xl,
  },
  statsText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: RADIUS.lg,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 1,
  },
});
