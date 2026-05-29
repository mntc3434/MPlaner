import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions() {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('meals', {
        name: 'Meal Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2ECC71',
        sound: 'default',
      });
    }
    return true;
  } catch (error) {
    console.warn('Notification permission error:', error);
    return false;
  }
}

/**
 * Check if reminders are already scheduled so we don't re-schedule on every boot.
 */
export async function areRemindersScheduled() {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.length > 0;
  } catch (e) {
    return false;
  }
}

/**
 * Schedule all daily reminders: Meals, Workout, Sleep, and Hydration.
 */
export async function scheduleAllReminders(meals, profile) {
  if (!meals || meals.length === 0 || !profile) return;

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Cancel all existing scheduled notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // 1. MEAL REMINDERS
    for (const meal of meals) {
      const [hourStr, minuteStr] = (meal.time || '12:00').split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      
      if (isNaN(hour) || isNaN(minute)) continue;

      const getMotivation = (name) => {
        const n = name.toLowerCase();
        if (n.includes('breakfast')) return 'Kickstart your metabolism for elite gains.';
        if (n.includes('lunch')) return 'Refuel your muscles for the mid-day grind.';
        if (n.includes('dinner')) return 'End the day strong. Recovery starts now.';
        if (n.includes('snack') || n.includes('shake')) return 'Anabolic window is open—don\'t miss out.';
        return 'Consistency is the secret to getting big.';
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🍽️ MEAL TIME: ${meal.name.toUpperCase()}`,
          subtitle: `Target: ${meal.calories} kcal`,
          body: `Items: ${meal.foods?.join(', ') || 'Healthy meal'}\n${getMotivation(meal.name)} 💪`,
          data: { type: 'meal', mealId: meal.id },
          sound: 'default',
          ...(Platform.OS === 'android' && { channelId: 'meals', priority: Notifications.AndroidImportance.HIGH }),
        },
        trigger: { type: 'daily', hour, minute },
      });
    }

    // 2. WORKOUT REMINDER
    if (profile.workoutTime) {
        const [wHour, wMin] = profile.workoutTime.split(':').map(v => parseInt(v, 10));
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🏋️ EXERCISE TIME',
                body: 'Your gym session starts now! Discipline over motivation. Let\'s get to work.',
                sound: 'default',
            },
            trigger: { type: 'daily', hour: wHour, minute: wMin },
        });
    }

    // 3. SLEEP REMINDER
    if (profile.sleepTime) {
        const [sHour, sMin] = profile.sleepTime.split(':').map(v => parseInt(v, 10));
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '😴 RECOVERY MODE',
                body: 'It\'s time to wind down. Aim for 7-9 hours of sleep for optimal muscle growth.',
                sound: 'default',
            },
            trigger: { type: 'daily', hour: sHour, minute: sMin },
        });
    }

    // 4. HYDRATION REMINDERS (Every X Hours)
    if (profile.hydrationStartTime && profile.hydrationInterval) {
        const [hStartHour, hStartMin] = profile.hydrationStartTime.split(':').map(v => parseInt(v, 10));
        const interval = profile.hydrationInterval;
        
        // Schedule 5 hydration alerts throughout the day starting from start time
        for (let i = 0; i < 5; i++) {
            let nextHour = hStartHour + (i * interval);
            if (nextHour >= 24) break;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💧 HYDRATION CHECK',
                    body: 'Stay anabolic! Drink 300-500ml of water now to keep your performance high.',
                    sound: 'default',
                },
                trigger: { type: 'daily', hour: nextHour, minute: hStartMin },
            });
        }
    }

    console.log(`[Notification] ✅ Comprehensive reminders scheduled.`);
  } catch (error) {
    console.warn('[Notification] Error scheduling:', error);
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notification] All reminders cancelled.');
  } catch (e) {
    console.warn('[Notification] Error cancelling:', e);
  }
}
