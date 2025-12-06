import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/transactions", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const transactions = await storage.getTransactions(start, end);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransactionById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const parsed = insertTransactionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      
      const transaction = await storage.createTransaction(parsed.data);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTransaction(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  app.get("/api/revenue/summary", async (req, res) => {
    try {
      const { period } = req.query;
      const now = new Date();
      let startDate: Date;
      let previousStartDate: Date;
      let previousEndDate: Date;

      switch (period) {
        case "daily":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          previousEndDate = new Date(startDate.getTime() - 1);
          previousStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          break;
        case "weekly":
          const dayOfWeek = now.getDay();
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday);
          previousEndDate = new Date(startDate.getTime() - 1);
          previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          previousEndDate = new Date(startDate.getTime() - 1);
          previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;
      }

      const currentTransactions = await storage.getTransactions(startDate, now);
      const previousTransactions = await storage.getTransactions(previousStartDate, previousEndDate);

      const calculateRevenue = (txns: typeof currentTransactions) => {
        return txns.reduce((acc, tx) => {
          if (tx.type === "income") {
            return acc + tx.amount;
          } else {
            return acc - tx.amount;
          }
        }, 0);
      };

      const currentRevenue = calculateRevenue(currentTransactions);
      const previousRevenue = calculateRevenue(previousTransactions);
      const netChange = currentRevenue - previousRevenue;

      res.json({
        revenue: currentRevenue,
        netChange,
        period: period || "monthly",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate revenue summary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
