import java.util.*;

class Book {
    int id;
    String title;
    String author;
    boolean available;

    Book(int id, String title, String author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.available = true;
    }
}

public class DigitalLibrary{
    static Scanner sc = new Scanner(System.in);
    static ArrayList<Book> books = new ArrayList<>();
    static int idCounter = 1;

    public static void main(String[] args) {
        System.out.println("\u001B[34mWelcome to Digital Library 📚\u001B[0m");
        while (true) {
            System.out.println("\nChoose role:");
            System.out.println("1. Admin");
            System.out.println("2. User");
            System.out.println("3. Exit");
            System.out.print("👉 Enter choice: ");
            int role = sc.nextInt(); sc.nextLine();

            switch (role) {
                case 1 -> adminMenu();
                case 2 -> userMenu();
                case 3 -> { System.out.println("Goodbye! 👋"); return; }
                default -> System.out.println("Invalid choice!");
            }
        }
    }

    static void adminMenu() {
        while (true) {
            System.out.println("\n--- Admin Menu ---");
            System.out.println("1. Add Book");
            System.out.println("2. View Books");
            System.out.println("3. Back");
            int ch = sc.nextInt(); sc.nextLine();
            switch (ch) {
                case 1 -> addBook();
                case 2 -> viewBooks();
                case 3 -> { return; }
            }
        }
    }

    static void userMenu() {
        while (true) {
            System.out.println("\n--- User Menu ---");
            System.out.println("1. Search Book");
            System.out.println("2. Borrow Book");
            System.out.println("3. Return Book");
            System.out.println("4. Back");
            int ch = sc.nextInt(); sc.nextLine();
            switch (ch) {
                case 1 -> searchBook();
                case 2 -> borrowBook();
                case 3 -> returnBook();
                case 4 -> { return; }
            }
        }
    }

    static void addBook() {
        System.out.print("📖 Title: ");
        String title = sc.nextLine();
        System.out.print("✍️ Author: ");
        String author = sc.nextLine();
        books.add(new Book(idCounter++, title, author));
        System.out.println("✅ Book added!");
    }

    static void viewBooks() {
        if (books.isEmpty()) {
            System.out.println("No books yet.");
            return;
        }
        for (Book b : books) {
            System.out.println(b.id + " | " + b.title + " | " + b.author + " | " + (b.available ? "🟢 Available" : "🔴 Borrowed"));
        }
    }

    static void searchBook() {
        System.out.print("🔍 Enter title keyword: ");
        String keyword = sc.nextLine().toLowerCase();
        for (Book b : books) {
            if (b.title.toLowerCase().contains(keyword)) {
                System.out.println("Found: " + b.title + " by " + b.author + " | " + (b.available ? "Available" : "Borrowed"));
                return;
            }
        }
        System.out.println("❌ No match found.");
    }

    static void borrowBook() {
        System.out.print("Enter Book ID to borrow: ");
        int id = sc.nextInt();
        for (Book b : books) {
            if (b.id == id && b.available) {
                b.available = false;
                System.out.println("✅ You borrowed: " + b.title);
                return;
            }
        }
        System.out.println("❌ Not available.");
    }

    static void returnBook() {
        System.out.print("Enter Book ID to return: ");
        int id = sc.nextInt();
        for (Book b : books) {
            if (b.id == id && !b.available) {
                b.available = true;
                System.out.println("✅ Returned successfully.");
                return;
            }
        }
        System.out.println("❌ Invalid ID.");
    }
}
