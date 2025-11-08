import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomConfirmProps {
  visible: boolean;
  title: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const CustomConfirm: React.FC<CustomConfirmProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2e2822' }]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomConfirm;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#2e2822',
    borderRadius: 12,
    padding: 25,
    borderWidth: 3,
    borderColor: '#d6bfa1',
    width: '85%',
  },
  title: {
    fontSize: 20,
    color: '#d6bfa1',
    fontFamily: 'Normal',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#d6bfa1',
    fontFamily: 'Normal',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6bfa1',
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#d6bfa1',
    fontSize: 16,
    fontFamily: 'Normal',
  },
});
