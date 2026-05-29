import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme, Alert } from 'react-native';
import { format } from 'date-fns';
import { storage } from '../utils/storage';
import { requestNotificationPermissions, scheduleMealReminders, areRemindersScheduled } from '../utils/notifications';
import { USER_PROFILE, WEIGHT_HISTORY, MEAL_PLAN, WORKOUT_PLAN } from '../constants/sampleData';
import { THEMES } from '../constants/theme';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [themeMode, setThemeMode] = useState('dark');
  const [userProfile, setUserProfile] = useState(USER_PROFILE);
  const [weightHistory, setWeightHistory] = useState([]);
  const [mealLog, setMealLog] = useState({});
  const [waterLog, setWaterLog] = useState({});
  const [workoutLog, setWorkoutLog] = useState({});
  const [exercisePRs, setExercisePRs] = useState({});
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [achievement, setAchievement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const theme = THEMES[themeMode];

  useEffect(() => {
    async function initialize() {
      try {
        // Only request permission on boot — do NOT schedule reminders here.
        // Reminders are only scheduled when the user enables them in Settings.
        await requestNotificationPermissions().catch(e => console.log('Notif Permission check failed quietly'));
        
        const initialized = await storage.get(storage.keys.INITIALIZED);

        if (!initialized) {
          await storage.set(storage.keys.USER_PROFILE, USER_PROFILE);
          await storage.set(storage.keys.WEIGHT_HISTORY, WEIGHT_HISTORY);
          await storage.set(storage.keys.INITIALIZED, true);
          setWeightHistory(WEIGHT_HISTORY);
        } else {
          const [profile, weights, meals, workouts, prs, photos, storedWater] = await Promise.all([
            storage.get(storage.keys.USER_PROFILE),
            storage.get(storage.keys.WEIGHT_HISTORY),
            storage.get(storage.keys.MEAL_LOG),
            storage.get(storage.keys.WORKOUT_LOG),
            storage.get('EXERCISE_PRS'),
            storage.get('PROGRESS_PHOTOS'),
            storage.get(storage.keys.WATER_LOG),
          ]);
          if (profile) setUserProfile(profile);
          if (weights) setWeightHistory(weights || []);
          if (meals) setMealLog(meals || {});
          if (workouts) setWorkoutLog(workouts || {});
          if (prs) setExercisePRs(prs || {});
          if (photos) setProgressPhotos(photos || []);
          if (storedWater) setWaterLog(storedWater);
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

  const [currentDateKey, setCurrentDateKey] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Periodic check to auto-reset at midnight if app is open
  useEffect(() => {
    const timer = setInterval(() => {
      const now = format(new Date(), 'yyyy-MM-dd');
      if (now !== currentDateKey) {
        setCurrentDateKey(now);
      }
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [currentDateKey]);

  const todaysMeals = useMemo(() => {
    try {
      const dayOfWeek = new Date().getDay();
      const planDay = MEAL_PLAN.find(d => d.day === dayOfWeek) || MEAL_PLAN[0];
      return mealLog[currentDateKey] || planDay.meals.map(m => ({ ...m, isEaten: false }));
    } catch (e) { return MEAL_PLAN[0].meals; }
  }, [mealLog, currentDateKey]);

  const caloriesEaten = useMemo(() => {
    return (todaysMeals || []).filter(m => m?.isEaten).reduce((sum, m) => sum + (m.calories || 0), 0);
  }, [todaysMeals]);

  const todaysWorkout = useMemo(() => {
    try {
      const dayOfWeek = new Date().getDay();
      if (workoutLog[currentDateKey]) return workoutLog[currentDateKey];
      const plan = WORKOUT_PLAN.find(p => p.day === dayOfWeek) || WORKOUT_PLAN[WORKOUT_PLAN.length - 1];
      return { ...plan, exercises: (plan.exercises || []).map(e => ({ ...e, isDone: false, loggedWeight: 0 })) };
    } catch (e) { return null; }
  }, [workoutLog, currentDateKey]);

  const exercisesDone = useMemo(() => {
    return (todaysWorkout?.exercises || []).filter(e => e.isDone).length;
  }, [todaysWorkout]);

  const bmi = useMemo(() => {
    try {
      const heightInMeters = (userProfile.height || 170) / 100;
      return (userProfile.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
    } catch (e) { return '0.0'; }
  }, [userProfile]);

  const todaysWater = useMemo(() => {
    return waterLog[currentDateKey] || 0;
  }, [waterLog, currentDateKey]);

  const coachInsight = useMemo(() => {
    if (isLoading) return { title: 'Analyzing...', body: 'Gathering elite data...' };

    // 1. Check Weight Progress
    if (weightHistory.length >= 2) {
      const recent = weightHistory[weightHistory.length - 1].weight;
      const prev = weightHistory[weightHistory.length - 2].weight;
      const diff = recent - prev;
      if (diff > 0.4) return { 
        title: 'Elite Momentum', 
        body: `You gained ${diff.toFixed(1)}kg recently. Your anabolic state is peaking—stick to the plan!` 
      };
      if (diff <= 0) return { 
        title: 'Gainer Alert', 
        body: "Weight is stalling. Add a peanut butter sandwich and a glass of milk before bed today." 
      };
    }

    // 2. Check Daily Nutrition
    const hr = new Date().getHours();
    if (hr > 16 && caloriesEaten < userProfile.calorieTarget * 0.5) {
      return { 
        title: 'Fuel Required', 
        body: "It's late and you've missed your calorie targets. Focus on liquid calories (shakes) for an easy boost." 
      };
    }

    // 3. Check Daily Hydration
    if (todaysWater < 2000) {
      return {
        title: 'Hydration Target',
        body: "Your water intake is low. Dehydration can stall muscle protein synthesis. Drink up!"
      };
    }

    // Default
    return { 
      title: 'Daily Strategy', 
      body: `Focus on hitting your ${userProfile.calorieTarget} kcal target. Consistency is the secret to getting big.` 
    };
  }, [weightHistory, caloriesEaten, userProfile, isLoading, todaysWater]);

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
        
        // Trigger Achievement
        setAchievement({
          title: 'Weight Room Legend',
          description: `You just smashed your personal record on ${todaysWorkout.exercises.find(e => e.id === exerciseId)?.name || 'this exercise'}!`
        });
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

  const deleteMeal = useCallback(async (mealId) => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const updated = todaysMeals.filter(m => m.id !== mealId);
      const newLog = { ...mealLog, [todayKey]: updated };
      setMealLog(newLog);
      await storage.set(storage.keys.MEAL_LOG, newLog);
    } catch (e) { console.error('Meal delete failed', e); }
  }, [mealLog, todaysMeals]);

  const addCustomMeal = useCallback(async (meal) => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const currentMeals = todaysMeals;
      const newMeal = {
        ...meal,
        id: `custom_${Date.now()}`,
        isEaten: true, // Default to eaten when added manually usually
      };
      const updated = [...currentMeals, newMeal];
      const newLog = { ...mealLog, [todayKey]: updated };
      setMealLog(newLog);
      await storage.set(storage.keys.MEAL_LOG, newLog);
    } catch (e) { console.error('Add custom meal failed', e); }
  }, [mealLog, todaysMeals]);

  const addWater = useCallback(async (amount) => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const currentAmount = waterLog[todayKey] || 0;
      const newAmount = currentAmount + amount;
      
      // Trigger Achievement
      if (newAmount >= 3000 && currentAmount < 3000) {
        setAchievement({
          title: 'Hydration Hero',
          description: "You've crushed your 3L hydration target today! Optimal muscle recovery starts with water."
        });
      }

      const newLog = { ...waterLog, [todayKey]: newAmount };
      setWaterLog(newLog);
      await storage.set(storage.keys.WATER_LOG, newLog);
    } catch (e) { console.error('Water log failed', e); }
  }, [waterLog]);

  const resetWater = useCallback(async () => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const newLog = { ...waterLog, [todayKey]: 0 };
      setWaterLog(newLog);
      await storage.set(storage.keys.WATER_LOG, newLog);
    } catch (e) { console.error('Water reset failed', e); }
  }, [waterLog]);

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

  const addPhoto = useCallback(async (photo) => {
    try {
      const updated = [photo, ...progressPhotos];
      setProgressPhotos(updated);
      await storage.set('PROGRESS_PHOTOS', updated);
    } catch (e) { console.error('Photo add failed', e); }
  }, [progressPhotos]);

  const deletePhoto = useCallback(async (id) => {
    try {
      const updated = progressPhotos.filter(p => p.id !== id);
      setProgressPhotos(updated);
      await storage.set('PROGRESS_PHOTOS', updated);
    } catch (e) { console.error('Photo delete failed', e); }
  }, [progressPhotos]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const weightGained = (userProfile.currentWeight || 0) - (userProfile.startWeight || 0);
  const progressToGoal = Math.min((weightGained / ((userProfile.goalWeight || 1) - (userProfile.startWeight || 0))) * 100, 100);

  return (
    <AppContext.Provider value={{
      userProfile, weightHistory, mealLog, waterLog, workoutLog, exercisePRs, isLoading, theme, themeMode, bmi,
      weightGained, progressToGoal, todaysMeals, caloriesEaten, todaysWorkout, exercisesDone, coachInsight,
      progressPhotos, todaysWater, achievement,
      logWeight, toggleMealEaten, deleteMeal, toggleExerciseDone, logExerciseWeight, toggleTheme, updateProfile,
      addPhoto, deletePhoto, addCustomMeal, addWater, resetWater, setAchievement
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
