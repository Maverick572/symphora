// src/screens/RecordingsFolder.tsx
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomConfirm from '../../../components/CustomConfirm';
import CustomRecording from '../../../components/CustomRecording';
import {
  deleteAudioFile,
  getAudioFiles,
} from '../../../utils/folderManager';

interface PlaybackState {
  position: number;
  duration: number;
  isPlaying: boolean;
}

export default function RecordingsFolder() {
  const { instrument, piece } = useLocalSearchParams<{
    instrument: string;
    piece: string;
  }>();
  const decodedInstrument = decodeURIComponent(instrument ?? '');
  const decodedPiece = decodeURIComponent(piece ?? '');

  const [items, setItems] = useState<{ fileName: string; displayName: string }[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteKey, setDeleteKey] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playbackStates, setPlaybackStates] = useState<Record<string, PlaybackState>>({});
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingModalVisible, setRecordingModalVisible] = useState(false);
  const [folderKey, setFolderKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // -----------------------------------------------------------------
  // Audio mode (once)
  // -----------------------------------------------------------------
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    }).catch(e => console.error('Audio mode error:', e));
  }, []);

  // -----------------------------------------------------------------
  // Load audio files
  // -----------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const files = await getAudioFiles(decodedInstrument, decodedPiece);
        setItems(files);
        const init: Record<string, PlaybackState> = {};
        files.forEach(f => {
          init[f.fileName] = { position: 0, duration: 0, isPlaying: false };
        });
        setPlaybackStates(init);
      } catch (e) {
        console.error('Error loading recordings:', e);
        Alert.alert('Error', 'Failed to load recordings.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [decodedInstrument, decodedPiece]);

  // -----------------------------------------------------------------
  // Cleanup sound on unmount
  // -----------------------------------------------------------------
  useEffect(() => {
    return () => {
      sound?.unloadAsync().catch(() => {});
    };
  }, [sound]);

  // -----------------------------------------------------------------
  // Load a single sound (re-use one Audio.Sound instance)
  // -----------------------------------------------------------------
  const loadSound = async (fileName: string, shouldPlay = false) => {
    try {
      const uri = `${FileSystem.documentDirectory}recordings/${decodedInstrument}/${decodedPiece}/${fileName}`;
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) throw new Error('File missing');

      if (sound) await sound.unloadAsync();
      setSound(null);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay }
      );
      setSound(newSound);
      setFolderKey(fileName);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setPlaybackStates(prev => ({
            ...prev,
            [fileName]: {
              ...prev[fileName],
              position: status.positionMillis ?? 0,
              duration: status.durationMillis ?? 0,
              isPlaying: status.isPlaying,
            },
          }));
        }
      });
      return newSound;
    } catch (e: any) {
      console.error('loadSound error:', e);
      Alert.alert('Error', e.message);
      return null;
    }
  };

  // -----------------------------------------------------------------
  // Play / Pause
  // -----------------------------------------------------------------
  const handlePlayPause = async (fileName: string) => {
    if (sound && folderKey === fileName) {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (playbackStates[fileName]?.isPlaying) {
        await sound.pauseAsync();
        setPlaybackStates(p => ({
          ...p,
          [fileName]: { ...p[fileName], isPlaying: false },
        }));
      } else {
        await sound.playAsync();
        setPlaybackStates(p => ({
          ...p,
          [fileName]: { ...p[fileName], isPlaying: true },
        }));
      }
    } else {
      await loadSound(fileName, true);
    }
  };

  // -----------------------------------------------------------------
  // Seek
  // -----------------------------------------------------------------
  const handleSeek = async (fileName: string, value: number) => {
    if (sound && folderKey === fileName) {
      await sound.setPositionAsync(value);
      setPlaybackStates(p => ({
        ...p,
        [fileName]: { ...p[fileName], position: value },
      }));
    }
  };

  // -----------------------------------------------------------------
  // Recording flow
  // -----------------------------------------------------------------
  const startRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission', 'Microphone access required.');
      return;
    }
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    setIsPaused(false);
    setRecordingModalVisible(true);
  };

  const pauseResumeRecording = async () => {
    if (!recording) return;
    if (isPaused) {
      await recording.startAsync();
      setIsPaused(false);
    } else {
      await recording.pauseAsync();
      setIsPaused(true);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) {
      const ts = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .split('Z')[0];
      const fileName = `recording-${ts}.m4a`;
      const dest = `${FileSystem.documentDirectory}recordings/${decodedInstrument}/${decodedPiece}/${fileName}`;
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}recordings/${decodedInstrument}/${decodedPiece}`,
        { intermediates: true }
      );
      await FileSystem.moveAsync({ from: uri, to: dest });

      // Refresh list
      const files = await getAudioFiles(decodedInstrument, decodedPiece);
      setItems(files);
    }
    setRecording(null);
    setRecordingModalVisible(false);
    setIsPaused(false);
  };

  const cancelRecording = async () => {
    if (recording) await recording.stopAndUnloadAsync();
    setRecording(null);
    setRecordingModalVisible(false);
    setIsPaused(false);
  };

  // -----------------------------------------------------------------
  // Delete audio file
  // -----------------------------------------------------------------
  const remove = async (fileName: string) => {
    setIsLoading(true);
    try {
      await deleteAudioFile(decodedInstrument, decodedPiece, fileName);
      const files = await getAudioFiles(decodedInstrument, decodedPiece);
      setItems(files);
      setPlaybackStates(p => {
        const n = { ...p };
        delete n[fileName];
        return n;
      });
      if (fileName === folderKey && sound) {
        await sound.unloadAsync();
        setSound(null);
        setFolderKey('');
      }
    } catch (e) {
      console.error('Delete error:', e);
      Alert.alert('Error', 'Could not delete file.');
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------
  if (isLoading) {
    return (
      <View style={styles.container}>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#d6bfa1" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={{ height: 70 }} />

      <ScrollView contentContainerStyle={styles.list}>
        {items.map(item => (
          <View key={item.fileName} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ width: '70%' }}>
                <TouchableOpacity onPress={() => loadSound(item.fileName, false)}>
                  <Text style={styles.text}>{item.displayName}</Text>
                </TouchableOpacity>
              </View>
              <Ionicons
                name="trash-bin"
                size={24}
                color="#d6bfa1"
                onPress={() => {
                  setDeleteKey(item.fileName);
                  setDeleteConfirm(true);
                }}
              />
            </View>

            {/* Playback controls */}
            <View style={styles.cardControls}>
              <TouchableOpacity onPress={() => handlePlayPause(item.fileName)}>
                <Ionicons
                  name={playbackStates[item.fileName]?.isPlaying ? 'pause' : 'play'}
                  size={24}
                  color="#d6bfa1"
                />
              </TouchableOpacity>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={playbackStates[item.fileName]?.duration ?? 0}
                value={playbackStates[item.fileName]?.position ?? 0}
                onSlidingComplete={v => handleSeek(item.fileName, v)}
                minimumTrackTintColor="#d6bfa1"
                maximumTrackTintColor="#aaa"
                thumbTintColor="#d6bfa1"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Record button */}
      <TouchableOpacity
        style={[styles.button, recording && { opacity: 0.5 }]}
        onPress={() => !recording && startRecording()}
        disabled={!!recording}
      >
        <Text style={styles.buttonText}>Record</Text>
      </TouchableOpacity>

      {/* Modals */}
      <CustomConfirm
        visible={deleteConfirm}
        title="Delete Recording"
        message={`Delete "${deleteKey}"?`}
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={() => {
          remove(deleteKey);
          setDeleteConfirm(false);
        }}
      />
      <CustomRecording
        visible={recordingModalVisible}
        title="Recording"
        isRecording={!!recording}
        isPaused={isPaused}
        onStop={stopRecording}
        onCancel={cancelRecording}
        onPauseResume={pauseResumeRecording}
      />
    </View>
  );
}

/* ----------------------------------------------------------------- */
/* Styles (identical to the other screens)                          */
/* ----------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#403932', justifyContent: 'center' },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: { color: '#d6bfa1', fontSize: 16, fontFamily: 'Normal' },
  list: { width: '80%', alignSelf: 'center' },
  card: {
    padding: 20,
    backgroundColor: '#2e2822',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#d6bfa1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardControls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
    marginTop: 8,
  },
  slider: { flex: 1, height: 40 },
  text: { color: '#d6bfa1', fontSize: 18, fontFamily: 'Normal' },
  button: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#2e2822',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#d6bfa1',
    width: '75%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#d6bfa1', fontSize: 18, fontFamily: 'Normal' },
});