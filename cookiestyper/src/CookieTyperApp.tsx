import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { MainScreen } from './components/MainScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AssistantMode } from './components/AssistantMode';
import { SpaceBackground } from './components/SpaceBackground';
import { useCookieTyper } from './hooks/useCookieTyper';
import { StatusBar } from 'expo-status-bar';

type AppScreen = 'main' | 'settings' | 'assistant';

/**
 * Main Application Hub - CookieTyper
 */
export default function App() {
  const [screen, setScreen] = useState<AppScreen>('main');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('main');
  
  const { 
    settings, 
    setSettings, 
    session, 
    parseText, 
    nextBubble, 
    prevBubble, 
    goToBubble, 
    isLoaded 
  } = useCookieTyper();

  // Show a themed loader while persistent data is being fetched
  if (!isLoaded) {
    return (
      <View style={styles.loadingHost}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  const handleStartRequested = (payload: string) => {
    parseText(payload);
    setScreen('assistant');
  };

  const navToSettings = () => {
    setPreviousScreen(screen);
    setScreen('settings');
  };

  const navBackFromSettings = () => {
    setScreen(previousScreen);
  };

  const persistSettings = (config: any) => {
    setSettings(config);
    navBackFromSettings();
  };

  const triggerFactoryReset = () => {
    setSettings({
      fontSize: 18,
      smartCleaner: true,
      tags: [
        { id: '1', symbol: '#', name: 'خارجي', color: '#ef4444' },
        { id: '2', symbol: '*', name: 'جانبي', color: '#22c55e' },
        { id: '3', symbol: '"', name: 'مؤثر', color: '#eab308' },
      ],
    });
  };

  return (
    <SpaceBackground>
      <StatusBar style="light" />
      <View style={styles.viewPort}>
        {/* Screen Routing Manager */}
        {screen === 'main' && (
          <MainScreen
            inputText={session.inputText}
            onStart={handleStartRequested}
            onOpenSettings={navToSettings}
            bubbleCount={session.bubbles.length}
            settings={settings}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onSave={persistSettings}
            onReset={triggerFactoryReset}
            onClose={navBackFromSettings}
          />
        )}

        {screen === 'assistant' && (
          <AssistantMode
            session={session}
            settings={settings}
            onNext={nextBubble}
            onPrev={prevBubble}
            onGoTo={goToBubble}
            onClose={() => setScreen('main')}
          />
        )}
      </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  loadingHost: {
    flex: 1,
    backgroundColor: '#020202',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPort: {
    flex: 1,
  },
});