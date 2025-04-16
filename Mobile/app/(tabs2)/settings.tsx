import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ProtectedeRoute from '@/components/protectedRoute';

export default function Settings() {
      
  return (
  <ProtectedeRoute>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gearshape.2"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedText>Edit your app experience here.</ThemedText>

      <Collapsible title="About Power Leveling">
        <ThemedText>
        Introducing the most action-packed fitness application you’ve ever seen: PowerLeveling! A fitness app that is designed with gamified elements that will keep you motivated to stay on the grind. 
        Compete with your friends to achieve the highest power level you can and see how you stack up on the global leaderboard! 
        Are you ready to get fit?
        </ThemedText>
      </Collapsible>

      <Collapsible title="Light and Dark Theme">
        <ThemedText >
          This template has light and dark mode support. 
          Switch the defualt presentation on your device 
          to change between light and dark.
        </ThemedText>
      </Collapsible>

    </ParallaxScrollView>
  </ProtectedeRoute>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
