import React from "react";
import { View, StyleSheet, Pressable, FlatList, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

interface Transaction {
  id: string;
  occurredAt: string;
  type: "income" | "expense";
  amount: number;
}

interface TransactionListProps {
  onTransactionDeleted?: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

function TransactionItem({ 
  transaction, 
  onDelete 
}: { 
  transaction: Transaction; 
  onDelete: (id: string) => void;
}) {
  const { theme } = useTheme();
  const isIncome = transaction.type === "income";

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (Platform.OS === "web") {
      const confirmed = window.confirm(`이 ${isIncome ? "수입" : "지출"} 기록을 삭제하시겠습니까?`);
      if (confirmed) {
        onDelete(transaction.id);
      }
    } else {
      Alert.alert(
        "거래 삭제",
        `이 ${isIncome ? "수입" : "지출"} 기록을 삭제하시겠습니까?`,
        [
          { text: "취소", style: "cancel" },
          { 
            text: "삭제", 
            style: "destructive",
            onPress: () => onDelete(transaction.id),
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.transactionItem, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.typeIcon, 
          { backgroundColor: isIncome ? theme.successLight : theme.errorLight }
        ]}>
          <Feather 
            name={isIncome ? "arrow-down-left" : "arrow-up-right"} 
            size={16} 
            color={isIncome ? theme.success : theme.error} 
          />
        </View>
        <View>
          <ThemedText type="bodyMedium">
            {isIncome ? "수입" : "지출"}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {formatDate(transaction.occurredAt)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <ThemedText 
          type="bodyMedium" 
          style={{ color: isIncome ? theme.success : theme.error }}
        >
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
        </ThemedText>
        <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteButton}>
          <Feather name="trash-2" size={16} color={theme.error} />
        </Pressable>
      </View>
    </View>
  );
}

export function TransactionList({ onTransactionDeleted }: TransactionListProps) {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["/api/revenue/summary"], refetchType: "all" });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onTransactionDeleted?.();
    },
    onError: () => {
      Alert.alert("오류", "거래 삭제에 실패했습니다.");
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: "center" }}>
          불러오는 중...
        </ThemedText>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
        <Feather name="inbox" size={32} color={theme.textSecondary} />
        <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
          거래 내역이 없습니다
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <ThemedText type="h4">최근 거래</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {transactions.length}건
        </ThemedText>
      </View>
      <FlatList
        data={transactions.slice(0, 10)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onDelete={(id) => deleteMutation.mutate(id)} 
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: Spacing.md,
  },
  emptyText: {
    marginTop: Spacing.md,
    textAlign: "center",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    width: "100%",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  separator: {
    height: 1,
    width: "100%",
  },
});
