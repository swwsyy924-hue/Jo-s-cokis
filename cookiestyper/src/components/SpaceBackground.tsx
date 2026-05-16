import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/**
 * Premium Space Background with stars and nebula effects.
 */
export const SpaceBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const starsArray = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  return (
    <View style={styles.container}>
      {/* Absolute Black Base */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#020202' }]} />
      
      {/* Nebula Radiants - Multiple layers for depth */}
      <LinearGradient
        colors={['rgba(88,28,135,0.12)', 'transparent']}
        style={styles.nebulaTop}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
      />
      <LinearGradient
        colors={['rgba(30,58,138,0.1)', 'transparent']}
        style={styles.nebulaBottom}
        start={{ x: 1, y: 1 }}
        end={{ x: 0.2, y: 0.2 }}
      />

      {/* Decorative Stars */}
      <View style={StyleSheet.absoluteFill}>
        {starsArray.map((star) => (
          <View
            key={star.id}
            style={[
              styles.star,
              {
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nebulaTop: {
    ...StyleSheet.absoluteFill,
    height: height * 0.7,
  },
  nebulaBottom: {
    ...StyleSheet.absoluteFill,
    top: height * 0.3,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
  },
  content: {
    flex: 1,
  },
});
