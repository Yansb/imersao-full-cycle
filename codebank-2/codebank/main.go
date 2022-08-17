package main

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/kafka"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/repository"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/server"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/usecase"
	"log"
	"os"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	db := setupDb()
	defer db.Close()
	producer := setupKafkaProducer()
	processTransactionUseCase := setupTransactionUseCase(db, producer)
	serverGrpc(processTransactionUseCase)
}

func setupTransactionUseCase(db *sql.DB, producer kafka.KafkaProducer) usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepositoryDb(db)
	transactionUseCase := usecase.NewUseCaseTransaction(transactionRepository, producer)
	return transactionUseCase
}

func setupDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("host"),
		os.Getenv("port"),
		os.Getenv("user"),
		os.Getenv("password"),
		os.Getenv("dbname"))
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalln("Error connecting to database:", err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	return db
}

func setupKafkaProducer() kafka.KafkaProducer {
	producer := kafka.NewKafkaProducer()
	producer.SetupProducer(os.Getenv("KafkaBootstrapServers"))
	return producer
}

func serverGrpc(processTransactionUseCase usecase.UseCaseTransaction) {
	grpcServer := server.NewGRPCServer()
	grpcServer.ProcessTransactionUseCase = processTransactionUseCase
	fmt.Println("Starting GRPC server...")
	grpcServer.Serve()
}
