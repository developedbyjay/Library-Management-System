import * as readline from "readline";

import { Book } from "../models/Book";
import { User } from "../models/User";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export function generateId(prefix = "ID"): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function parseDateOrUndefined(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}

export function printBooks(books: Book[]) {
  if (books.length === 0) {
    console.log("No books found.");
    return;
  }
  for (const b of books) {
    console.log(
      `- ${b.id}: ${b.title} by ${b.author} (${b.publishedYear}) [${b.copiesAvailable}/${b.totalCopies}] ISBN:${b.isbn}`
    );
  }
}

export function printUsers(users: User[]) {
  if (users.length === 0) {
    console.log("No users.");
    return;
  }
  for (const u of users) {
    console.log(`- ${u.id}: ${u.name} <${u.email}> [${u.role}]`);
  }
}
