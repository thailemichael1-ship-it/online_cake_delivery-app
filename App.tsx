import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { RootNavigation } from './src/navigation';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { useThemeStore } from './src/store/theme.store';

export default function App() {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <RootNavigation />
        </ErrorBoundary>
      </SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
