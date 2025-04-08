package server

import (
	"net/http"

	"github.com/Yansb/go-gateway-api/internal/service"
	"github.com/Yansb/go-gateway-api/internal/web/handlers"
	"github.com/go-chi/chi/v5"
)

type Server struct {
	router         *chi.Mux
	server         *http.Server
	accountService *service.AccountService
	port           string
}

func NewServer(accountService *service.AccountService, port string) *Server {
	router := chi.NewRouter()
	server := &Server{
		router:         router,
		accountService: accountService,
		port:           port,
	}
	server.configureRoutes()
	return server
}

func (s *Server) configureRoutes() {
	accountHandler := handlers.NewAccountHandler(s.accountService)

	s.router.Post("/accounts", accountHandler.Create)
	s.router.Get("/accounts", accountHandler.Get)
}

func (s *Server) Start() error {
	s.server = &http.Server{
		Addr:    ":" + s.port,
		Handler: s.router,
	}

	return s.server.ListenAndServe()
}
