// utils/folderNavigation.tsx
import * as FileSystem from 'expo-file-system/legacy';
import { useMemo, useState } from 'react';

export function useFolderNavigation(baseDir = `${FileSystem.documentDirectory}recordings`) {
  const [currentPath, setCurrentPath] = useState(baseDir);

  const navigateTo = (subfolder: string) => {
    const newPath = `${currentPath}/${subfolder}`;
    setCurrentPath(newPath);
  };

  const navigateBack = () => {
    if (currentPath === baseDir) return; // Already at root
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    setCurrentPath(parentPath);
  };

  // Memoized flags to determine navigation depth
  const isAtRoot = useMemo(() => currentPath === baseDir, [currentPath, baseDir]);
  const isInInstrument = useMemo(() => {
    const segments = currentPath.split('/').filter(segment => segment.length > 0);
    return segments.length === baseDir.split('/').filter(segment => segment.length > 0).length + 1;
  }, [currentPath, baseDir]);
  const isInPiece = useMemo(() => {
    const segments = currentPath.split('/').filter(segment => segment.length > 0);
    return segments.length === baseDir.split('/').filter(segment => segment.length > 0).length + 2;
  }, [currentPath, baseDir]);

  return {
    currentPath,
    navigateTo,
    navigateBack,
    isAtRoot,
    isInInstrument,
    isInPiece,
  };
}