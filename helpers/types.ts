export enum Role {
  MEMBER = "member",
  LIBRARIAN = "librarian",
}

export type BookData = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  totalCopies: number;
  copiesAvailable: number;
};

export type BorrowRecordData = {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string; // iso
  dueDate: string; // iso
  returnDate?: string; // iso
};

export type UserData = {
  id?: number;
  name: string;
  email: string;
  role: Role;
};
