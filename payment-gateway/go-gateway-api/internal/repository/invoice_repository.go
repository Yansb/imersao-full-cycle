package repository

import (
	"database/sql"
	"time"

	"github.com/Yansb/go-gateway-api/internal/domain"
)

type InvoiceRepository struct {
	db *sql.DB
}

func NewInvoiceRepository(db *sql.DB) *InvoiceRepository {
	return &InvoiceRepository{db: db}
}

func (r *InvoiceRepository) Save(invoice *domain.Invoice) error {
	query := `INSERT INTO invoices (id, account_id, amount, status, description, payment_type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := r.db.Exec(query,
		invoice.ID,
		invoice.AccountID,
		invoice.Amount,
		invoice.Status,
		invoice.Description,
		invoice.PaymentType,
		invoice.CreatedAt,
		invoice.UpdatedAt,
	)

	return err
}

func (r *InvoiceRepository) FindById(id string) (*domain.Invoice, error) {
	var invoice domain.Invoice
	query := `SELECT id, account_id, amount, status, description, payment_type, created_at, updated_at FROM invoices WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&invoice.ID,
		&invoice.AccountID,
		&invoice.Amount,
		&invoice.Status,
		&invoice.Description,
		&invoice.PaymentType,
		&invoice.CreatedAt,
		&invoice.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, domain.ErrInvoiceNotFound
	}
	if err != nil {
		return nil, err
	}
	return &invoice, nil
}

func (r *InvoiceRepository) FindByAccountId(id string) ([]*domain.Invoice, error) {
	rows, err := r.db.Query(`
		SELECT id, account_id, amount, status, created_at, updated_at
		FROM invoices
		WHERE account_id = $1`, id)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var invoices []*domain.Invoice

	for rows.Next() {
		var invoice domain.Invoice
		err := rows.Scan(
			&invoice.ID,
			&invoice.AccountID,
			&invoice.Amount,
			&invoice.Status,
			&invoice.CreatedAt,
			&invoice.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		invoices = append(invoices, &invoice)
	}

	return invoices, nil
}

func (r *InvoiceRepository) UpdateStatus(invoice *domain.Invoice) error {
	rows, err := r.db.Exec(`
		UPDATE invoices
		SET status = $1, updated_at = $2
		WHERE id = $3 AND status = $4`,
		invoice.Status,
		time.Now(),
		invoice.ID,
		domain.StatusPending,
	)
	if err != nil {
		return err
	}

	rowsAffected, err := rows.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return domain.ErrInvoiceNotFound
	}

	return nil
}
