import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, title, message, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#2e2822',
    borderRadius: 12,
    padding: 25,
    borderWidth: 3,
    borderColor: '#d6bfa1',
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#d6bfa1',
    fontFamily: 'Normal',
    marginBottom: 10,
  },
  message: {
    color: '#d6bfa1',
    fontSize: 16,
    fontFamily: 'Normal',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#403932',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6bfa1',
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#d6bfa1',
    fontSize: 16,
    fontFamily: 'Normal',
  },
});
