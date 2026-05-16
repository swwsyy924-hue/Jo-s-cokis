import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { Settings as SettingsIcon, Play } from 'lucide-react-native';
import { Settings } from '../types';

const { width } = Dimensions.get('window');

interface MainScreenProps {
  inputText: string;
  onStart: (text: string) => void;
  onOpenSettings: () => void;
  bubbleCount: number;
  settings: Settings;
}

export const MainScreen: React.FC<MainScreenProps> = ({ 
  inputText: initialText, 
  onStart, 
  onOpenSettings,
  bubbleCount,
  settings
}) => {
  const [text, setText] = useState(initialText);
  const [inputScrollY, setInputScrollY] = useState(0);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const startScale = useRef(new Animated.Value(1)).current;
  const settingsScale = useRef(new Animated.Value(1)).current;
  const settingsRotate = useRef(new Animated.Value(0)).current;

  // Determine if it's a tablet or phone for layout scaling
  const isTablet = width > 768;

  useEffect(() => {
    Animated.stagger(90, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(actionsAnim, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, inputAnim, actionsAnim, footerAnim]);

  const hexToRgba = (hex: string, alpha: number) => {
    const cleanHex = hex.replace('#', '');

    if (cleanHex.length !== 6) {
      return `rgba(168,85,247,${alpha})`;
    }

    const red = parseInt(cleanHex.substring(0, 2), 16);
    const green = parseInt(cleanHex.substring(2, 4), 16);
    const blue = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${red},${green},${blue},${alpha})`;
  };

  const findLineTag = (line: string) => {
    const trimmedStartLine = line.trimStart();

    return settings.tags.find(tag => (
      tag.symbol &&
      trimmedStartLine.startsWith(tag.symbol)
    ));
  };

  const renderHighlightedText = () => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      const matchedTag = findLineTag(line);

      return (
        <View key={`${index}-${line}`} style={styles.highlightLineWrapper}>
          <Text
            style={[
              styles.highlightLine,
              matchedTag && {
                backgroundColor: hexToRgba(matchedTag.color, 0.22),
                borderColor: hexToRgba(matchedTag.color, 0.45),
              }
            ]}
          >
            {line.length > 0 ? line : ' '}
          </Text>
        </View>
      );
    });
  };

  const handleStartPress = () => {
    if (!text.trim()) return;

    Animated.sequence([
      Animated.spring(startScale, {
        toValue: 0.94,
        useNativeDriver: true,
        friction: 5,
        tension: 140,
      }),
      Animated.spring(startScale, {
        toValue: 1.04,
        useNativeDriver: true,
        friction: 5,
        tension: 140,
      }),
      Animated.spring(startScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 120,
      }),
    ]).start(() => onStart(text));
  };

  const handleSettingsPress = () => {
    settingsRotate.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.spring(settingsScale, {
          toValue: 0.88,
          useNativeDriver: true,
          friction: 5,
          tension: 160,
        }),
        Animated.spring(settingsScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 140,
        }),
      ]),
      Animated.timing(settingsRotate, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onOpenSettings());
  };

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-26, 0],
  });

  const inputTranslateY = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [34, 0],
  });

  const actionsTranslateY = actionsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [34, 0],
  });

  const footerTranslateY = footerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const settingsRotation = settingsRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Top Navigation Row */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <View style={styles.titleGroup}>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{bubbleCount || 0}</Text>
            </View>
            <Text style={styles.brandTitle}>CookieTyper</Text>
          </View>
        </Animated.View>

        {/* Glossy Text Input Container */}
        <Animated.View
          style={[
            styles.inputAreaContainer,
            {
              opacity: inputAnim,
              transform: [
                { translateY: inputTranslateY },
                {
                  scale: inputAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.inputGlassLayer}>
            <View
              pointerEvents="none"
              style={[
                styles.highlightLayer,
                {
                  transform: [{ translateY: -inputScrollY }],
                },
              ]}
            >
              {renderHighlightedText()}
            </View>

            <TextInput
              multiline
              value={text}
              onChangeText={setText}
              onScroll={(event) => setInputScrollY(event.nativeEvent.contentOffset.y)}
              scrollEventThrottle={16}
              placeholder="الصق النص هنا..."
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={[
                styles.textInput,
                text.length > 0 && styles.transparentTextInput
              ]}
              textAlignVertical="top"
              selectionColor="#a855f7"
            />
          </View>
        </Animated.View>

        {/* Action Controls */}
        <Animated.View
          style={[
            styles.actionRow,
            {
              opacity: actionsAnim,
              transform: [{ translateY: actionsTranslateY }],
            },
          ]}
        >
          {/* Start Project Button */}
          <TouchableOpacity 
            onPress={handleStartPress}
            disabled={!text.trim()}
            activeOpacity={0.85}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={[
                styles.startBtn,
                !text.trim() && styles.disabledStartBtn,
                {
                  transform: [{ scale: startScale }],
                },
              ]}
            >
              <Play color="white" size={26} fill="white" />
              <Text style={styles.startBtnText}>START</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Quick Settings Access */}
          <TouchableOpacity 
            onPress={handleSettingsPress}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.settingsIconBtn,
                {
                  transform: [
                    { scale: settingsScale },
                    { rotate: settingsRotation },
                  ],
                },
              ]}
            >
              <SettingsIcon color="white" size={28} strokeWidth={2.5} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer Link / Branding */}
        <Animated.View
          style={[
            styles.footerInfo,
            {
              opacity: footerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
              transform: [{ translateY: footerTranslateY }],
            },
          ]}
        >
          <Text style={styles.discordInfo}>BY ZEUS</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  counterBadge: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(168,85,247,0.3)',
    minWidth: 50,
    alignItems: 'center',
  },
  counterText: {
    color: '#a855f7',
    fontWeight: '900',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  brandTitle: {
    color: 'white',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  inputAreaContainer: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  inputGlassLayer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  highlightLayer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  highlightLineWrapper: {
    width: '100%',
    alignItems: 'flex-end',
  },
  highlightLine: {
    color: 'white',
    fontSize: 19,
    lineHeight: 28,
    textAlign: 'right',
    textAlignVertical: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 6,
    marginBottom: 0,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 19,
    lineHeight: 28,
    textAlign: 'right',
    textAlignVertical: 'top',
    zIndex: 2,
  },
  transparentTextInput: {
    color: 'transparent',
  },
  actionRow: {
    flexDirection: 'row-reverse',
    marginTop: 24,
    gap: 14,
  },
  startBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: '#7c3aed',
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  disabledStartBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.5,
  },
  startBtnText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 6,
  },
  settingsIconBtn: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  footerInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  discordInfo: {
    color: '#94a3b8',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});