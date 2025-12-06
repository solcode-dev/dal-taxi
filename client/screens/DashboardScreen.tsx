import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { RevenueCard } from "@/components/RevenueCard";
import { CircularProgress } from "@/components/CircularProgress";
import { CurrentPeriodBadge } from "@/components/CurrentPeriodBadge";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { AddIncomeModal } from "@/components/AddIncomeModal";
import { ConfettiAnimation } from "@/components/ConfettiAnimation";
import { TransactionList } from "@/components/TransactionList";
import { GoalSettingModal } from "@/components/GoalSettingModal";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface RevenueSummary {
  revenue: number;
  netChange: number;
  period: string;
}

interface FinancialGoal {
  id: string;
  year: number;
  month: number;
  amount: number;
}

const PERIOD_LABELS: Record<PeriodType, string> = {
  daily: "일간",
  weekly: "주간",
  monthly: "월간",
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: revenueData, isLoading: isRevenueLoading } = useQuery<RevenueSummary>({
    queryKey: ["/api/revenue/summary", selectedPeriod],
  });

  const { data: monthlyRevenue } = useQuery<RevenueSummary>({
    queryKey: ["/api/revenue/summary", "monthly"],
  });

  const { data: goalData } = useQuery<FinancialGoal>({
    queryKey: ["/api/goals", currentYear, currentMonth],
  });

  const handlePeriodChange = useCallback((period: PeriodType) => {
    setSelectedPeriod(period);
  }, []);

  const handleIncomeSuccess = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  const handleGoalPress = useCallback(() => {
    setIsGoalModalVisible(true);
  }, []);

  const revenue = revenueData?.revenue ?? 0;
  const netChange = revenueData?.netChange ?? 0;
  const currentMonthlyRevenue = monthlyRevenue?.revenue ?? 0;
  const goalAmount = goalData?.amount ?? 2000000;
  const goalProgress = goalAmount > 0 ? (currentMonthlyRevenue / goalAmount) * 100 : 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.container}
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
        <CurrentPeriodBadge period={selectedPeriod} />

        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        <View style={styles.section}>
          {isRevenueLoading ? (
            <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundDefault }]}>
              <ActivityIndicator size="large" color={theme.primary} />
              <ThemedText type="caption" style={styles.loadingText}>
                데이터 로딩 중...
              </ThemedText>
            </View>
          ) : (
            <RevenueCard
              revenue={revenue}
              netChange={netChange}
              periodLabel={PERIOD_LABELS[selectedPeriod]}
            />
          )}
        </View>

        <View style={styles.section}>
          <CircularProgress
            progress={Math.min(goalProgress, 100)}
            currentAmount={currentMonthlyRevenue}
            goalAmount={goalAmount}
            onPress={handleGoalPress}
          />
        </View>

        <View style={styles.section}>
          <TransactionList />
        </View>
      </ScrollView>

      <FloatingActionButton onPress={() => setIsAddModalVisible(true)} />

      <AddIncomeModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={handleIncomeSuccess}
      />

      <GoalSettingModal
        visible={isGoalModalVisible}
        onClose={() => setIsGoalModalVisible(false)}
      />

      <ConfettiAnimation
        visible={showConfetti}
        onComplete={handleConfettiComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing["3xl"],
  },
  loadingContainer: {
    padding: Spacing["3xl"],
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
  },
});
