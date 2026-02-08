# Spring Rest React Dashboard

A modern full-stack dashboard application built with Spring Boot (Java) and React (Vite/TypeScript), featuring a responsive UI powered by shadcn/ui.

## Project Structure

- `src/`: Backend source code (Spring Boot).
- `web/`: Frontend source code (React, Vite, Tailwind CSS, shadcn/ui).
- `pom.xml`: Maven configuration for building both backend and frontend.

## Prerequisites

- **Java 21**
- **Node.js** (v20+ recommended)
- **pnpm** (preferred for frontend)

## Getting Started

### 1. Development Mode

For the best development experience, run the backend and frontend separately.

#### Backend
From the root directory, run:
```bash
./mvnw spring-boot:run
```
The backend will be available at [http://localhost:8080](http://localhost:8080).

#### Frontend
Navigate to the `web` directory and run:
```bash
cd web
pnpm install
pnpm dev
```
The frontend will be available at [http://localhost:5173](http://localhost:5173). 
Vite is configured to proxy `/api` calls to the Spring Boot backend at `localhost:8080`.

### 2. Production Build

To create a unified production build (JAR file containing the frontend):

From the root directory, run:
```bash
./mvnw clean package
```

This command will:
1.  Install Node.js and pnpm (via `frontend-maven-plugin`).
2.  Install frontend dependencies and build the React application.
3.  Copy the frontend build output to `src/main/resources/static`.
4.  Build the Spring Boot JAR file.

#### Running the Production Build
After building, you can run the application using:
```bash
java -jar target/spring-rest-react-0.0.1-SNAPSHOT.jar
```
The unified application will be available at [http://localhost:8080](http://localhost:8080).

## API Documentation

When the backend is running, you can access the Swagger UI for API documentation at:
[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Technologies Used

- **Backend:** Spring Boot, Spring Data JPA, H2 (In-memory database), SpringDoc OpenAPI.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts, Lucide React.
