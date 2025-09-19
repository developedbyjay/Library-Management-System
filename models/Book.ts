import { BookData } from "../helpers/types";

export class Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  totalCopies: number;
  copiesAvailable: number;

  constructor(data: BookData) {
    this.id = data.id;
    this.title = data.title;
    this.author = data.author;
    this.isbn = data.isbn;
    this.publishedYear = data.publishedYear;
    this.totalCopies = data.totalCopies;
    this.copiesAvailable = data.copiesAvailable;
  }

  isAvailable(): boolean {
    return this.copiesAvailable > 0;
  }

  borrowCopy(): boolean {
    if (this.copiesAvailable <= 0) return false;
    this.copiesAvailable -= 1;
    return true;
  }

  returnCopy(): void {
    if (this.copiesAvailable < this.totalCopies) this.copiesAvailable += 1;
  }

  toJSON(): BookData {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      publishedYear: this.publishedYear,
      totalCopies: this.totalCopies,
      copiesAvailable: this.copiesAvailable,
    };
  }
}
