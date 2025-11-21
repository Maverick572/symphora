import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { initRecordingFolder } from '../utils/initRecordingFolder';
import { StyleSheet, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    initRecordingFolder();
  }, []);
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        Cinzel: require('../assets/fonts/Cinzel-Medium.ttf'),
        Normal: require('../assets/fonts/Cinzel-Black.ttf'),
      });
      setFontLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadFont();
  }, []);

  if (!fontLoaded) return null;

  return (
    <View style={styles.rootContainer}>
    <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#403932' },  // Your main BG color
        }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="set-pin" options={{ headerShown: false}} />
      <Stack.Screen name="verify-pin" options={{ headerShown: false}} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
    </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#403932',  // Same color here
  },
});