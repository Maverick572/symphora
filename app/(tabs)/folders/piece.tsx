// src/screens/PieceFolder.tsx
import { useFolderNavigation } from '@/utils/folderNavigation';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
  createPieceFolder,
  deletePieceFolder,
  getPieceFolder,
} from '../../../utils/folderManager';

export default function PieceFolder() {
  const { instrument } = useLocalSearchParams<{ instrument: string }>();
  const decodedInstrument = decodeURIComponent(instrument ?? '');

  const [items, setItems] = useState<{ fileName: string; displayName: string }[]>([]);
  const [promptVisible, setPromptVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteKey, setDeleteKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { isInInstrument } = useFolderNavigation();

  // -----------------------------------------------------------------
  // Load pieces
  // -----------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const pieces = await getPieceFolder(decodedInstrument);
        setItems(pieces.map(p => ({ fileName: p, displayName: p })));
      } catch (e) {
        console.error('Error loading pieces:', e);
        Alert.alert('Error', 'Failed to load pieces.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [decodedInstrument]);

  // -----------------------------------------------------------------
  // Add / Delete
  // -----------------------------------------------------------------
  const add = async (name: string) => {
    setIsLoading(true);
    try {
      await createPieceFolder(decodedInstrument, name);
      const pieces = await getPieceFolder(decodedInstrument);
      setItems(pieces.map(p => ({ fileName: p, displayName: p })));
    } catch (e) {
      console.error('Error adding piece:', e);
      Alert.alert('Error', 'Could not add piece.');
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (fileName: string) => {
    setIsLoading(true);
    try {
      await deletePieceFolder(decodedInstrument, fileName);
      const pieces = await getPieceFolder(decodedInstrument);
      setItems(pieces.map(p => ({ fileName: p, displayName: p })));
    } catch (e) {
      console.error('Error deleting piece:', e);
      Alert.alert('Error', 'Could not delete piece.');
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
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  router.push(`/(tabs)/folders/recordings?instrument=${encodeURIComponent(decodedInstrument)}&piece=${encodeURIComponent(item.fileName)}`)
                }
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
        <Text style={styles.buttonText}>Add Piece</Text>
      </TouchableOpacity>

      {/* Modals */}
      <CustomPrompt
        visible={promptVisible}
        title="Add Piece"
        placeholder="Enter piece name"
        onCancel={() => setPromptVisible(false)}
        onSubmit={v => {
          add(v);
          setPromptVisible(false);
        }}
      />
      <CustomConfirm
        visible={deleteConfirm}
        title="Delete Piece"
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
/* Styles (same visual language)                                    */
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