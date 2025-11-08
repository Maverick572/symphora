// utils/folderManager.tsx
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Creates a subfolder inside the main "recordings" directory.
 * @param folderName The name of the subfolder to create (e.g. "Guitar").
 * @returns The URI of the created (or existing) folder.
 */
export async function createInstrumentFolder(folderName: string): Promise<string> {
  try {
    const recordingsDir = `${FileSystem.documentDirectory}recordings`;
    const recordingsInfo = await FileSystem.getInfoAsync(recordingsDir);
    if (!recordingsInfo.exists) {
      await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
      console.log('✅ Created main recordings folder.');
    }

    const subfolderPath = `${recordingsDir}/${folderName}`;
    const folderInfo = await FileSystem.getInfoAsync(subfolderPath);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(subfolderPath, { intermediates: true });
      console.log(`📂 Created subfolder: ${folderName}`);
    } else {
      console.log(`⚙️ Folder "${folderName}" already exists.`);
    }

    return subfolderPath;
  } catch (error) {
    console.error('❌ Error creating recording subfolder:', error);
    throw error;
  }
}

export async function getInstrumentFolder(): Promise<string[]> {
  try {
    const recordingsDir = `${FileSystem.documentDirectory}recordings`;
    const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
    }

    const items = await FileSystem.readDirectoryAsync(recordingsDir);
    const folders: string[] = [];
    for (const item of items) {
      const itemInfo = await FileSystem.getInfoAsync(`${recordingsDir}/${item}`);
      if (itemInfo.isDirectory) {
        folders.push(item);
      }
    }

    return folders;
  } catch (error) {
    console.error('❌ Error reading recording folders:', error);
    return [];
  }
}

export async function deleteInstrumentFolder(name: string) {
  try {
    const recordingsDir = `${FileSystem.documentDirectory}recordings`;
    const folderPath = `${recordingsDir}/${name}`;
    const info = await FileSystem.getInfoAsync(folderPath);

    if (info.exists) {
      await FileSystem.deleteAsync(folderPath, { idempotent: true });
      console.log(`🗑 Deleted folder: ${name}`);
      return true;
    } else {
      console.warn(`⚠️ Folder not found: ${folderPath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting folder "${name}":`, error);
    return false;
  }
}

export async function createPieceFolder(instrumentName: string, pieceName: string): Promise<string> {
  try {
    const baseDir = `${FileSystem.documentDirectory}recordings/${instrumentName}`;
    const baseInfo = await FileSystem.getInfoAsync(baseDir);

    if (!baseInfo.exists) {
      await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
      console.log(`✅ Created instrument folder: ${instrumentName}`);
    }

    const piecePath = `${baseDir}/${pieceName}`;
    const pieceInfo = await FileSystem.getInfoAsync(piecePath);

    if (!pieceInfo.exists) {
      await FileSystem.makeDirectoryAsync(piecePath, { intermediates: true });
      console.log(`📂 Created piece folder: ${pieceName} inside ${instrumentName}`);
    } else {
      console.log(`⚙️ Piece folder "${pieceName}" already exists in ${instrumentName}`);
    }

    return piecePath;
  } catch (error) {
    console.error('❌ Error creating piece folder:', error);
    throw error;
  }
}

export async function getPieceFolder(instrumentName: string): Promise<string[]> {
  try {
    const instrumentDir = `${FileSystem.documentDirectory}recordings/${instrumentName}`;
    const info = await FileSystem.getInfoAsync(instrumentDir);

    if (!info.exists) {
      console.warn(`⚠️ Instrument folder not found: ${instrumentName}`);
      return [];
    }

    const items = await FileSystem.readDirectoryAsync(instrumentDir);
    const pieceFolders: string[] = [];

    for (const item of items) {
      const itemInfo = await FileSystem.getInfoAsync(`${instrumentDir}/${item}`);
      if (itemInfo.isDirectory) pieceFolders.push(item);
    }

    return pieceFolders;
  } catch (error) {
    console.error(`❌ Error reading piece folders for ${instrumentName}:`, error);
    return [];
  }
}

export async function deletePieceFolder(instrumentName: string, pieceName: string): Promise<boolean> {
  try {
    const piecePath = `${FileSystem.documentDirectory}recordings/${instrumentName}/${pieceName}`;
    const info = await FileSystem.getInfoAsync(piecePath);

    if (info.exists) {
      await FileSystem.deleteAsync(piecePath, { idempotent: true });
      console.log(`🗑 Deleted piece folder: ${pieceName} from ${instrumentName}`);
      return true;
    } else {
      console.warn(`⚠️ Piece folder not found: ${piecePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting piece folder "${pieceName}" in ${instrumentName}:`, error);
    return false;
  }
}

/**
 * Lists all audio files inside a piece folder.
 * @param instrumentName The parent instrument folder.
 * @param pieceName The piece folder name.
 * @returns An array of audio file names.
 */
export async function getAudioFiles(instrumentName: string, pieceName: string): Promise<{ fileName: string; displayName: string }[]> {
  try {
    const pieceDir = `${FileSystem.documentDirectory}recordings/${instrumentName}/${pieceName}`;
    const info = await FileSystem.getInfoAsync(pieceDir);

    if (!info.exists) {
      console.warn(`⚠️ Piece folder not found: ${pieceDir}`);
      return [];
    }

    const items = await FileSystem.readDirectoryAsync(pieceDir);
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac'];
    const audioFiles: { fileName: string; displayName: string }[] = [];

    for (const item of items) {
      const itemInfo = await FileSystem.getInfoAsync(`${pieceDir}/${item}`);
      if (!itemInfo.isDirectory && audioExtensions.some(ext => item.toLowerCase().endsWith(ext))) {
        let displayName = item;

        // Parse file name if it matches 'recording-YYYY-MM-DDTHH-MM-SS.ext'
        if (item.startsWith('recording-')) {
          try {
            const timestampPart = item.match(/^recording-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/)?.[1];
            if (item.startsWith('recording-')) {
              try {
                const match = item.match(/^recording-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})(?:-(\d{3}))?Z?/);
                if (match) {
                  const [_, mainTime, ms] = match;
                  const fixedTimestamp =
                    mainTime.replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3') +
                    (ms ? `.${ms}` : ''); // Removed 'Z' to make it local

                  const date = new Date(fixedTimestamp);

                  displayName = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    day: 'numeric',
                    month: 'short',
                  }).format(date);
                }
              } catch (error) {
                console.warn(`⚠️ Failed to parse timestamp for ${item}:`, error);
              }
            }
          } catch (error) {
            console.warn(`⚠️ Failed to parse timestamp for ${item}:`, error);
          }
        }

        audioFiles.push({ fileName: item, displayName });
      }
    }

    return audioFiles;
  } catch (error) {
    console.error(`❌ Error reading audio files for ${instrumentName}/${pieceName}:`, error);
    return [];
  }
}

/**
 * Deletes a specific audio file inside a piece folder.
 * @param instrumentName The parent instrument folder.
 * @param pieceName The piece folder name.
 * @param fileName The audio file name to delete.
 */
export async function deleteAudioFile(instrumentName: string, pieceName: string, fileName: string): Promise<boolean> {
  try {
    const filePath = `${FileSystem.documentDirectory}recordings/${instrumentName}/${pieceName}/${fileName}`;
    const info = await FileSystem.getInfoAsync(filePath);

    if (info.exists) {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      console.log(`🗑 Deleted audio file: ${fileName} from ${instrumentName}/${pieceName}`);
      return true;
    } else {
      console.warn(`⚠️ Audio file not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting audio file "${fileName}" in ${instrumentName}/${pieceName}:`, error);
    return false;
  }
}