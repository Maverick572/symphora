// app/(tabs)/folders/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function FoldersLayout() {
  return (
    <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#403932' },  // Your main BG color
        }}>
      <Stack.Screen name="instrument" />
      <Stack.Screen name="piece" />
      <Stack.Screen name="recordings" />
    </Stack>
  );
}