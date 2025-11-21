// (tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const tabcolor = "#2e2822";
SplashScreen.preventAutoHideAsync();

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: tabcolor,
            borderBottomColor: '#d6bfa1',
            borderBottomWidth: 3,
          },
          headerTintColor: '#d6bfa1',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontFamily: 'Cinzel', fontSize: 30, color: '#d6bfa1' },
          tabBarActiveTintColor: '#FF8C00',
          tabBarInactiveTintColor: '#aaa',
          tabBarLabelStyle: { fontFamily: 'Cinzel', fontSize: 12 },
          tabBarStyle: {
            backgroundColor: tabcolor,
            borderTopWidth: 3,
            borderColor: '#d6bfa1',
            height: 80,
            paddingBottom: 8,
            paddingTop: 10,
          },
          
        }}
      >
        <Tabs.Screen
          name="folders"
          options={{
            title: 'Symphony Vault',
            tabBarLabel: 'Recordings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="musical-notes" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Harmony Sanctum',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#403932'
  },
});