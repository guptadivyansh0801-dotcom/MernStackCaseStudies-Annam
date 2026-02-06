import express, { Request, Response } from "express";

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// B. Model: Define the Book Structure
// ------------------------------------------------------------
// src/models/Book.ts
export interface Book {
    id: string;
    title: string;
    author: string;
    isBorrowed: boolean;
}

// ------------------------------------------------------------
// C. Repository: Separate Storage Logic
// ------------------------------------------------------------
// src/repositories/interfaces/IBookRepository.ts
export interface IBookRepository {
    findAll(): Promise<Book[]>;
    findById(id: string): Promise<Book | null>;
    save(book: Book): Promise<void>;
}

// src/repositories/InMemoryBookRepository.ts
export class InMemoryBookRepository implements IBookRepository {
    protected books: Book[] = [];

    async findAll(): Promise<Book[]> {
        return this.books;
    }

    async findById(id: string): Promise<Book | null> {
        return this.books.find(book => book.id === id) || null;
    }

    async save(book: Book): Promise<void> {
        const idx = this.books.findIndex(b => b.id === book.id);
        if (idx >= 0) {
            this.books[idx] = book;
        } else {
            this.books.push(book);
        }
    }
}

// ------------------------------------------------------------
// D. Service: Enforce Business Rules
// ------------------------------------------------------------
// src/services/BookService.ts
export class BookService {
    constructor(private bookRepository: IBookRepository) { }

    async borrowBook(bookId: string): Promise<Book> {
        const book = await this.bookRepository.findById(bookId);
        if (!book) throw new Error("Book not found");
        if (book.isBorrowed) throw new Error("Book already borrowed");

        const updatedBook = { ...book, isBorrowed: true };
        await this.bookRepository.save(updatedBook);
        return updatedBook;
    }

    async returnBook(bookId: string): Promise<Book> {
        const book = await this.bookRepository.findById(bookId);
        if (!book) throw new Error("Book not found");
        if (!book.isBorrowed) throw new Error("Book is not borrowed");

        const updatedBook = { ...book, isBorrowed: false };
        await this.bookRepository.save(updatedBook);
        return updatedBook;
    }

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }
}

// ------------------------------------------------------------
// E. Controller: Handle User Requests
// ------------------------------------------------------------
// src/controllers/BookController.ts
export class BookController {
    constructor(private bookService: BookService) { }

    async borrowBook(req: Request, res: Response): Promise<void> {
        try {
            const book = await this.bookService.borrowBook(req.params.id as string);
            res.json(book);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async returnBook(req: Request, res: Response): Promise<void> {
        try {
            const book = await this.bookService.returnBook(req.params.id as string);
            res.json(book);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllBooks(req: Request, res: Response): Promise<void> {
        const books = await this.bookService.getAllBooks();
        res.json(books);
    }
}

// ------------------------------------------------------------
// F. Dependency Injection Setup
// ------------------------------------------------------------
// src/app.ts
const app = express();
app.use(express.json());

// Initialize components
const bookRepository = new InMemoryBookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

// Add some sample books
bookRepository.save({ id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isBorrowed: false });
bookRepository.save({ id: "2", title: "1984", author: "George Orwell", isBorrowed: false });
bookRepository.save({ id: "3", title: "To Kill a Mockingbird", author: "Harper Lee", isBorrowed: true });

// Routes
app.get("/books", (req, res) => bookController.getAllBooks(req, res));
app.post("/books/:id/borrow", (req, res) => bookController.borrowBook(req, res));
app.post("/books/:id/return", (req, res) => bookController.returnBook(req, res));

const port = 3003;
app.listen(port, () => {
    console.log(`Library system running on port ${port}`);
});


// ============================================================
// SECTION 6: CHALLENGE
// ============================================================

// Challenge: Add a returnBook method to BookService and BookController
// (Already implemented above in sections D and E)

// Additional Challenge: Add delete functionality
export class ExtendedBookRepository extends InMemoryBookRepository {


    async delete(id: string): Promise<boolean> {
        const idx = this.books.findIndex(b => b.id === id);
        if (idx >= 0) {
            this.books.splice(idx, 1);
            return true;
        }
        return false;
    }
}

export class ExtendedBookService extends BookService {
    constructor(private extendedRepo: ExtendedBookRepository) {
        super(extendedRepo);
    }

    async deleteBook(bookId: string): Promise<void> {
        const deleted = await this.extendedRepo.delete(bookId);
        if (!deleted) throw new Error("Book not found");
    }
}
