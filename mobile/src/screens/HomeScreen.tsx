import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { trpc } from '../utils/trpc';
import { useTranslation } from 'react-i18next';

const SCREEN_WIDTH = 350;
const SWIPE_THRESHOLD = 120;

export default function HomeScreen() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const { data: profilesData, isLoading, refetch } = trpc.discovery.getPotentialMatches.useQuery({
    limit: 10,
    filters: {
      minAge: 18,
      maxAge: 50,
      maxDistance: 50,
    },
  });

  const swipeMutation = trpc.discovery.swipe.useMutation({
    onSuccess: (data) => {
      if (data.isMatch) {
        // Show match animation or notification
        console.log('It\'s a match!');
      }
      nextCard();
    },
  });

  const profiles = profilesData?.profiles || [];
  const currentProfile = profiles[currentIndex];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else if (gesture.dy < -SWIPE_THRESHOLD) {
          swipeUp();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (currentProfile) {
        swipeMutation.mutate({ userId: currentProfile.id, direction: 'left' });
      }
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (currentProfile) {
        swipeMutation.mutate({ userId: currentProfile.id, direction: 'right' });
      }
    });
  };

  const swipeUp = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: -SCREEN_WIDTH },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (currentProfile) {
        swipeMutation.mutate({ userId: currentProfile.id, direction: 'up' });
      }
    });
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    refetch();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>{t('discovery.noMoreProfiles')}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={resetDeck}>
            <Text style={styles.refreshButtonText}>{t('discovery.refreshProfiles')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: rotation },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: currentProfile.images[0] }} style={styles.image} />
        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentProfile.distance} mi</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentProfile.compatibility}%</Text>
            </View>
          </View>
          <View style={styles.bottomOverlay}>
            <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
            <Text style={styles.location}>{currentProfile.location}</Text>
            <View style={styles.interestsContainer}>
              {currentProfile.interests.slice(0, 3).map((interest, index) => (
                <View key={index} style={styles.interestBadge}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.nopeButton]} onPress={swipeLeft}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.superLikeButton]} onPress={swipeUp}>
          <Ionicons name="star" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={swipeRight}>
          <Ionicons name="heart" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.5,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  bottomOverlay: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  interestText: {
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  nopeButton: {
    backgroundColor: '#ff4b4b',
  },
  superLikeButton: {
    backgroundColor: '#3ca4ff',
  },
  likeButton: {
    backgroundColor: '#4bcc94',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#ff4b4b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});