package factory

import (
	"github.com/jinzhu/gorm"
	"github.com/yansb/imersao-codepix-go/application/usecase"
	"github.com/yansb/imersao-codepix-go/infrastucture/repository"
)

func TransactionUseCaseFactory(database *gorm.DB) usecase.TransactionUseCase {
	pixRepository := repository.PixKeyRepositoryDb{Db: database}
	transactionRepository := repository.TransactionRepositoryDB{Db: database}

	transactionUseCase := usecase.TransactionUseCase{
		TransactionRepository: &transactionRepository,
		PixRepository:         &pixRepository,
	}

	return transactionUseCase
}
