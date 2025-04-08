package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/Yansb/go-gateway-api/internal/repository"
	"github.com/Yansb/go-gateway-api/internal/service"
	"github.com/Yansb/go-gateway-api/internal/web/server"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST", "db"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "postgres"),
		getEnv("DB_SSL_MODE", "disable"),
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}
	defer db.Close()

	accountRepository := repository.NewAccountRepository(db)
	accountService := service.NewAccountService(accountRepository)

	port := getEnv("HTTP_PORT", "8080")
	srv := server.NewServer(accountService, port)

	if err := srv.Start(); err != nil {
		log.Fatal("Error starting the server:", err)
	}
	fmt.Println("Server started on port", port)
}
