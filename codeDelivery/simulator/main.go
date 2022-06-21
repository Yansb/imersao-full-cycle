package main

import (
	"fmt"
	"log"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
	kafkaClient "github.com/yansb/imersao-full-cycle/codeDelivery/simulator/application/kafka"
	"github.com/yansb/imersao-full-cycle/codeDelivery/simulator/infra/kafka"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)

	consumer := kafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()

	for msg := range msgChan {
		go kafkaClient.Produce(msg)
		fmt.Println(string(msg.Value))
	}
}
