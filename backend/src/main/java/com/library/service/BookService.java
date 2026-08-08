package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository repository;

    public List<Book> getAllBooks() {
        return repository.findAll();
    }

    public Book addBook(Book book) {
        book.setAvailable(true);
        return repository.save(book);
    }

    public Book borrowBook(Long id) {
        Book book = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available");
        }
        book.setAvailable(false);
        return repository.save(book);
    }

    public Book returnBook(Long id) {
        Book book = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setAvailable(true);
        return repository.save(book);
    }
}
