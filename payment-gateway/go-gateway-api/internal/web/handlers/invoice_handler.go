package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Yansb/go-gateway-api/internal/domain"
	"github.com/Yansb/go-gateway-api/internal/dto"
	"github.com/Yansb/go-gateway-api/internal/service"
	"github.com/go-chi/chi/v5"
)

type InvoiceHandler struct {
	service *service.InvoiceService
}

func NewInvoiceHandler(service *service.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{
		service: service,
	}
}

func (h InvoiceHandler) Create(w http.ResponseWriter, r *http.Request) {
	var input dto.CreateInvoiceInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	input.APIKey = r.Header.Get("X-API-Key")

	output, err := h.service.Create(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(output)
}

func (h InvoiceHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "Missing invoice ID", http.StatusBadRequest)
		return
	}

	apiKey := r.Header.Get("X-API-Key")
	output, err := h.service.GetByID(id, apiKey)
	if err != nil {
		switch err {
		case domain.ErrAccountNotFound:
		case domain.ErrInvoiceNotFound:

			http.Error(w, err.Error(), http.StatusNotFound)
		case domain.ErrUnauthorizedAccess:
			http.Error(w, err.Error(), http.StatusUnauthorized)
		default:
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(output)
}

func (h InvoiceHandler) ListByAccount(w http.ResponseWriter, r *http.Request) {
	apiKey := r.Header.Get("X-API-Key")
	output, err := h.service.ListByAPIKey(apiKey)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(output)
}
