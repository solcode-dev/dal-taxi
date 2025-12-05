import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

export type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const periods: { key: PeriodType; label: string }[] = [
  { key: "daily", label: "일간" },
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FilterButton({
  period,
  isSelected,
  onPress,
}: {
  period: { key: PeriodType; label: string };
  isSelected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const progress = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["transparent", theme.primary]
    );
    return { backgroundColor };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.filterButton,
        animatedStyle,
        !isSelected && { borderWidth: 1, borderColor: theme.progressTrack },
      ]}
      accessibilityLabel={`${period.label} filter`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <ThemedText
        type="bodyMedium"
        style={[
          styles.filterText,
          { color: isSelected ? "#FFFFFF" : theme.text },
        ]}
      >
        {period.label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function PeriodFilter({ selectedPeriod, onPeriodChange }: PeriodFilterProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      {periods.map((period) => (
        <FilterButton
          key={period.key}
          period={period}
          isSelected={selectedPeriod === period.key}
          onPress={() => onPeriodChange(period.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  filterText: {
    textAlign: "center",
  },
});
