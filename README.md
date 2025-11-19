# 📚 VocabularyBuilder

> **A project for building and managing vocabulary, offering interactive tests (Quiz) and a mini-game (Tic-Tac-Toe) to reinforce learning of words.**
This project was developed as part of the "Building a Rich User Interface" Master's degree course.

## 📝 Table of Contents
* [Project Overview](#project-overview)
* [Technologies](#technologies)
* [How to Run Locally](#how-to-run-locally)
* [API Reference](#api-reference)
    * [Vocabulary Entries Management](#vocabulary-entries-management)
    * [Quizzes](#quizzes)
    * [Tic-Tac-Toe Game](#tic-tac-toe-game)
* [Environment variables](#environment-variables)
* [Secret properties](#secret-properties)
* [Database schema](#database-schema)
* [Application view](#application-view)

---

## 💡 Project Overview

**VocabularyBuilder** is a full-stack application. The **backend** is a **RESTful API** built with **Spring Boot** (Java), providing data management and game logic. The **frontend** is a Single Page Application (SPA) built with **Angular**, providing an interactive user interface for vocabulary management and testing.

---
## 🛠️ Technologies

The project utilizes a modern **full-stack** approach:

### Backend Technologies (Java/Spring)

* **Backend Framework:** **Spring Boot** (version 3.5.6)
* **Programming Language:** **Java 25**
* **Database:** **PostgreSQL**
* **ORM/Persistence:** **Spring Data JPA** (Hibernate)
* **Schema Migration:** **Liquibase**
* **Weryfikacja Danych:** `spring-boot-starter-validation`
* **Build Tool:** **Maven**

### Frontend Technologies (Angular)

The user interface (UI) is built using the following technologies:

* **Framework:** **Angular** (version 20.3.0)
* **Styling/UI Components:** **Angular Material** (version 20.2.9) and **Angular CDK**
* **Reactive Programming:** **RxJS**
* **Notifications:** **ngx-toastr**
* **Development Tools:** **Angular CLI**

---

## 🔗 API Reference

Below are the key endpoints provided by the application, derived from the Java Controllers.

### Vocabulary Entries Management

| Method | Endpoint (Path) | Description | Controller |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vocabulary` | Retrieves a **paged** list of entries. Supports filtering via `FilterVocabularyEntryForm`. | `VocabularyEntryController` |
| `GET` | `/api/vocabulary/{id}` | Retrieves details of an entry by its ID. | `VocabularyEntryController` |
| `POST` | `/api/vocabulary` | **Creates** a new entry. Requires a `CreateVocabularyEntryForm` object. | `VocabularyEntryController` |
| `PUT` | `/api/vocabulary/{id}` | **Updates** an existing entry. Requires an `UpdateVocabularyEntryForm` object. | `VocabularyEntryController` |
| `DELETE` | `/api/vocabulary/{id}` | **Deletes** the entry with the given ID. | `VocabularyEntryController` |
| `GET` | `/api/vocabulary/count` | Returns the total number of entries in the database. | `VocabularyEntryController` |

### Quizzes

| Method | Endpoint (Path) | Description | Controller |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quiz/generate` | Generates a new **Quiz** from random entries (`default=20`). | `VocabularyQuizController` |
| `POST` | `/api/quiz/submit` | Saves the results of the submitted Quiz (`QuizResultsDto`). | `VocabularyQuizController` |
| `GET` | `/api/quiz/history` | Retrieves a list of recent Quizzes (`default=10`). | `VocabularyQuizController` |
| `GET` | `/api/quiz/details/{quizUuid}` | Retrieves the detailed view of a Quiz by its UUID. | `VocabularyQuizController` |

### Tic-Tac-Toe Game

| Method | Endpoint (Path) | Description | Controller |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tictactoe/start` | Starts a new game session (returns session ID). | `TicTacToeController` |
| `POST` | `/api/tictactoe/move` | Processes a player's move in the active session (`MoveRequestDto`). | `TicTacToeController` |
| `GET` | `/api/tictactoe/history` | Retrieves the history of recent games. | `TicTacToeController` |
| `GET` | `/api/tictactoe/replay/{sessionUuid}` | Retrieves the details and sequence of moves for a specific game session. | `TicTacToeController` |

---

## 🚀 How to Run Locally

Follow these steps to set up and run the entire application (Backend, Frontend, and Database) using **Docker Compose**.

### 1. Prerequisites

* **JDK 25+** (for building the backend)
* **Node.js & npm** (for the frontend)
* **Docker** and **Docker Compose** installed on your system.

### 2. Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/R3venge1337/VocabularyBuilder.git](https://github.com/R3venge1337/VocabularyBuilder.git)
    cd VocabularyBuilder
    ```
2.  **Configure Environment:**
    * Ensure your `.env` file for Docker contains the `POSTGRES_USER` and `POSTGRES_PASSWORD` variables.
    * Ensure your Spring Boot configuration file (`.secret.properties` or similar) contains the correct database connection details (as listed in the [Secret Properties](#secret-properties) section).

### 3. Build and Run

1.  **Build the Backend (Java):**
    ```bash
    ./mvnw clean install
    ```
2.  **Start Services (Database & Backend):**
    *If you use Docker Compose to run the whole stack:*
    ```bash
    docker-compose up --build
    ```
3.  **Start the Frontend (Angular):**
    ```bash
    cd frontend # Change to the frontend directory
    npm install
    npm start
    ```

### Access Points

* **Backend API:** `http://localhost:8080`
* **Frontend UI:** `http://localhost:4200`

---

## 🧪 Testing Status

The project includes unit and integration tests written using **JUnit 5** and **Mockito**.

* **Tested Layers:** The tests primarily cover the **Service** and **Facade** layers to ensure core business logic correctness and testable design.
* **Running Tests:** Execute the following command in the root directory:
    ```bash
    ./mvnw test
    ```

---

## Environment variables

To run this project, you will need to add the following environment variables to your .env file used in docker.compose for postgreSQL image
`POSTGRES_USER`
`POSTGRES_PASSWORD`

## Secret properties
To run this project, you will need to add the following properties to your .secret.properties file
```properties
spring.datasource.url=jdbc:postgresql://postgres:5432/vocabularyBuilderDB
spring.liquibase.url=jdbc:postgresql://postgres:5432/vocabularyBuilderDB
spring.datasource.username=postgres
spring.datasource.password=postgres
game.session.cleanup.rate=6000
```

## Database schema
<img width="6096" height="3180" alt="Image" src="https://github.com/user-attachments/assets/595aec33-a411-4b15-b89e-92baa0ec38a8" />

## Application view
<img width="1919" height="918" alt="Image" src="https://github.com/user-attachments/assets/c41130cc-7e8b-4161-9d0c-604f5746a838" />

<img width="1919" height="915" alt="Image" src="https://github.com/user-attachments/assets/ef30e6f9-d595-423c-bd8a-0fc39448c59d" />

<img width="1919" height="922" alt="Image" src="https://github.com/user-attachments/assets/bf97859f-622c-4741-930b-e7c531cda2e7" />

<img width="1919" height="918" alt="Image" src="https://github.com/user-attachments/assets/5913da1b-72eb-4d83-9f58-af04a296a677" />

<img width="1919" height="919" alt="Image" src="https://github.com/user-attachments/assets/300ffe56-facc-4ef9-8a53-57342ebd3075" />

<img width="1919" height="919" alt="Image" src="https://github.com/user-attachments/assets/c25dcb3a-7d3f-4a3b-ad3e-dcba617a169a" />

<img width="1919" height="920" alt="Image" src="https://github.com/user-attachments/assets/5f25fef8-dff1-4932-9f8b-4c83d3f32ef9" />

<img width="1919" height="919" alt="Image" src="https://github.com/user-attachments/assets/4becabb7-183e-4659-8eb4-6bb0e3e87f59" />

<img width="1919" height="918" alt="Image" src="https://github.com/user-attachments/assets/282cdd30-0100-4eaf-9807-984ba6e31739" />

<img width="1919" height="917" alt="Image" src="https://github.com/user-attachments/assets/c871a917-1359-4d22-983b-2b35891fd346" />

<img width="1919" height="918" alt="Image" src="https://github.com/user-attachments/assets/e1254c7b-e817-4129-a1d1-3d84713ee606" />

<img width="1919" height="920" alt="Image" src="https://github.com/user-attachments/assets/853ddd7d-9d22-427f-8fe4-dfd64bb79967" />

<img width="1919" height="919" alt="Image" src="https://github.com/user-attachments/assets/073a7b7c-a39c-4ffd-a7e4-2cec8fc24330" />

<img width="1918" height="916" alt="Image" src="https://github.com/user-attachments/assets/191e4880-108e-419e-a632-0a6c81ca4887" />

<img width="1917" height="923" alt="Image" src="https://github.com/user-attachments/assets/e83af56b-4138-4d8e-a0ef-88a9d2ea134a" />

<img width="1919" height="921" alt="Image" src="https://github.com/user-attachments/assets/0f150f36-461b-44f6-9b9e-db0367870f8c" />

<img width="1919" height="921" alt="Image" src="https://github.com/user-attachments/assets/90fc7361-a143-4c59-b8fb-caaac64bd80f" />

<img width="1919" height="918" alt="Image" src="https://github.com/user-attachments/assets/446ebb9f-ab20-4cba-9893-5b93aebcd26d" />

<img width="1919" height="922" alt="Image" src="https://github.com/user-attachments/assets/b1e82016-7724-4141-b17d-f3b8c7e576fb" />

<img width="1919" height="920" alt="Image" src="https://github.com/user-attachments/assets/78cfcc3e-18b6-4358-b1c7-4825c8c1f702" />

<img width="1919" height="921" alt="Image" src="https://github.com/user-attachments/assets/62434f61-2c66-4aac-89c0-c47be904e4c6" />

<img width="1919" height="919" alt="Image" src="https://github.com/user-attachments/assets/5068e01d-8981-46f2-95dc-795dd81e5242" />

<img width="1919" height="916" alt="Image" src="https://github.com/user-attachments/assets/67258244-4584-4072-a5f3-58078fd7d4d1" />

<img width="1919" height="922" alt="Image" src="https://github.com/user-attachments/assets/72e27247-0182-44aa-8557-c963594c648b" />


