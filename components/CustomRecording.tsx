import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface CustomRecordingProps {
  visible: boolean;
  title: string;
  message?: string;
  onStop: () => void;
  onCancel: () => void;
  isRecording: boolean;
  isPaused: boolean;
  onPauseResume: () => void;
}

const CustomRecording: React.FC<CustomRecordingProps> = ({
  visible,
  title,
  message,
  onStop,
  onCancel,
  isRecording,
  isPaused,
  onPauseResume,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  const wasRecording = useRef(false); // Track previous isRecording state

  // Timer logic with reset only on new recording
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    // Reset timer only when starting a new recording (isRecording becomes true from false)
    if (isRecording && !wasRecording.current) {
      setElapsedTime(0); // Reset timer at the start of a new recording
    }

    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    // Update wasRecording for the next render
    wasRecording.current = isRecording;

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, isPaused]);

  // Pulsing animation for recording indicator
  useEffect(() => {
    if (isRecording && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, isPaused, pulseAnim]);

  // Reset elapsedTime when modal is closed
  useEffect(() => {
    if (!visible) {
      setElapsedTime(0); // Reset timer when modal is closed
      wasRecording.current = false; // Reset recording state tracking
    }
  }, [visible]);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.recordingIndicator}>
            <Animated.View
              style={[
                styles.recordingDot,
                { transform: [{ scale: pulseAnim }], opacity: isPaused ? 0.5 : 1 },
              ]}
            />
            <Text style={styles.title}>
              {isPaused ? 'Paused' : 'Recording'} {formatTime(elapsedTime)}
            </Text>
          </View>

          {message && <Text style={styles.title}>{message}</Text>}

          <View style={styles.row}>
            {isRecording && (
              <TouchableOpacity style={styles.button} onPress={onPauseResume}>
                <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={onStop}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomRecording;

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
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff5555',
    marginRight: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
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