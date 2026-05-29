import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AppProvider, useApp } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import WeightTrackerScreen from './src/screens/WeightTrackerScreen';
import MealPlanScreen from './src/screens/MealPlanScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { COLORS } from './src/constants/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { isLoading, theme } = useApp();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialCommunityIcons.font,
          ...MaterialIcons.font,
          ...FontAwesome.font,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && !isLoading) {
      // This tells the splash screen to hide immediately!
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, isLoading]);

  if (!appIsReady || isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: '#04070a' }]}>
        <Text style={styles.loadingTitle}>MPLANER</Text>
        <Text style={styles.loadingSub}>INITIALIZING CORE ENGINE...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#666',
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Meals') iconName = focused ? 'restaurant' : 'restaurant-outline';
            else if (route.name === 'Workout') iconName = focused ? 'fitness' : 'fitness-outline';
            else if (route.name === 'Progress') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Meals" component={MealPlanScreen} />
        <Tab.Screen name="Workout" component={WorkoutScreen} />
        <Tab.Screen name="Progress" component={WeightTrackerScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: COLORS.primary,
              background: '#04070a',
              card: 'rgba(22, 27, 34, 0.8)',
              text: '#FFFFFF',
              border: 'rgba(255, 255, 255, 0.1)',
              notification: COLORS.primary,
            },
          }}
        >
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingTitle: { fontSize: 28, fontWeight: '900', color: COLORS.primary, letterSpacing: 4 },
  loadingSub: { fontSize: 10, color: '#666', marginTop: 10, letterSpacing: 2, fontWeight: '700' },
  tabBar: {
    backgroundColor: 'rgba(4, 7, 10, 0.85)',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 0,
  },
  tabLabel: { fontSize: 10, fontWeight: '700', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
});
