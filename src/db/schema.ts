import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  country: text("country").default("South Africa"),
  grade: integer("grade").default(10),
  curriculum: text("curriculum").default("CAPS"),
  subjects: jsonb("subjects").$type<string[]>().default([]),
  plan: text("plan").default("free"),
  dailyGoal: integer("daily_goal").default(30),
  streak: integer("streak").default(0),
  lastStudyDate: text("last_study_date"),
  aiUsedToday: integer("ai_used_today").default(0),
  aiUsedDate: text("ai_used_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject").default("General"),
  topic: text("topic").default(""),
  content: text("content").notNull(),
  summary: text("summary"),
  keyConcepts: jsonb("key_concepts").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  noteId: integer("note_id"),
  front: text("front").notNull(),
  back: text("back").notNull(),
  subject: text("subject").default("General"),
  known: boolean("known").default(false),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject").default("General"),
  topic: text("topic").default(""),
  difficulty: text("difficulty").default("medium"),
  questions: jsonb("questions").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quizId: integer("quiz_id").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  answers: jsonb("answers").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  subject: text("subject"),
  level: text("level"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject").default("General"),
  examDate: text("exam_date").notNull(),
  type: text("type").default("Exam"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const checklistItems = pgTable("checklist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  examId: integer("exam_id"),
  label: text("label").notNull(),
  subject: text("subject").default("General"),
  done: boolean("done").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  label: text("label").notNull(),
  type: text("type").default("study"),
  createdAt: timestamp("created_at").defaultNow(),
});
