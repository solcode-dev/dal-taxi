import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { RevenueCard } from "@/components/RevenueCard";
import { CircularProgress } from "@/components/CircularProgress";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

const MOCK_DATA = {
  daily: {
    revenue: 50000,
    netChange: 10000,
  },
  weekly: {
    revenue: 350000,
    netChange: -50000,
  },
  monthly: {
    revenue: 1500000,
    netChange: 150000,
  },
  monthlyGoal: 2000000,
};

const PERIOD_LABELS: Record<PeriodType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");

  const handlePeriodChange = useCallback((period: PeriodType) => {
    setSelectedPeriod(period);
  }, []);

  const currentData = MOCK_DATA[selectedPeriod];
  const goalProgress = (MOCK_DATA.monthly.revenue / MOCK_DATA.monthlyGoal) * 100;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <PeriodFilter
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      />

      <View style={styles.section}>
        <RevenueCard
          revenue={currentData.revenue}
          netChange={currentData.netChange}
          periodLabel={PERIOD_LABELS[selectedPeriod]}
        />
      </View>

      <View style={styles.section}>
        <CircularProgress
          progress={goalProgress}
          currentAmount={MOCK_DATA.monthly.revenue}
          goalAmount={MOCK_DATA.monthlyGoal}
        />
      </View>
    </ScrollView>
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
    marginTop: Spacing["3xl"],
  },
});
