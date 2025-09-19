import { Book } from "./Book";

export enum ROLE {
  MEMBER = "member",
  LIBRARIAN = "librarian",
}

export class User {
  private static IDcounter = 1;
  public readonly id: number;

  private borrowedBooks: Book[];

  constructor(public name: string, public email: string, public role: ROLE) {
    this.id = User.IDcounter++;
    this.borrowedBooks = [];
  }

  static SetNextID(id: number) {
    User.IDcounter = id;
  }
  private borrowBook() {}
  private returnBook() {}
  private listBorrowedBooks() {}
}
