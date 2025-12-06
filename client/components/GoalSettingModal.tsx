import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Pressable, TextInput, Alert, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

interface GoalSettingModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FinancialGoal {
  id: string;
  year: number;
  month: number;
  amount: number;
}

const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월"
];

export function GoalSettingModal({ visible, onClose }: GoalSettingModalProps) {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const now = new Date();
  
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [amount, setAmount] = useState("");

  const { data: existingGoal } = useQuery<FinancialGoal>({
    queryKey: ["/api/goals", selectedYear, selectedMonth],
    enabled: visible,
  });

  useEffect(() => {
    if (existingGoal) {
      setAmount(existingGoal.amount.toLocaleString("ko-KR"));
    } else {
      setAmount("");
    }
  }, [existingGoal]);

  const saveGoalMutation = useMutation({
    mutationFn: async (goalData: { year: number; month: number; amount: number }) => {
      const response = await apiRequest("POST", "/api/goals", goalData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"], refetchType: "all" });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("완료", "월간 목표가 설정되었습니다.");
      onClose();
    },
    onError: () => {
      Alert.alert("오류", "목표 설정에 실패했습니다.");
    },
  });

  const handleSubmit = () => {
    const numericAmount = parseInt(amount.replace(/,/g, ""), 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("알림", "올바른 금액을 입력해주세요.");
      return;
    }
    saveGoalMutation.mutate({
      year: selectedYear,
      month: selectedMonth,
      amount: numericAmount,
    });
  };

  const formatInputAmount = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, "");
    if (numbers === "") {
      setAmount("");
      return;
    }
    const formatted = parseInt(numbers, 10).toLocaleString("ko-KR");
    setAmount(formatted);
  };

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.header}>
            <ThemedText type="h3">월간 목표 설정</ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <Feather name="x" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              연도
            </ThemedText>
            <View style={styles.yearContainer}>
              {years.map((year) => (
                <Pressable
                  key={year}
                  style={[
                    styles.yearButton,
                    { 
                      backgroundColor: selectedYear === year 
                        ? theme.primary 
                        : theme.backgroundSecondary 
                    },
                  ]}
                  onPress={() => setSelectedYear(year)}
                >
                  <ThemedText 
                    type="bodyMedium"
                    style={{ color: selectedYear === year ? "#FFFFFF" : theme.text }}
                  >
                    {year}년
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              월
            </ThemedText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthContainer}
            >
              {MONTHS.map((month, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.monthButton,
                    { 
                      backgroundColor: selectedMonth === index + 1 
                        ? theme.primary 
                        : theme.backgroundSecondary 
                    },
                  ]}
                  onPress={() => setSelectedMonth(index + 1)}
                >
                  <ThemedText 
                    type="small"
                    style={{ color: selectedMonth === index + 1 ? "#FFFFFF" : theme.text }}
                  >
                    {month}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              목표 금액 (원)
            </ThemedText>
            <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
              <ThemedText type="h4" style={{ color: theme.textSecondary }}>
                ₩
              </ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={amount}
                onChangeText={formatInputAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.cancelButton, { backgroundColor: theme.backgroundSecondary }]}
              onPress={onClose}
            >
              <ThemedText type="bodyMedium">취소</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
              disabled={saveGoalMutation.isPending}
            >
              <Feather name="check" size={18} color="#FFFFFF" />
              <ThemedText type="bodyMedium" style={styles.submitText}>
                {saveGoalMutation.isPending ? "저장 중..." : "저장"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  yearContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  yearButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  monthContainer: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  monthButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  submitText: {
    color: "#FFFFFF",
  },
});
