import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomAlert from '../components/CustomAlert';

export const options = { headerShown: false };

export default function SetPinScreen() {
    const [showAlert, setShowAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const router = useRouter();
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const inputs = useRef<Record<string, TextInput | null>>({});

  const handleChangeText = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    // Move to next input automatically
    if (text && index < 3) {
      const nextInput = inputs.current[`pinInput${index + 1}`];
      nextInput?.focus();
    }
  };

  const handleSetPin = async () => {
    if (pin.some(digit => digit === '')) {
        setShowAlert(true);
      //Alert.alert('Incomplete PIN', 'Please enter all 4 digits.');
      return;
    }
    const finalPin = pin.join('');
    await AsyncStorage.setItem('userPin', finalPin);
    setSuccessAlert(true);
    //Alert.alert('PIN Set', `Your PIN has been saved securely.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your 4-Digit PIN</Text>

      <View style={styles.pinContainer}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[`pinInput${index}`] = ref;
            }}
            style={styles.pinBox}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
          />
        ))}
      </View>
        <CustomAlert
        visible={showAlert}
        title="Incomplete Pin!"
        message="Please enter all 4 digits."
        onClose={() => setShowAlert(false)}
      />
      <CustomAlert
        visible={successAlert}
        title="Success!"
        message="Your PIN has been set successfully."
        onClose={() => {setSuccessAlert(false); router.replace('/(tabs)/folders/instrument');}}
      />
      <TouchableOpacity style={styles.button} onPress={handleSetPin}>
        <Text style={styles.buttonText}>Set Pin</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#403932',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Normal',
    color: '#d6bfa1',
    marginBottom: 30,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 40,
  },
  pinBox: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderColor: '#d6bfa1',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    color: '#d6bfa1',
    backgroundColor: '#2e2822',
  },
  button: {
    backgroundColor: '#d6bfa1',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: '#2e2822',
    fontSize: 18,
    fontFamily: 'Normal',
  },
});