import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface CircularProgressProps {
  progress: number;
  currentAmount: number;
  goalAmount: number;
  onPress?: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 180;
const STROKE_WIDTH = 16;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(amount);
}

export function CircularProgress({ progress, currentAmount, goalAmount, onPress }: CircularProgressProps) {
  const { theme } = useTheme();
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const getProgressColor = () => {
    if (progress >= 81) return theme.success;
    if (progress >= 51) return theme.primary;
    return theme.warning;
  };

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE * (1 - animatedProgress.value / 100);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.titleRow}>
        <ThemedText type="h4" style={styles.title}>
          월간 목표 달성률
        </ThemedText>
        {onPress ? (
          <Pressable onPress={onPress} hitSlop={8} style={styles.editButton}>
            <Feather name="edit-2" size={16} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <View
        style={styles.progressContainer}
        accessibilityLabel={`Monthly goal achievement ${Math.round(progress)} percent`}
      >
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={theme.progressTrack}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={getProgressColor()}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={styles.percentageContainer}>
          <ThemedText type="h1" style={styles.percentage}>
            {Math.round(progress)}%
          </ThemedText>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <ThemedText type="bodyMedium" style={{ color: theme.primary }}>
          {formatCurrency(currentAmount)}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {" / "}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {formatCurrency(goalAmount)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    textAlign: "center",
  },
  editButton: {
    padding: Spacing.xs,
  },
  progressContainer: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
  },
  percentageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontWeight: "700",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xl,
  },
});
