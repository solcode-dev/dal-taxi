import { users, transactions, financialGoals, type User, type InsertUser, type Transaction, type InsertTransaction, type FinancialGoal, type InsertFinancialGoal } from "@shared/schema";
import { db } from "./db";
import { eq, gte, lte, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTransactions(startDate?: Date, endDate?: Date): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: string): Promise<boolean>;
  
  getFinancialGoal(year: number, month: number): Promise<FinancialGoal | undefined>;
  getFinancialGoals(): Promise<FinancialGoal[]>;
  upsertFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTransactions(startDate?: Date, endDate?: Date): Promise<Transaction[]> {
    const conditions = [];
    
    if (startDate) {
      conditions.push(gte(transactions.occurredAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(transactions.occurredAt, endDate));
    }
    
    if (conditions.length > 0) {
      return db.select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(desc(transactions.occurredAt));
    }
    
    return db.select()
      .from(transactions)
      .orderBy(desc(transactions.occurredAt));
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();
    return result.length > 0;
  }

  async getFinancialGoal(year: number, month: number): Promise<FinancialGoal | undefined> {
    const [goal] = await db.select()
      .from(financialGoals)
      .where(and(
        eq(financialGoals.year, year),
        eq(financialGoals.month, month)
      ));
    return goal || undefined;
  }

  async getFinancialGoals(): Promise<FinancialGoal[]> {
    return db.select()
      .from(financialGoals)
      .orderBy(desc(financialGoals.year), desc(financialGoals.month));
  }

  async upsertFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal> {
    const existing = await this.getFinancialGoal(goal.year, goal.month);
    
    if (existing) {
      const [updated] = await db
        .update(financialGoals)
        .set({ amount: goal.amount })
        .where(eq(financialGoals.id, existing.id))
        .returning();
      return updated;
    }
    
    const [created] = await db
      .insert(financialGoals)
      .values(goal)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
