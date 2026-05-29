import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme, Alert } from 'react-native';
import { format } from 'date-fns';
import { storage } from '../utils/storage';
import { requestNotificationPermissions } from '../utils/notifications';
import { USER_PROFILE, WEIGHT_HISTORY, MEAL_PLAN, WORKOUT_PLAN } from '../constants/sampleData';
import { THEMES } from '../constants/theme';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [themeMode, setThemeMode] = useState('dark');
  const [userProfile, setUserProfile] = useState(USER_PROFILE);
  const [weightHistory, setWeightHistory] = useState([]);
  const [mealLog, setMealLog] = useState({});
  const [workoutLog, setWorkoutLog] = useState({});
  const [exercisePRs, setExercisePRs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const theme = THEMES[themeMode];

  useEffect(() => {
    async function initialize() {
      try {
        // Safe check for notification permissions
        await requestNotificationPermissions().catch(e => console.log('Notif Permission failed quietly'));
        
        const initialized = await storage.get(storage.keys.INITIALIZED);

        if (!initialized) {
          await storage.set(storage.keys.USER_PROFILE, USER_PROFILE);
          await storage.set(storage.keys.WEIGHT_HISTORY, WEIGHT_HISTORY);
          await storage.set(storage.keys.INITIALIZED, true);
          setWeightHistory(WEIGHT_HISTORY);
        } else {
          const [profile, weights, meals, workouts, prs] = await Promise.all([
            storage.get(storage.keys.USER_PROFILE),
            storage.get(storage.keys.WEIGHT_HISTORY),
            storage.get(storage.keys.MEAL_LOG),
            storage.get(storage.keys.WORKOUT_LOG),
            storage.get('EXERCISE_PRS'),
          ]);
          if (profile) setUserProfile(profile);
          if (weights) setWeightHistory(weights || []);
          if (meals) setMealLog(meals || {});
          if (workouts) setWorkoutLog(workouts || {});
          if (prs) setExercisePRs(prs || {});
        }
      } catch (e) {
        console.error('CRITICAL BOOT ERROR:', e);
        // If everything fails, at least load the sample data so the app doesn't crash
        setWeightHistory(WEIGHT_HISTORY);
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  const todaysMeals = useMemo(() => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const dayOfWeek = new Date().getDay();
      const planDay = MEAL_PLAN.find(d => d.day === dayOfWeek) || MEAL_PLAN[0];
      return mealLog[todayKey] || planDay.meals.map(m => ({ ...m, isEaten: false }));
    } catch (e) { return MEAL_PLAN[0].meals; }
  }, [mealLog]);

  const caloriesEaten = useMemo(() => {
    return (todaysMeals || []).filter(m => m?.isEaten).reduce((sum, m) => sum + (m.calories || 0), 0);
  }, [todaysMeals]);

  const todaysWorkout = useMemo(() => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const dayOfWeek = new Date().getDay();
      const workoutDays = [1, 2, 3, 4, 5];
      const workoutIndex = workoutDays.indexOf(dayOfWeek);
      if (workoutIndex === -1) return null;
      if (workoutLog[todayKey]) return workoutLog[todayKey];
      const plan = WORKOUT_PLAN[workoutIndex];
      return { ...plan, exercises: (plan.exercises || []).map(e => ({ ...e, isDone: false, loggedWeight: 0 })) };
    } catch (e) { return null; }
  }, [workoutLog]);

  const exercisesDone = useMemo(() => {
    return (todaysWorkout?.exercises || []).filter(e => e.isDone).length;
  }, [todaysWorkout]);

  const bmi = useMemo(() => {
    try {
      const heightInMeters = (userProfile.height || 170) / 100;
      return (userProfile.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
    } catch (e) { return '0.0'; }
  }, [userProfile]);

  const logWeight = useCallback(async (weight) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const updated = [...weightHistory.filter(e => e.date !== today), { date: today, weight: parseFloat(weight) }];
      updated.sort((a, b) => a.date.localeCompare(b.date));
      setWeightHistory(updated);
      const newProfile = { ...userProfile, currentWeight: parseFloat(weight) };
      setUserProfile(newProfile);
      await storage.set(storage.keys.WEIGHT_HISTORY, updated);
      await storage.set(storage.keys.USER_PROFILE, newProfile);
    } catch (e) { console.error('Weight log failed', e); }
  }, [weightHistory, userProfile]);

  const logExerciseWeight = useCallback(async (exerciseId, weight) => {
    if (!todaysWorkout) return;
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const numericWeight = parseFloat(weight);
      const currentPR = exercisePRs[exerciseId]?.weight || 0;
      if (numericWeight > currentPR) {
        const newPRs = { ...exercisePRs, [exerciseId]: { weight: numericWeight, date: todayKey } };
        setExercisePRs(newPRs);
        await storage.set('EXERCISE_PRS', newPRs);
      }
      const updated = {
        ...todaysWorkout,
        exercises: todaysWorkout.exercises.map(e => 
          e.id === exerciseId ? { ...e, isDone: true, loggedWeight: numericWeight } : e
        ),
      };
      const newLog = { ...workoutLog, [todayKey]: updated };
      setWorkoutLog(newLog);
      await storage.set(storage.keys.WORKOUT_LOG, newLog);
    } catch (e) { console.error('Ex log failed', e); }
  }, [workoutLog, todaysWorkout, exercisePRs]);

  const toggleMealEaten = useCallback(async (mealId) => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const updated = todaysMeals.map(m => m.id === mealId ? { ...m, isEaten: !m.isEaten } : m);
      const newLog = { ...mealLog, [todayKey]: updated };
      setMealLog(newLog);
      await storage.set(storage.keys.MEAL_LOG, newLog);
    } catch (e) { console.error('Meal toggle failed', e); }
  }, [mealLog, todaysMeals]);

  const toggleExerciseDone = useCallback(async (exerciseId) => {
    if (!todaysWorkout) return;
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const updated = {
        ...todaysWorkout,
        exercises: todaysWorkout.exercises.map(e => e.id === exerciseId ? { ...e, isDone: !e.isDone } : e),
      };
      const newLog = { ...workoutLog, [todayKey]: updated };
      setWorkoutLog(newLog);
      await storage.set(storage.keys.WORKOUT_LOG, newLog);
    } catch (e) { console.error('Ex toggle failed', e); }
  }, [workoutLog, todaysWorkout]);

  const updateProfile = useCallback(async (updates) => {
    try {
      const newProfile = { ...userProfile, ...updates };
      setUserProfile(newProfile);
      await storage.set(storage.keys.USER_PROFILE, newProfile);
    } catch (e) { console.error('Profile update failed', e); }
  }, [userProfile]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const weightGained = (userProfile.currentWeight || 0) - (userProfile.startWeight || 0);
  const progressToGoal = Math.min((weightGained / ((userProfile.goalWeight || 1) - (userProfile.startWeight || 0))) * 100, 100);

  return (
    <AppContext.Provider value={{
      userProfile, weightHistory, mealLog, workoutLog, exercisePRs, isLoading, theme, themeMode, bmi,
      weightGained, progressToGoal, todaysMeals, caloriesEaten, todaysWorkout, exercisesDone,
      logWeight, toggleMealEaten, toggleExerciseDone, logExerciseWeight, toggleTheme, updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
