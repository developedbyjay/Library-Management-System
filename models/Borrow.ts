import { BorrowRecordData } from "../helpers/types";

export class BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  returnDate: Date | undefined;

  private dueDate: Date = new Date();

  constructor(data: BorrowRecordData) {
    this.id = data.id;
    this.userId = data.userId;
    this.bookId = data.bookId;
    this.borrowDate = new Date(data.borrowDate);
    this.returnDate = data.returnDate ? new Date(data.returnDate) : undefined;
  }

  setReturnDate(): void {
    this.returnDate = new Date();
  }
  
  isOverdue(): boolean {
    let currentDate = new Date();
    return currentDate > this.dueDate;
  }

  toJSON(): BorrowRecordData {
    return {
      id: this.id,
      userId: this.userId,
      bookId: this.bookId,
      borrowDate: this.borrowDate,
      dueDate: this.dueDate,
      returnDate: this.returnDate ? this.returnDate : undefined,
    };
  }
}
