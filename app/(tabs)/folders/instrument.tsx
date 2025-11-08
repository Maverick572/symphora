// src/screens/InstrumentFolder.tsx
import { useFolderNavigation } from '@/utils/folderNavigation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomConfirm from '../../../components/CustomConfirm';
import CustomPrompt from '../../../components/CustomPrompt';
import {
  createInstrumentFolder,
  deleteInstrumentFolder,
  getInstrumentFolder,
} from '../../../utils/folderManager';

export default function InstrumentFolder() {
  const [items, setItems] = useState<{ fileName: string; displayName: string }[]>([]);
  const [promptVisible, setPromptVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteKey, setDeleteKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { isAtRoot } = useFolderNavigation();

  // -----------------------------------------------------------------
  // Load instruments
  // -----------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const folders = await getInstrumentFolder();
        setItems(folders.map(f => ({ fileName: f, displayName: f })));
      } catch (e) {
        console.error('Error loading instruments:', e);
        Alert.alert('Error', 'Failed to load instruments.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // -----------------------------------------------------------------
  // Add / Delete
  // -----------------------------------------------------------------
  const add = async (name: string) => {
    setIsLoading(true);
    try {
      await createInstrumentFolder(name);
      const folders = await getInstrumentFolder();
      setItems(folders.map(f => ({ fileName: f, displayName: f })));
    } catch (e) {
      console.error('Error adding instrument:', e);
      Alert.alert('Error', 'Could not add instrument.');
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (fileName: string) => {
    setIsLoading(true);
    try {
      await deleteInstrumentFolder(fileName);
      const folders = await getInstrumentFolder();
      setItems(folders.map(f => ({ fileName: f, displayName: f })));
    } catch (e) {
      console.error('Error deleting instrument:', e);
      Alert.alert('Error', 'Could not delete instrument.');
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
        <Text style={styles.text}>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 40 }} />

      <ScrollView contentContainerStyle={styles.list}>
        {items.map(item => (
          <View key={item.fileName} style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => router.push(`/(tabs)/folders/piece?instrument=${encodeURIComponent(item.fileName)}`)}
              >
                <Text style={styles.text}>{item.displayName}</Text>
              </TouchableOpacity>

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
          </View>
        ))}
      </ScrollView>

      {/* Add button */}
      <TouchableOpacity style={styles.button} onPress={() => setPromptVisible(true)}>
        <Text style={styles.buttonText}>Add Instrument</Text>
      </TouchableOpacity>

      {/* Modals */}
      <CustomPrompt
        visible={promptVisible}
        title="Add Instrument"
        placeholder="Enter instrument name"
        onCancel={() => setPromptVisible(false)}
        onSubmit={v => {
          add(v);
          setPromptVisible(false);
        }}
      />
      <CustomConfirm
        visible={deleteConfirm}
        title="Delete Instrument"
        message={`Delete "${deleteKey}"?`}
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={() => {
          remove(deleteKey);
          setDeleteConfirm(false);
        }}
      />
    </View>
  );
}

/* ----------------------------------------------------------------- */
/* Styles (shared look-and-feel)                                    */
/* ----------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#403932', justifyContent: 'center' },
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