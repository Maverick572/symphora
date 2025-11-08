import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomAlert from '../components/CustomAlert';

export const options = { headerShown: false };

export default function VerifyPinScreen() {
    const[showincomplete, setShowIncomplete] = useState(false);
    const[showincorrect, setShowIncorrect] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = text;

    setPin(newPin);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const storedPin = await AsyncStorage.getItem('userPin');
    const enteredPin = pin.join('');
    console.log('Stored PIN:', storedPin);
    if (enteredPin.length < 4) {
        setShowIncomplete(true);
      //Alert.alert('Incomplete', 'Please enter all 4 digits.');
      return;
    }

    if (storedPin === enteredPin) {
        setShowSuccess(true);
      //Alert.alert('Access Granted', 'PIN verified successfully!');
    } else {
        setShowIncorrect(true);
      //Alert.alert('Incorrect PIN', 'Please try again.');
      setPin(['', '', '', '']);
      inputs.current[0]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your Pin</Text>

      <View style={styles.pinContainer}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputs.current[index] = ref;
            }}
            style={styles.pinBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>
        <CustomAlert
        visible={showincomplete}
        title="Incomplete Pin!"
        message="Please enter all 4 digits."
        onClose={() => setShowIncomplete(false)}
        />
        <CustomAlert
        visible={showincorrect}
        title="Incorrect Pin!"
        message="The entered PIN is incorrect. Please try again."
        onClose={() => setShowIncorrect(false)}
        />
        <CustomAlert
        visible={showSuccess}
        title="Success!"
        message="PIN verified successfully!"
        onClose={() => {setShowSuccess(false); router.replace('/(tabs)/folders/instrument');}}
        />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify Pin</Text>
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
