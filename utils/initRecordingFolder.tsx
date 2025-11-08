import * as FileSystem from 'expo-file-system/legacy';

export async function initRecordingFolder() {
  const dir = FileSystem.documentDirectory + 'recordings';

  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    console.log('✅ Recordings folder created at:', dir);
  } else {
    console.log('📂 Recordings folder already exists at:', dir);
  }

  return dir;
}
