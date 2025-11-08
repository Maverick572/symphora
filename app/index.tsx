import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text } from 'react-native';

export const options = { headerShown: false };

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [imagesLoaded, setImagesLoaded] = useState(0);


  useEffect(() => { const run = async () => {
      // Fade in both images
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      const storedPin = await AsyncStorage.getItem('userPin');
      const timer = setTimeout(async () => {
        if(storedPin){
          router.replace('/verify-pin');
        }
        else{
          router.replace('/set-pin');
        }
      }, 3000);

      // Cleanup timer if component unmounts early
      return () => clearTimeout(timer);
  };
  run();
  }, []);
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={require('../assets/images/titleIcon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.titleText}>Symphora</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#403932',
    gap: 4,
  },
  icon: {
    height: 200,
    width: '80%',
  },
  title: {
    width: '80%',
    height: 100,
  },
  titleText:{
    color: '#d6bfa1',
    fontSize: 55,
    fontFamily: 'Cinzel',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  }
});
