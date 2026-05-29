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
  // Check if we are running in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';
  
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
    
    if (finalStatus !== 'granted') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'MuscleTrack Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2ECC71',
      });
    }
    return true;
  } catch (error) {
    console.warn('Notification permission error (Likely Expo Go limitation):', error);
    return false;
  }
}

export async function scheduleMealReminders(meals) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    for (const meal of (meals || [])) {
      const [hour, minute] = meal.time.split(':').map(Number);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for ${meal.name}`,
          body: `Fuel your body: ${meal.foods.slice(0, 2).join(', ')}`,
          data: { type: 'meal' },
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });
    }
  } catch (error) {
    console.warn('Could not schedule reminders in Expo Go:', error);
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
}
