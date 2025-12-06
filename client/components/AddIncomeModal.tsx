import React, { useState } from "react";
import { View, StyleSheet, Modal, Pressable, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

interface AddIncomeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddIncomeModal({ visible, onClose, onSuccess }: AddIncomeModalProps) {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");

  const addIncomeMutation = useMutation({
    mutationFn: async (amountValue: number) => {
      const response = await apiRequest("POST", "/api/transactions", {
        type: "income",
        amount: amountValue,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/revenue/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAmount("");
      onSuccess();
      onClose();
    },
    onError: () => {
      Alert.alert("오류", "수입 추가에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleSubmit = () => {
    const numericAmount = parseInt(amount.replace(/,/g, ""), 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("알림", "올바른 금액을 입력해주세요.");
      return;
    }
    addIncomeMutation.mutate(numericAmount);
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
            <ThemedText type="h3">수입 추가</ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <Feather name="x" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="caption" style={[styles.label, { color: theme.textSecondary }]}>
              금액 (원)
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
                autoFocus
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
              disabled={addIncomeMutation.isPending}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
              <ThemedText type="bodyMedium" style={styles.submitText}>
                {addIncomeMutation.isPending ? "추가 중..." : "수입 추가"}
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
    width: "85%",
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
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
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
