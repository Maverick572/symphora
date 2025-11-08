import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => {router.replace('/set-pin')}}>
        <Text style={styles.buttonText}>Update Pin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#403932',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#d6bfa1',
    fontSize: 18,
    fontFamily: 'Normal',
  },
  button: {
    backgroundColor: '#2e2822',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#d6bfa1',
    width: '75%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#d6bfa1',
    fontSize: 18,
    fontFamily: 'Normal',
  },
});
