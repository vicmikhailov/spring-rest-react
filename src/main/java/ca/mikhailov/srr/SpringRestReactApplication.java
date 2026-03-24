package ca.mikhailov.srr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * [ENTRY POINT] SpringRestReactApplication
 * <p>
 * This is the main class for the Spring Boot backend.
 * <p>
 * Python Analogy:
 * - Think of this as the "app.py" or "main.py" file in a FastAPI/Flask project.
 * - `@SpringBootApplication` is like the `app = FastAPI()` initialization.
 * <p>
 * TypeScript Analogy:
 * - This is like the "main.ts" or "index.ts" in a NestJS or Express app.
 * - It's where the server is bootstraped and starts listening for requests.
 */
@SpringBootApplication
public class SpringRestReactApplication {

    /**
     * [MAIN METHOD]
     * <p>
     * This is the standard entry point for every Java application.
     * <p>
     * Python Analogy:
     * - This is the `if __name__ == "__main__":` block.
     * - `SpringApplication.run` is like `uvicorn.run("main:app", ...)`.
     * <p>
     * TypeScript Analogy:
     * - This is equivalent to `app.listen(port, ...)` or NestJS's `await app.listen(3000)`.
     */
    public static void main(String[] args) {
        SpringApplication.run(SpringRestReactApplication.class, args);
    }

}
