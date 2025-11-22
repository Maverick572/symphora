import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const router = useRouter();

  const [size, setSize] = useState<number | null>(null);
  const [quality, setQuality] = useState<string>("medium");

  const recordingsPath = FileSystem.documentDirectory + "recordings";

  // ---------------------
  // LOAD RECORDING QUALITY
  // ---------------------
  async function loadQuality() {
    const q = await AsyncStorage.getItem("recording_quality");
    if (q) setQuality(q);
  }

  async function changeQuality(q: string) {
    setQuality(q);
    await AsyncStorage.setItem("recording_quality", q);
  }

  // ---------------------
  // FOLDER SIZE CALCULATION
  // ---------------------
  async function getFolderSize(path: string): Promise<number> {
    let total = 0;

    try {
      const items = await FileSystem.readDirectoryAsync(path);
      for (const item of items) {
        const itemPath = path + "/" + item;
        const info: any = await FileSystem.getInfoAsync(itemPath);

        if (info.isDirectory) {
          total += await getFolderSize(itemPath);
        } else if (typeof info.size === "number") {
          total += info.size;
        }
      }
    } catch {
      return 0;
    }

    return total;
  }

  async function loadSize() {
    try {
      const info = await FileSystem.getInfoAsync(recordingsPath);
      if (!info.exists) {
        setSize(0);
        return;
      }
      const total = await getFolderSize(recordingsPath);
      setSize(total);
    } catch {
      setSize(0);
    }
  }

  // Run when tab gets focus
  useFocusEffect(
    useCallback(() => {
      loadQuality();
      loadSize();
    }, [])
  );

  function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  }

  // ---------------------
  // UI
  // ---------------------
  return (
    <View style={styles.container}>

      {/* STORAGE */}
      <View style={styles.card} >
        <Text style={styles.text}>
          Storage Used
        </Text> 
        <Text style={styles.text}>
          {size === null ? "Loading..." : formatBytes(size)}
        </Text>
      </View>

      {/* RECORDING QUALITY */}
      <View style={styles.qualitycard} >
        <Text style={styles.qualitytitle}>Recording Quality</Text>

        <TouchableOpacity
          style={[styles.qualitybutton, { backgroundColor: quality === "high" ? "#6b5643" : "#2e2822" }]}
          onPress={() => changeQuality("high")}
        >
          <Text style={styles.buttonText}>High </Text><Text style={styles.buttonText}>(WAV, 48 kHz)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.qualitybutton, { backgroundColor: quality === "medium" ? "#6b5643" : "#2e2822" }]}
          onPress={() => changeQuality("medium")}
        >
          <Text style={styles.buttonText}>Medium</Text><Text style={styles.buttonText}> (M4A, 44.1 kHz)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.qualitybutton, { backgroundColor: quality === "low" ? "#6b5643" : "#2e2822" }]}
          onPress={() => changeQuality("low")}
        >
          <Text style={styles.buttonText}>Low </Text><Text style={styles.buttonText}>(AAC, 32 kHz)</Text>
        </TouchableOpacity>
      </View>

      {/* UPDATE PIN */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/set-pin")}
      >
        <Text style={styles.buttonText}>Update Pin</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#403932",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#d6bfa1",
    fontSize: 18,
    fontFamily: "Normal",
  },
  button: {
    backgroundColor: "#2e2822",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#d6bfa1",
    width: "75%",
    alignItems: "center",
  },
  qualitybutton: {
    backgroundColor: "#2e2822",
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 5,
    borderWidth: 3,
    borderColor: "#d6bfa1",
    width: "90%",
    alignItems: "center",
  },
  qualitytitle:{
    color: "#d6bfa1",
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "Normal",
  },
  buttonText: {
    color: "#d6bfa1",
    fontSize: 18,
    fontFamily: "Normal",
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 50,
    width: "75%",
    backgroundColor: '#2e2822',
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#d6bfa1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualitycard: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    width: "75%",
    backgroundColor: '#2e2822',
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#d6bfa1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
