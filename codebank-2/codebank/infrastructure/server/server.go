package server

import (
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/grpc/pb"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/grpc/service"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net"
)

type GRPCServer struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
}

func NewGRPCServer() GRPCServer {
	return GRPCServer{}
}
func (g GRPCServer) Serve() {
	lis, err := net.Listen("tcp", "0.0.0.0:50052")

	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	transactionService := service.NewTransactionService()
	transactionService.ProcessTransactionUseCase = g.ProcessTransactionUseCase
	grpcServer := grpc.NewServer()

	reflection.Register(grpcServer)

	pb.RegisterPaymentServiceServer(grpcServer, transactionService)
	err = grpcServer.Serve(lis)
	if err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

}
