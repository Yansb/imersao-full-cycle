package server

import (
	"net/http"

	"github.com/Yansb/go-gateway-api/internal/service"
	"github.com/Yansb/go-gateway-api/internal/web/handlers"
	"github.com/Yansb/go-gateway-api/internal/web/middleware"
	"github.com/go-chi/chi/v5"
)

type Server struct {
	router         *chi.Mux
	server         *http.Server
	accountService *service.AccountService
	invoiceService *service.InvoiceService
	port           string
}

func NewServer(accountService *service.AccountService, invoiceService *service.InvoiceService, port string) *Server {
	router := chi.NewRouter()
	server := &Server{
		router:         router,
		accountService: accountService,
		invoiceService: invoiceService,
		port:           port,
	}
	server.configureRoutes()
	return server
}

func (s *Server) configureRoutes() {
	accountHandler := handlers.NewAccountHandler(s.accountService)
	invoiceHandler := handlers.NewInvoiceHandler(s.invoiceService)
	authMiddleware := middleware.NewAuthMiddleware(s.accountService)

	s.router.Use(middleware.LogRequest)

	s.router.Post("/accounts", accountHandler.Create)
	s.router.Get("/accounts", accountHandler.Get)

	s.router.Group(func(r chi.Router) {
		r.Use(authMiddleware.Authenticate)
		r.Post("/invoice", invoiceHandler.Create)
		r.Get("/invoice/{id}", invoiceHandler.GetByID)
		r.Get("/invoice", invoiceHandler.ListByAccount)
	})

}

func (s *Server) Start() error {
	s.server = &http.Server{
		Addr:    ":" + s.port,
		Handler: s.router,
	}

	return s.server.ListenAndServe()
}
