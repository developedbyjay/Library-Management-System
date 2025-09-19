import { BorrowRecordData } from "../helpers/types";

export class BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;

  constructor(data: BorrowRecordData) {
    this.id = data.id;
    this.userId = data.userId;
    this.bookId = data.bookId;
    this.borrowDate = new Date(data.borrowDate);
    this.dueDate = new Date(data.dueDate);
    this.returnDate = data.returnDate ? new Date(data.returnDate) : undefined;
  }

  isOverdue(now = new Date()): boolean {
    return !this.returnDate && this.dueDate.getTime() < now.getTime();
  }

  toJSON(): BorrowRecordData {
    return {
      id: this.id,
      userId: this.userId,
      bookId: this.bookId,
      borrowDate: this.borrowDate.toISOString(),
      dueDate: this.dueDate.toISOString(),
      returnDate: this.returnDate ? this.returnDate.toISOString() : undefined,
    };
  }
}
