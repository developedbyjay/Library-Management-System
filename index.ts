import * as readline from "readline";
import { Library } from "./controllers/library";
import { Book } from "./models/Book";
import { User } from "./models/User";
import { Role } from "./helpers/types";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const library = new Library();

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function mainMenu(): Promise<void> {
  console.log("\n📚 Library Management System");
  console.log("1. List all books");
  console.log("2. List available books");
  console.log("3. Add book (librarian)");
  console.log("4. Remove book (librarian)");
  console.log("5. Register user");
  console.log("6. List users");
  console.log("7. Borrow book (member)");
  console.log("8. Return book (member)");
  console.log("9. Overdue report");
  console.log("10. Most borrowed books");
  console.log("11. Exit");

  const choice = await ask("Choose an option: ");
  switch (choice.trim()) {
    case "1":
      //   printBooks(library.listAllBooks());
      break;
    case "2":
      //   printBooks(library.listAvailableBooks());
      break;
    case "3":
      await handleAddBook();
      break;
    case "4":
      await handleRemoveBook();
      break;
    case "5":
      await handleRegisterUser();
      break;
    case "6":
      //   printUsers(library.listUsers());
      break;
    case "7":
      await handleBorrow();
      break;
    case "8":
      await handleReturn();
      break;
    case "9":
      // printOverdue();
      break;
    case "10":
      printMostBorrowed();
      break;
    case "11":
      console.log("Goodbye 👋");
      rl.close();
      return;
    default:
      console.log("Invalid choice");
  }

  mainMenu();
}

function printBooks(books: Book[]) {
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

function printUsers(users: User[]) {
  if (users.length === 0) {
    console.log("No users.");
    return;
  }
  for (const u of users) {
    console.log(`- ${u.id}: ${u.name} <${u.email}> [${u.role}]`);
  }
}

async function handleAddBook() {
  const userId = await ask("Enter your user id (must be librarian): ");
  const user = library.findUser(+userId);
  if (!user || user.role !== Role.LIBRARIAN) {
    console.log("Unauthorized: only librarians can add books.");
    return;
  }
  const title = await ask("Title: ");
  const author = await ask("Author: ");
  const isbn = await ask("ISBN: ");
  const yearStr = await ask("Published year: ");
  const copiesStr = await ask("Number of copies: ");
  const year = Number(yearStr) || new Date().getFullYear();
  const copies = Number(copiesStr) || 1;
  const book = library.addBook({
    title: title.trim(),
    author: author.trim(),
    isbn: isbn.trim(),
    publishedYear: year,
    totalCopies: copies,
  });
  console.log(`Book added: ${book.id} - ${book.title}`);
}

async function handleRemoveBook() {
  const userId = await ask("Enter your user id (must be librarian): ");
  const user = library.findUser(+userId);
  if (!user || user.role !== Role.LIBRARIAN) {
    console.log("Unauthorized: only librarians can remove books.");
    return;
  }
  const bookId = await ask("Book id to remove: ");
  const ok = library.removeBook(bookId.trim());
  console.log(ok ? "Book removed." : "Book not found.");
}

async function handleRegisterUser() {
  const name = await ask("Name: ");
  const email = await ask("Email: ");
  const roleStr = await ask("Role (member/librarian): ");
  const role =
    roleStr.trim().toLowerCase() === "librarian" ? Role.LIBRARIAN : Role.MEMBER;
  const user = library.addUser({
    name: name.trim(),
    email: email.trim(),
    role,
  });
  console.log(`User created: ${user.id} - ${user.name} [${user.role}]`);
}

async function handleBorrow() {
  const userId = await ask("Your user id: ");
  const bookId = await ask("Book id to borrow: ");
  const res = library.borrowBook(+userId, bookId);
  if (!res) return;
  console.log(res.message);
}

async function handleReturn() {
  const userId = await ask("Your user id: ");
  const bookId = await ask("Book id to return: ");
  const res = library.returnBook(+userId, bookId.trim());
  console.log(res.message);
}

// function printOverdue() {
//   const overdue = library.trackOverdue();
//   if (overdue.length === 0) {
//     console.log("No overdue books.");
//     return;
//   }
//   for (const r of overdue) {
//     const book = library.findBook(r.bookId);
//     const user = library.findUser(r.userId);
//     console.log(
//       `- ${r.id}: ${book ? book.title : r.bookId} borrowed by ${
//         user ? user.name : r.userId
//       } due ${r.dueDate.toDateString()}`
//     );
//   }
// }

function printMostBorrowed() {
  const arr = library.mostBorrowedBooks(10);
  if (arr.length === 0) console.log("No borrow records.");
  for (const it of arr) {
    console.log(
      `- ${it.book.id}: ${it.book.title} (borrowed ${it.count} times)`
    );
  }
}

// Seed some data if empty
(function seedIfEmpty() {
  if (library.listAllBooks().length === 0 && library.listUsers().length === 0) {
    const lib1 = library.addUser({
      name: "John Librarian",
      email: "john.librarian@example.com",
      role: Role.LIBRARIAN,
    });
    const lib2 = library.addUser({
      name: "Mary Librarian",
      email: "mary.librarian@example.com",
      role: Role.LIBRARIAN,
    });
    const u1 = library.addUser({
      name: "Alice Member",
      email: "alice@example.com",
      role: Role.MEMBER,
    });
    const u2 = library.addUser({
      name: "Bob Member",
      email: "bob@example.com",
      role: Role.MEMBER,
    });

    library.addBook({
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      publishedYear: 2008,
      totalCopies: 3,
    });
    library.addBook({
      title: "Design Patterns",
      author: "GoF",
      isbn: "9780201633610",
      publishedYear: 1994,
      totalCopies: 2,
    });
    library.addBook({
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      isbn: "9780201616224",
      publishedYear: 1999,
      totalCopies: 1,
    });
    library.save();
    console.log("Seeded sample data. Librarian IDs:", lib1.id, lib2.id);
  }
})();

// Start CLI
mainMenu();
