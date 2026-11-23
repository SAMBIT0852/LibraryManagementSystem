# Digital Library Management System

A full-stack library management application for adding, searching, borrowing, and returning books. The frontend provides a responsive React interface, while the backend exposes a REST API backed by an H2 database.

## Features

- Add books with a title and author
- Search books by title or author
- Filter by availability, borrowed status, or favorites
- Sort books by title, author, or status
- Borrow and return books
- View available, borrowed, and favorite book counts
- Toggle favorites and switch between light and dark themes
- Persistent H2 database storage

## Tech Stack

### Frontend

- React 18
- Axios
- Create React App
- CSS

### Backend

- Java 17+
- Spring Boot 3.1
- Spring Web
- Spring Data JPA
- H2 Database
- Maven
- Lombok

## Project Structure

```text
LibraryManagementSystem/
├── backend/
│   ├── src/main/java/com/library/
│   │   ├── DigitalLibraryApplication.java
│   │   ├── controller/BookController.java
│   │   ├── model/Book.java
│   │   ├── repository/BookRepository.java
│   │   └── service/BookService.java
│   └── src/main/resources/application.properties
├── frontend/
│   ├── public/
│   └── src/
├── DigitalLibrary.java
└── README.md
```

`DigitalLibrary.java` is the original standalone console implementation. The React and Spring Boot application is the primary full-stack implementation.

## Prerequisites

- Java 17 or newer
- Maven
- Node.js and npm

## Getting Started

### 1. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The frontend starts on `http://localhost:3000`.

## Running the Standalone Console Application

The project also includes a standalone Java console version:

```bash
javac DigitalLibrary.java
java DigitalLibrary
```

## REST API

The frontend communicates with the following endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/books` | Get all books |
| `POST` | `/api/books` | Add a book |
| `PUT` | `/api/books/{id}/borrow` | Borrow a book |
| `PUT` | `/api/books/{id}/return` | Return a book |

All endpoints are available from `http://localhost:8080`.

Example request for adding a book:

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin"
}
```

## Database

The backend uses a file-based H2 database configured in `backend/src/main/resources/application.properties`.

- Database files: `backend/data/digital_library.mv.db`
- H2 console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/digital_library`
- Username: `sa`
- Password: empty

Because the JDBC path is relative, start the backend from the `backend` directory.

## Development Scripts

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm start       # Start the development server
npm test        # Run the test suite
npm run build   # Create a production build
```
