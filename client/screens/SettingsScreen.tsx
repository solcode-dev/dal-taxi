import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SettingsItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

function SettingsItem({ icon, title, subtitle, onPress }: SettingsItemProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.settingsItem,
        { backgroundColor: theme.backgroundDefault },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
        <Feather name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.settingsItemContent}>
        <ThemedText type="body">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <ThemedText
        type="caption"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        {title}
      </ThemedText>
      <View style={[styles.sectionContent, { backgroundColor: theme.backgroundDefault }]}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <SettingsSection title="PREFERENCES">
        <SettingsItem
          icon="target"
          title="Monthly Goal"
          subtitle="Set your revenue target"
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsItem
          icon="dollar-sign"
          title="Currency"
          subtitle="KRW (Korean Won)"
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsItem
          icon="moon"
          title="Appearance"
          subtitle="System default"
        />
      </SettingsSection>

      <SettingsSection title="DATA">
        <SettingsItem
          icon="download"
          title="Export Data"
          subtitle="Download your revenue history"
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsItem
          icon="refresh-cw"
          title="Sync"
          subtitle="Last synced: Just now"
        />
      </SettingsSection>

      <SettingsSection title="ABOUT">
        <SettingsItem
          icon="info"
          title="App Version"
          subtitle="1.0.0"
        />
        <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />
        <SettingsItem
          icon="help-circle"
          title="Help & Support"
        />
      </SettingsSection>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    minHeight: 56,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingsItemContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
});
