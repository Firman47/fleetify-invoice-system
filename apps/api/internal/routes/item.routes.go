package routes

import (
	"fleetify-invoice-api/internal/controllers"

	"github.com/gofiber/fiber/v3"
)

func SetupItemRoutes(app *fiber.App, itemController *controllers.ItemController) {
	app.Get("/api/items", itemController.GetAll)
}
