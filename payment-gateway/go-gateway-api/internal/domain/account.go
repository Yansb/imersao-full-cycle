package domain

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID        string
	Name      string
	Email     string
	APIKey    string
	Balance   float64
	CreatedAt time.Time
	UpdatedAt time.Time
	mu        sync.RWMutex
}

func generateAPIKey() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func NewAccount(name, email string) *Account {
	return &Account{
		ID:        uuid.New().String(),
		Name:      name,
		Email:     email,
		APIKey:    generateAPIKey(),
		Balance:   0.0,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func (a *Account) AddBalance(amount float64) {
	a.mu.Lock()
	defer a.mu.Unlock()
	if amount > 0 {
		a.Balance += amount
		a.UpdatedAt = time.Now()
	}
}
