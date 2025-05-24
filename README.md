# Book-Review-System

# Book Review API

A Node.js-based API for managing books and their reviews.

---

## Folder Structure

project-root/ ├── routes/
│ └── routes.js # API route definitions
├── service/
│ ├── bookService.js # Book-related logic
│ └── reviewService.js # Review-related logic
├── middleware/
│ └── tokenVerifyMiddleware.js # Middleware for token verification
├── models/ │ └── book.js # Mongoose schema for books
│ └── review.js # Mongoose schema for reviews
├── app.js # Main application entry point
├── package.json # Project dependencies and scripts
└── .env # Environment variables

---

## Features

- **Books Management**: Add, retrieve, and search books.
- **Reviews Management**: Add, update, and delete reviews for books.
- **Authentication**: Middleware for token verification.

---

### Login API

Endpoint: POST /auth/login

curl: curl -X POST http://localhost:8080/auth/login \
-H "Content-Type: application/json" \
-d '{
"email": "john.doe@example.com",
"password": "securepassword"
}'

Request Object:{
"email": "john.doe@example.com",
"password": "securepassword"
}

Response Object:{
"message": "Login successful",
"token": "jwt-token"
}

### Signup API

Endpoint: POST /auth/signup

curl: curl -X POST http://localhost:8080/auth/signup \
-H "Content-Type: application/json" \
-d '{
"name": "John Doe",
"email": "john.doe@example.com",
"password": "securepassword"
}'

Request Object:{
"name": "John Doe",
"email": "john.doe@example.com",
"password": "securepassword"
}

Response Object:{
"message": "User registered successfully",
"userId": "unique-user-id"
}

## API Endpoints (cURL Examples)

### 1. Add a Book

curl -X POST http://localhost:8080/api/v1/books \
-H "Content-Type: application/json" \
-d '{
"title": "Book Title",
"author": "Author Name",
"description": "Book description"
}'

### 2. Get All Books

curl -X GET http://localhost:8080/api/v1/books

### 3. Get a specific book by ID

curl -X GET http://localhost:8080/api/v1/books/{bookId}

### 4. Add a Review to a Book

curl -X POST http://localhost:8080/api/v1/books/{bookId}/reviews \
-H "Content-Type: application/json" \
-d '{
"reviewer": "John Doe",
"rating": 5,
"comment": "Great book!"
}'

### 5. Update a review

curl -X PUT http://localhost:8080/api/v1/reviews/{reviewId} \
-H "Content-Type: application/json" \
-d '{
"rating": 4,
"comment": "Updated review comment."
}'

### 6. Delete a review

curl -X DELETE http://localhost:8080/api/v1/reviews/{reviewId}

### 7. Search book using author or title

curl -X GET "http://localhost:8080/api/v1/books/search?query=searchTerm"

Notes:
Include json web token in each request.
Replace {bookId} and {reviewId} with actual IDs when testing.
Ensure your server is running on http://localhost:8080 or update the base URL if necessary.

Example API Requests
Use the cURL examples above or import the API into Postman using the provided endpoints.

Design Decisions and Assumptions
Authentication: Token-based authentication is implemented using middleware.
Database: MongoDB is used for storing books and reviews.
Error Handling: Basic error handling is implemented for invalid requests.
Scalability: The project is modular, making it easy to extend features.
