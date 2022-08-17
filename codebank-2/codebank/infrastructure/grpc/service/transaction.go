package service

import (
	"context"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/dto"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/infrastructure/grpc/pb"
	"github.com/yansb/imersao-full-cycle/codebank-2/codebank/usecase"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type TransactionService struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
	pb.UnimplementedPaymentServiceServer
}

func NewTransactionService() *TransactionService {
	return &TransactionService{}
}
func (t *TransactionService) Payment(_ context.Context, in *pb.PaymentRequest) (*empty.Empty, error) {
	transactionDto := dto.Transaction{
		Name:            in.GetCreditCard().GetName(),
		Number:          in.GetCreditCard().GetNumber(),
		CVV:             in.GetCreditCard().GetCvv(),
		ExpirationYear:  in.GetCreditCard().GetExpirationYear(),
		ExpirationMonth: in.GetCreditCard().GetExpirationYear(),
		Amount:          in.GetAmount(),
		Store:           in.GetStore(),
		Description:     in.GetDescription(),
	}

	transaction, err := t.ProcessTransactionUseCase.ProcessTransaction(transactionDto)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, err.Error())
	}
	if transaction.Status != "approved" {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, "transaction rejected by the bank")
	}
	return &empty.Empty{}, nil
}
