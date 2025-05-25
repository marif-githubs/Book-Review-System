# Book Review System

A Node.js-based API for managing books and their reviews.

---

## 📂 Folder Structure

```
project-root/
├── routes/
│   └── routes.js               # API route definitions
├── service/
│   ├── bookService.js          # Book-related logic
│   └── reviewService.js        # Review-related logic
├── middleware/
│   └── tokenVerifyMiddleware.js # Middleware for token verification
├── models/
│   ├── book.js                 # Mongoose schema for books
│   └── review.js               # Mongoose schema for reviews
├── app.js                      # Main application entry point
├── package.json                # Project dependencies and scripts
└── .env                        # Environment variables
```

---

## ✨ Features

- **Books Management**: Add, retrieve, and search books.
- **Reviews Management**: Add, update, and delete reviews for books.
- **Authentication**: Token-based authentication using middleware.

---

## 🔑 Authentication

### How to Login and Get Access Token

1. Use the **Login API** to authenticate and retrieve an access token.
2. Include the token in the `Authorization` header for all subsequent API calls.
3. The token expires in **59 minutes**.

---

## 📋 API Endpoints

### Authentication APIs

#### Login API

- **Endpoint**: `POST /auth/login`
- **Request**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt-token"
  }
  ```

#### Signup API

- **Endpoint**: `POST /auth/signup`
- **Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "userId": "unique-user-id"
  }
  ```

---

### Book APIs

#### 1. Add a Book

- **Endpoint**: `POST /api/v1/books`
- **Request**:
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "description": "Book description",
    "links": ["https://example.com/atomichabits"]
  }
  ```

#### 2. Get All Books

- **Endpoint**: `GET /api/v1/books?page=1&limit=10&author={author}`

#### 3. Get a Specific Book by ID

- **Endpoint**: `GET /api/v1/books/{bookId}`

#### 4. Search Books

- **Endpoint**: `GET /api/v1/search?key=searchTerm`

---

### Review APIs

#### 1. Add a Review

- **Endpoint**: `POST /api/v1/books/{bookId}/reviews`
- **Request**:
  ```json
  {
    "comment": "Great book!",
    "rating": 5
  }
  ```

#### 2. Update a Review

- **Endpoint**: `PUT /api/v1/reviews/{reviewId}`
- **Request**:
  ```json
  {
    "comment": "Updated review comment.",
    "rating": 4
  }
  ```

#### 3. Delete a Review

- **Endpoint**: `DELETE /api/v1/reviews/{reviewId}`

---

## 📦 Database Schema

### Book Schema

| Field       | Type            | Required | Description                                                 |
| ----------- | --------------- | -------- | ----------------------------------------------------------- |
| userId      | String          | ✅       | The ID of the user who created or owns the book             |
| title       | String (unique) | ✅       | Title of the book (must be unique)                          |
| author      | String          | ✅       | Author of the book                                          |
| description | String          | ❌       | A short description or summary of the book                  |
| links       | Array of String | ❌       | List of related external URLs (must be valid URLs)          |
| createdAt   | Date (auto)     | -        | Auto-generated timestamp for when the book was created      |
| updatedAt   | Date (auto)     | -        | Auto-generated timestamp for when the book was last updated |

---

### Review Schema

| Field     | Type                   | Required | Description                                               |
| --------- | ---------------------- | -------- | --------------------------------------------------------- |
| bookId    | ObjectId (ref: Book)   | ✅       | Reference to the book being reviewed                      |
| userId    | String                 | ✅       | ID of the user who wrote the review                       |
| comment   | String                 | ✅       | The textual comment provided by the user                  |
| rating    | Number(min: 1, max: 5) | ✅       | Numeric rating (1 to 5) given by the user                 |
| createdAt | Date (auto)            | -        | Auto-generated timestamp when the review was created      |
| updatedAt | Date (auto)            | -        | Auto-generated timestamp when the review was last updated |

---

## 🎨 ER Diagram

```
+------------------+         +------------------+
|      Book        | 1    N  |      Review      |
+------------------+ <------ +------------------+
| _id (Mongo ID)   |         | _id (Mongo ID)   |
| userId           |         | bookId (FK)      |
| title            |         | userId           |
| author           |         | comment          |
| description      |         | rating (1-5)     |
| links            |         | createdAt        |
| createdAt        |         | updatedAt        |
| updatedAt        |         +------------------+
+------------------+
```

---

## 🛠 Design Decisions and Assumptions

- **Authentication**: Token-based authentication is implemented using middleware.
- **Database**: MongoDB is used for storing books and reviews.
- **Error Handling**: Basic error handling is implemented for invalid requests.
- **Scalability**: The project is modular, making it easy to extend features.

---

## 📝 Notes

- Include the JSON Web Token in the `Authorization` header for all requests.
- Replace `{bookId}` and `{reviewId}` with actual IDs when testing.
- Ensure your server is running on `http://localhost:8080` or update the base URL if necessary.
- Use the provided cURL examples or import the API into Postman for testing.
