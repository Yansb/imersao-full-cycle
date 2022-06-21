package repository

import (
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/yansb/imersao-codepix-go/domain/model"
)

// type TransactionRepository interface {
// 	Register(transaction *Transaction) error
// 	Save(transaction *Transaction) error
// 	Find(id string) (*Transaction, error)
// }

type TransactionRepositoryDB struct {
	Db *gorm.DB
}

func (t *TransactionRepositoryDB) Register(transaction *model.Transaction) error {
	err := t.Db.Create(transaction).Error

	if err != nil {
		return err
	}

	return nil
}

func (t *TransactionRepositoryDB) Save(transaction *model.Transaction) error {
	err := t.Db.Save(transaction).Error

	if err != nil {
		return err
	}

	return nil
}

func (t *TransactionRepositoryDB) Find(id string) (*model.Transaction, error) {
	var transaction model.Transaction

	t.Db.Preload("AccountFrom.Bank").First(&transaction, "id = ?", id)

	if transaction.ID == "" {
		return nil, fmt.Errorf("no transaction was found")
	}

	return &transaction, nil
}
