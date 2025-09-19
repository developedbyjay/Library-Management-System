export class Book {
  private static IDcounter = 1;

  private id: number;
  private isAvailable: boolean;
  private borrowedBy: string | undefined;
  private dueDate: Date | undefined;

  constructor(title: string, author: string) {
    this.id = Book.IDcounter++;
    this.isAvailable = true;
    this.borrowedBy = undefined;
    this.dueDate = undefined;
  }

  private markBorrowedBook() {}

  private markReturned() {}
}
