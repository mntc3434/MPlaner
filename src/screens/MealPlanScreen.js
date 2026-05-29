import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

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

export default function MealPlanScreen() {
  const { todaysMeals, userProfile, caloriesEaten, toggleMealEaten, deleteMeal, addCustomMeal, theme } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', time: '12:00' });

  const calPercent = Math.min((caloriesEaten / userProfile.calorieTarget) * 100, 100);

  const pieData = (todaysMeals || [])
    .filter(m => m.isEaten)
    .map((m, i) => ({
      name: m.name,
      population: m.calories,
      color: [COLORS.primary, COLORS.accent, COLORS.warning, '#3498db', '#9b59b6'][i % 5],
      legendFontColor: theme.textSecondary,
      legendFontSize: 10,
    }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Nutrition</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{userProfile.calorieTarget} kcal target</Text>
          </View>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <GlassCard theme={theme} style={styles.calCard}>
          <View style={styles.calRow}>
            <View>
              <Text style={[styles.calLabel, { color: theme.textSecondary }]}>CONSUMED</Text>
              <Text style={[styles.calValue, { color: COLORS.primary }]}>{caloriesEaten}</Text>
            </View>
            <View style={[styles.calDivider, { backgroundColor: theme.border }]} />
            <View>
              <Text style={[styles.calLabel, { color: theme.textSecondary }]}>REMAINING</Text>
              <Text style={[styles.calValue, { color: theme.textSecondary }]}>
                {Math.max(0, userProfile.calorieTarget - caloriesEaten)}
              </Text>
            </View>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${calPercent}%` }]} />
          </View>
        </GlassCard>

        {pieData.length > 0 && (
          <GlassCard theme={theme} style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Calorie Distribution</Text>
            <PieChart
              data={pieData}
              width={Dimensions.get('window').width - 64}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </GlassCard>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Meals</Text>
        {(todaysMeals || []).map((meal) => (
          <TouchableOpacity 
            key={meal.id} 
            activeOpacity={0.7} 
            onPress={() => toggleMealEaten(meal.id)}
            onLongPress={() => {
              Alert.alert(
                "Delete Meal",
                `Are you sure you want to remove "${meal.name}"?`,
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => deleteMeal(meal.id) }
                ]
              );
            }}
          >
            <GlassCard theme={theme} style={[styles.mealCard, meal.isEaten && styles.mealCardEaten]}>
              <View style={styles.mealMain}>
                <View style={styles.mealLeft}>
                  <Text style={[styles.mealTime, { color: theme.textSecondary }]}>{meal.time}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mealName, { color: theme.text }, meal.isEaten && styles.mealNameEaten]}>{meal.name}</Text>
                    <Text style={[styles.mealFoods, { color: theme.textMuted }]}>{meal.foods.join(', ')}</Text>
                  </View>
                </View>
                <View style={styles.mealRight}>
                  <Text style={[styles.mealCals, { color: theme.text }]}>{meal.calories}</Text>
                  <Text style={[styles.mealUnit, { color: theme.textMuted }]}>kcal</Text>
                </View>
              </View>
              {meal.isEaten && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={styles.checkIcon} />}
            </GlassCard>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <BlurView intensity={40} tint={theme.mode} style={StyleSheet.absoluteFill} />
            <View style={[styles.modalContent, { backgroundColor: theme.surfaceLight, borderColor: theme.glassBorder }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add Custom Meal</Text>
              <TextInput
                style={[styles.input, { color: theme.text, backgroundColor: theme.glass, borderColor: theme.glassBorder }]}
                placeholder="Name" placeholderTextColor={theme.textMuted}
                value={newMeal.name} onChangeText={v => setNewMeal(p => ({ ...p, name: v }))}
              />
              <TextInput
                style={[styles.input, { color: theme.text, backgroundColor: theme.glass, borderColor: theme.glassBorder }]}
                placeholder="Calories" placeholderTextColor={theme.textMuted} keyboardType="number-pad"
                value={newMeal.calories} onChangeText={v => setNewMeal(p => ({ ...p, calories: v }))}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalCancel, { backgroundColor: theme.glass }]} onPress={() => setShowAddModal(false)}>
                  <Text style={{ color: theme.textSecondary }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={() => { 
                  if (newMeal.name && newMeal.calories) {
                    addCustomMeal({
                      name: newMeal.name,
                      calories: parseInt(newMeal.calories),
                      time: newMeal.time,
                      foods: [newMeal.name], // For simplicity, food list = name
                    });
                    setNewMeal({ name: '', calories: '', time: '12:00' });
                    setShowAddModal(false); 
                  }
                }}>
                  <Text style={{ color: '#000', fontWeight: '800' }}>Add Meal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: SPACING.md, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 14, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  glassCardWrapper: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, marginBottom: SPACING.sm },
  glassEffect: { borderRadius: RADIUS.lg },
  glassContent: { padding: SPACING.md },
  calCard: { padding: 0 },
  calRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: SPACING.lg },
  calDivider: { width: 1, height: 40 },
  calLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center', letterSpacing: 1 },
  calValue: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginTop: 4 },
  progressTrack: { height: 4, width: '100%' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginTop: SPACING.lg, marginBottom: SPACING.md },
  mealCard: { padding: 0 },
  mealCardEaten: { borderColor: 'rgba(46, 204, 113, 0.3)' },
  mealMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  mealLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  mealTime: { fontSize: 12, fontWeight: '700', width: 45 },
  mealName: { fontSize: 15, fontWeight: '700' },
  mealNameEaten: { color: COLORS.primary, textDecorationLine: 'line-through', opacity: 0.7 },
  mealFoods: { fontSize: 12, marginTop: 2 },
  mealRight: { alignItems: 'flex-end', marginLeft: 10 },
  mealCals: { fontSize: 16, fontWeight: '800' },
  mealUnit: { fontSize: 10 },
  checkIcon: { position: 'absolute', right: 8, top: 4 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  modalContent: { width: '100%', borderRadius: RADIUS.xl, padding: SPACING.xl, borderWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: SPACING.xl, textAlign: 'center' },
  input: { borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 16, marginBottom: SPACING.md, borderWidth: 1 },
  modalButtons: { flexDirection: 'row', gap: SPACING.md },
  modalCancel: { flex: 1, padding: SPACING.md, alignItems: 'center', borderRadius: RADIUS.md },
  modalSave: { flex: 1, padding: SPACING.md, alignItems: 'center', borderRadius: RADIUS.md, backgroundColor: COLORS.primary },
  chartCard: { padding: SPACING.md, alignItems: 'center' },
  chartTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10, alignSelf: 'flex-start' },
});
