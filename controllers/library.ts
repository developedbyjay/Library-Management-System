import * as path from "path";
import * as fs from "fs";
import { Book } from "../models/Book";
import { BorrowRecord } from "../models/Borrow";
import { User } from "../models/User";
import { BookData, BorrowRecordData, UserData } from "../helpers/types";
import { generateId } from "../helpers";

export class Library {
  private books: Book[] = [];
  private users: User[] = [];
  private borrowHistory: BorrowRecord[] = [];
  private readonly dataFile: string;

  constructor(dataFile = path.join(process.cwd(), "data.json")) {
    this.dataFile = dataFile;
    this.load();
  }

  save(): void {
    const payload = {
      books: this.books.map((b) => b.toJSON()),
      users: this.users.map((u) => u.toJSON()),
      borrowHistory: this.borrowHistory.map((r) => r.toJSON()),
    };
    fs.writeFileSync(this.dataFile, JSON.stringify(payload, null, 2), "utf-8");
  }

  load(): void {
    if (!fs.existsSync(this.dataFile)) return;
    try {
      const raw = fs.readFileSync(this.dataFile, "utf-8");
      const parsed = JSON.parse(raw);
      this.books = (parsed.books || []).map((b: BookData) => new Book(b));
      this.users = (parsed.users || []).map((u: UserData) => new User(u));
      this.borrowHistory = (parsed.borrowHistory || []).map(
        (r: BorrowRecordData) => new BorrowRecord(r)
      );
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  addBook(
    data: Omit<BookData, "id" | "copiesAvailable" | "count"> & { id?: string }
  ): Book {
    const id = data.id || generateId("BOOK");
    const book = new Book({
      id,
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      publishedYear: data.publishedYear,
      totalCopies: data.totalCopies,
      copiesAvailable: data.totalCopies,
      count: 0,
    });

    this.books.push(book);
    this.save();
    return book;
  }

  removeBook(bookId: string): boolean {
    const idx = this.books.findIndex((b) => b.id === bookId);
    if (idx === -1) return false;
    this.books.splice(idx, 1);
    this.save();
    return true;
  }

  updateBook(bookId: string, updates: Partial<BookData>): boolean {
    const book = this.findBook(bookId);
    if (!book) return false;
    if (updates.title) book.title = updates.title;
    if (updates.author) book.author = updates.author;
    if (updates.isbn) book.isbn = updates.isbn;
    if (typeof updates.publishedYear === "number")
      book.publishedYear = updates.publishedYear;
    if (typeof updates.totalCopies === "number") {
      const diff = updates.totalCopies - book.totalCopies;
      book.totalCopies = updates.totalCopies;
      book.copiesAvailable = Math.max(0, book.copiesAvailable + diff);
    }
    this.save();
    return true;
  }

  addUser(userData: UserData) {
    const newUser = new User(userData);
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  findUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  findBook(bookId: string): Book | undefined {
    return this.books.find((b) => b.id === bookId);
  }

  borrowBook(userId: string, bookId: string) {
    const user = this.findUser(userId);

    if (!user) {
      return { message: "No user found with that ID" };
    }
    const book = this.findBook(bookId);
    if (!book) {
      return { message: "No book found with that ID" };
    }

    const isAvailable = book.borrowCopy();
    if (!isAvailable) {
      return {
        message: `${book.title} is not available for borrowing`,
      };
    }

    const data = {
      id: generateId("Borrow"),
      userId,
      bookId,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      returnDate: undefined,
    };

    const borrowed = new BorrowRecord(data);
    this.borrowHistory.push(borrowed);
    this.save();
    return {
      message: `${user.name} successfully borrowed a book ${book.title}`,
    } as {
      message: string;
    };
  }

  returnBook(userId: string, bookId: string): { message: string } {
    const user = this.findUser(userId);
    if (!user) {
      return { message: "No user found with that ID" };
    }
    const book = this.findBook(bookId);
    if (!book) {
      return { message: "No book found with that ID" };
    }
    const borrowedHistory = this.borrowHistory.find(
      (b) => b.userId === userId && b.bookId === bookId
    );
    if (!borrowedHistory) return { message: "You did not borrow this book" };

    const isDue = borrowedHistory.isOverdue();

    if (isDue)
      return {
        message: `The book you  borrowed on the ${borrowedHistory.borrowDate.toString()} is due already and you will have to pay a fine of #500  `,
      };

    borrowedHistory.setReturnDate();
    book.returnCopy();

    this.save();
    return { message: `${user.name} successfully returned a book` } as {
      message: string;
    };
  }

  mostBorrowedBook(): Book {
    const books = [...this.books].sort((a, b) => b.count - a.count);
    return books[0];
  }

  trackOverdue(): BorrowRecord[] {
    return this.borrowHistory.filter((b) => new Date() > new Date(b.dueDate));
  }

  listAllBooks() {
    return this.books;
  }

  listUsers() {
    return this.users;
  }

  listAvailableBooks() {
    return this.books.filter((book) => book.isAvailable());
  }
}
