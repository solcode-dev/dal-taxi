import { users, transactions, type User, type InsertUser, type Transaction, type InsertTransaction } from "@shared/schema";
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
}

export const storage = new DatabaseStorage();
