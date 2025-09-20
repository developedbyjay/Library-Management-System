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
  borrowDate: Date; 
  dueDate: Date; 
  returnDate: Date | undefined; 
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
