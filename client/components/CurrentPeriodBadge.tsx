import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { PeriodType } from "@/components/PeriodFilter";

interface CurrentPeriodBadgeProps {
  period: PeriodType;
}

function getPeriodDateRange(period: PeriodType): { label: string; range: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  switch (period) {
    case "daily":
      return {
        label: `${year}년 ${month}월 ${date}일`,
        range: "오늘",
      };
    case "weekly": {
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(now);
      monday.setDate(date - daysToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return {
        label: `${year}년 ${monthNames[month - 1]}`,
        range: `${monday.getDate()}일 - ${sunday.getDate()}일`,
      };
    }
    case "monthly":
    default:
      return {
        label: `${year}년 ${monthNames[month - 1]}`,
        range: "이번 달",
      };
  }
}

export function CurrentPeriodBadge({ period }: CurrentPeriodBadgeProps) {
  const { theme } = useTheme();
  const { label, range } = getPeriodDateRange(period);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.iconContainer}>
        <Feather name="calendar" size={16} color={theme.primary} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="bodyMedium" style={{ color: theme.text }}>
          {label}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {range}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  textContainer: {
    flexDirection: "column",
  },
});
