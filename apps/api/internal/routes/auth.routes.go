package routes

import (
	"fleetify-invoice-api/internal/controllers"

	"github.com/gofiber/fiber/v3"
)

func SetupAuthRoutes(app *fiber.App, authController *controllers.AuthController) {
	app.Post("/login", authController.Login)
}