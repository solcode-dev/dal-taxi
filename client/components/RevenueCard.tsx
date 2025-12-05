import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface RevenueCardProps {
  revenue: number;
  netChange: number;
  periodLabel: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNetChange(amount: number): string {
  const sign = amount > 0 ? "+" : "";
  return sign + formatCurrency(amount);
}

export function RevenueCard({ revenue, netChange, periodLabel }: RevenueCardProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 200 });
  }, [revenue, netChange]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getChangeColor = () => {
    if (netChange > 0) return theme.success;
    if (netChange < 0) return theme.error;
    return theme.neutral;
  };

  const getChangeIcon = (): "arrow-up" | "arrow-down" | "minus" => {
    if (netChange > 0) return "arrow-up";
    if (netChange < 0) return "arrow-down";
    return "minus";
  };

  const getChangeText = () => {
    if (netChange > 0) return "increase from previous period";
    if (netChange < 0) return "decrease from previous period";
    return "no change from previous period";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <ThemedText
        type="caption"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        총 수입
      </ThemedText>
      
      <Animated.View style={animatedStyle}>
        <ThemedText type="displayLarge" style={styles.revenue}>
          {formatCurrency(revenue)}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(100)}
        key={`${netChange}-${periodLabel}`}
        style={styles.changeContainer}
        accessibilityLabel={`${formatNetChange(netChange)} ${getChangeText()}`}
      >
        <View style={[styles.changeIconContainer, { backgroundColor: getChangeColor() + "20" }]}>
          <Feather name={getChangeIcon()} size={16} color={getChangeColor()} />
        </View>
        <ThemedText
          type="bodyMedium"
          style={[styles.changeText, { color: getChangeColor() }]}
        >
          {formatNetChange(netChange)}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.periodText, { color: theme.textSecondary }]}
        >
          전 기간 대비
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  revenue: {
    textAlign: "center",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  changeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  changeText: {
    fontWeight: "600",
  },
  periodText: {
    marginLeft: Spacing.xs,
  },
});
