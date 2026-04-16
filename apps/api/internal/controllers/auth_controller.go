package controllers

import (
	"fleetify-invoice-api/internal/services"
	"fleetify-invoice-api/internal/utils"

	"github.com/gofiber/fiber/v3"
)


type AuthController struct {
	Service *services.AuthService
}

func NewAuthController(service *services.AuthService) *AuthController {
	return &AuthController{Service: service}
}

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}


func (h *AuthController) Login(c fiber.Ctx) error {
	var body AuthRequest


	if err := c.Bind().Body(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "invalid request"})
	}

	user, err := h.Service.Login(body.Username, body.Password)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": err.Error()})
	}

	token, err := utils.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"token": token,
	})
}