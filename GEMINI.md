# Gemini - spring-rest-react

This document provides a summary of the `spring-rest-react` project, its structure, and how to build and run it.

## Project Overview

This is a full-stack application with a Spring Boot backend and a React frontend.

**Backend:**

*   **Framework:** Spring Boot
*   **Language:** Java 21
*   **Build Tool:** Maven
*   **Dependencies:**
    *   `spring-boot-starter-web`: For creating web applications and RESTful APIs.
    *   `spring-boot-starter-data-jpa`: For data persistence.
    *   `h2`: An in-memory database.
    *   `springdoc-openapi-starter-webmvc-ui`: For generating API documentation.

**Frontend:**

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Dependencies:**
    *   `@radix-ui/react-slot`
    *   `class-variance-authority`
    *   `clsx`
    *   `lucide-react`
    *   `tailwind-merge`
    *   `tailwindcss-animate`

## Building and Running

### Backend

To run the backend, execute the following command:

```bash
./mvnw spring-boot:run
```

The backend will be available at `http://localhost:8080`.

### Frontend

To run the frontend in development mode, navigate to the `web` directory and run:

```bash
pnpm dev
```

The frontend will be available at `http://localhost:5173`.

### Production Build

To create a production build, run the following command from the root directory:

```bash
./mvnw package
```

This command will:

1.  Build the frontend and place the static files in `src/main/resources/static`.
2.  Build the backend into a JAR file in the `target` directory.

To run the production build, execute the following command:

```bash
java -jar target/spring-rest-react-0.0.1-SNAPSHOT.jar
```

The application will be available at `http://localhost:8080`.

## API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Development Conventions

*   The backend and frontend are in separate directories: `src` and `web`, respectively.
*   The frontend is built by the Maven build process using the `frontend-maven-plugin`.
*   The frontend build output is placed in `src/main/resources/static` to be served by the Spring Boot application.
*   Vite is used for frontend development and proxies API calls to the Spring Boot backend.
*   Tailwind CSS is used for styling the frontend.
