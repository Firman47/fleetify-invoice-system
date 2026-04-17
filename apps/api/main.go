package main

import (
	"log"

	"fleetify-invoice-api/internal/config"
	"fleetify-invoice-api/internal/controllers"
	"fleetify-invoice-api/internal/database"
	"fleetify-invoice-api/internal/routes"
	"fleetify-invoice-api/internal/services"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func main() {
	config.LoadEnv()

	app := fiber.New(fiber.Config{
		AppName: "Fleetify Invoice API",
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:3001"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	db := database.ConnectDB()
	database.SeedItems(db)

	authService := services.NewAuthService(db)
	authController := controllers.NewAuthController(authService)

	itemService := services.NewItemService(db)
	itemController := controllers.NewItemController(itemService)

	invoiceService := services.NewInvoiceService(db)
	invoiceController := controllers.NewInvoiceController(invoiceService)

	routes.SetupItemRoutes(app, itemController)
	routes.SetupAuthRoutes(app, authController)
	routes.SetupInvoiceRoutes(app, invoiceController)

	port := config.GetEnv("APP_PORT", "8080")
	log.Fatal(app.Listen(":" + port))
}
