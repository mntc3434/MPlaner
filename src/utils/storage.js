import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@muscletrack:user_profile',
  WEIGHT_HISTORY: '@muscletrack:weight_history',
  MEAL_LOG: '@muscletrack:meal_log',
  WORKOUT_LOG: '@muscletrack:workout_log',
  CUSTOM_MEALS: '@muscletrack:custom_meals',
  EXERCISE_PROGRESS: '@muscletrack:exercise_progress',
  SETTINGS: '@muscletrack:settings',
  INITIALIZED: '@muscletrack:initialized',
  WATER_LOG: '@muscletrack:water_log',
};

export const storage = {
  async get(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error(`Storage get error for key ${key}:`, e);
      return null;
    }
  },

  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Storage set error for key ${key}:`, e);
      return false;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Storage remove error for key ${key}:`, e);
      return false;
    }
  },

  async clear() {
    try {
      const allKeys = Object.values(KEYS);
      await AsyncStorage.multiRemove(allKeys);
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  },

  keys: KEYS,
};
