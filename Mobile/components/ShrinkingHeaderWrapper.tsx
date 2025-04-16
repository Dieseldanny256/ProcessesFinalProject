import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const MAX_HEADER_HEIGHT = 100;
const MIN_HEADER_HEIGHT = 60;
const SCROLL_DISTANCE = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;

type Props = PropsWithChildren<{
  headerTitle: string;
  headerSubtitle: string;
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  pageBackgroundColor: { dark: string; light: string };
  scrollEnabled?: boolean;
}>;

export default function ShrinkingHeaderWrapper({
  children,
  headerTitle,
  headerSubtitle,
  headerImage,
  scrollEnabled = true,
  headerBackgroundColor,
  pageBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollOffset.value,
      [0, SCROLL_DISTANCE],
      [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT],
      'clamp'
    );

    return {
      height,
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      [0, SCROLL_DISTANCE],
      [1, 0.7],
      'clamp'
    );
  
    const translateX = interpolate(
      scrollOffset.value,
      [0, SCROLL_DISTANCE],
      [0, -40],
      'clamp'
    );
  
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  return (
      <ThemedView style={[styles.container, { backgroundColor: pageBackgroundColor[colorScheme] }]}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 50, 
          backgroundColor: '#BA0000',
          zIndex: 5,
        }}>
        </View>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            animatedHeaderStyle,
          ]}
        >
          <View style={styles.headerContent}>
            <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
              <Text style={styles.title}>{headerTitle}</Text>
              <Text style={styles.subtitle}>{headerSubtitle}</Text>
            </Animated.View>
            <View style={styles.imageContainer}>{headerImage}</View>
          </View>
        </Animated.View>

        <Animated.ScrollView
          ref={scrollRef}
          scrollEnabled={scrollEnabled}
          scrollEventThrottle={16}
          scrollIndicatorInsets={{ bottom }}
          contentContainerStyle={{
            paddingTop: MAX_HEADER_HEIGHT + 50,
            paddingBottom: bottom,
            minHeight: '110%',
            flexGrow: 1
          }}
          style={{
            flex: 1,
          }}
          bounces={false}
          alwaysBounceVertical={false}
        >
          <ThemedView style={[styles.content, { backgroundColor: pageBackgroundColor[colorScheme] }]}>{children}</ThemedView>
        </Animated.ScrollView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header2: {
    position: 'absolute',
    height: 50,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginTop: 50,
    paddingTop: 5
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flexShrink: 1,
  },
  title: {
    fontFamily: 'MicrogrammaEB',
    fontSize: 26, // dynamically change / find defualt ?
    letterSpacing: 1,
    color: 'white',
  },
  subtitle: {
    fontFamily:'PuristaSemiBI',
    fontSize: 27,
    letterSpacing: 1,
    lineHeight: 30,
    color: 'white',
  },

  imageContainer: {
    marginLeft: 12,
  },

  content: {
    flex: 1,
  },
});
