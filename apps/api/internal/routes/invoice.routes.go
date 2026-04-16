package routes

import (
	"fleetify-invoice-api/internal/controllers"
	"fleetify-invoice-api/internal/middlewares"

	"github.com/gofiber/fiber/v3"
)

func SetupInvoiceRoutes(app *fiber.App, invoiceController *controllers.InvoiceController) {
	app.Get("/api/invoices", middlewares.JWTMiddleware, invoiceController.GetAll)
	app.Post("/api/invoices", middlewares.JWTMiddleware, invoiceController.Create)
}