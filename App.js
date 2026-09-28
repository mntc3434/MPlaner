import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  Ionicons, 
  MaterialCommunityIcons, 
  MaterialIcons, 
  FontAwesome,
  FontAwesome5,
  AntDesign 
} from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AppProvider, useApp } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import WeightTrackerScreen from './src/screens/WeightTrackerScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import MealPlanScreen from './src/screens/MealPlanScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WaterTrackerScreen from './src/screens/WaterTrackerScreen';
import WeeklyReportScreen from './src/screens/WeeklyReportScreen';
import AchievementModal from './src/components/AchievementModal';
import { COLORS } from './src/constants/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync().catch(() => {});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProgressStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgressMain" component={WeightTrackerScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Water" component={WaterTrackerScreen} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isLoading, achievement, setAchievement } = useApp();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialCommunityIcons.font,
          ...MaterialIcons.font,
          ...FontAwesome.font,
          ...FontAwesome5.font,
          ...AntDesign.font,
        });
        console.log("Vector fonts loaded successfully.");
      } catch (e) {
        console.warn("Font load error (Icons might be missing):", e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  // Use a targeted useEffect to hide the splash screen as soon as we have enough to show
  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: '#04070a' }]}>
        <Text style={styles.loadingTitle}>MPLANER</Text>
        <Text style={styles.loadingSub}>LOADING ELITE ASSETS...</Text>
      </View>
    );
  }

  return (
    <>
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
      <Tab.Screen 
        name="Progress" 
        component={ProgressStack} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('Progress', { screen: 'ProgressMain' });
          },
        })}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
    <AchievementModal 
      visible={!!achievement} 
      achievement={achievement} 
      onClose={() => setAchievement(null)} 
    />
  </>
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
