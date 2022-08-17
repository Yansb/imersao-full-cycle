package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/kafka"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/repository"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/server"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/usecase"
	"log"
)

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
		"db",
		"5432",
		"postgres",
		"root",
		"codebank")
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
	producer.SetupProducer("host.docker.internal:9094")
	return producer
}

func serverGrpc(processTransactionUseCase usecase.UseCaseTransaction) {
	grpcServer := server.NewGRPCServer()
	grpcServer.ProcessTransactionUseCase = processTransactionUseCase
	grpcServer.Serve()
}
