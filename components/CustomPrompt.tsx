import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomPromptProps {
  visible: boolean;
  title: string;
  placeholder?: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
}

const CustomPrompt: React.FC<CustomPromptProps> = ({
  visible,
  title,
  placeholder,
  onCancel,
  onSubmit,
}) => {
  const [input, setInput] = useState('');

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.promptBox}>
          <Text style={styles.title}>{title}</Text>

          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#a89c8a"
            value={input}
            onChangeText={setInput}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2e2822' }]}
              onPress={() => {
                onSubmit(input);
                setInput('');
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPrompt;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptBox: {
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
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#d6bfa1',
    borderRadius: 8,
    color: '#d6bfa1',
    fontFamily: 'Normal',
    padding: 10,
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
