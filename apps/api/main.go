package main

import (
	"log"

	"fleetify-invoice-api/internal/config"
	"fleetify-invoice-api/internal/controllers"
	"fleetify-invoice-api/internal/routes"
	"fleetify-invoice-api/internal/services"

	"github.com/gofiber/fiber/v3"
)

func main() {
	config.LoadEnv()

	app := fiber.New(fiber.Config{
		AppName: "Fleetify Invoice API",
	})


	db := config.ConnectDB()

	authService := services.NewAuthService(db)
	authController := controllers.NewAuthController(authService)


	routes.SetupAuthRoutes(app, authController)
	
	port := config.GetEnv("APP_PORT", "3000")
	log.Fatal(app.Listen(":" + port))
}
