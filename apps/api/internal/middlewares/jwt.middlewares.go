package middlewares

import (
	"fleetify-invoice-api/internal/utils"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware(c fiber.Ctx) error {
	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{
			"message": "missing token",
		})
	}

	tokenString := strings.Split(authHeader, " ")

	if len(tokenString) != 2 {
		return c.Status(401).JSON(fiber.Map{
			"message": "invalid token format",
		})
	}

	token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
		return utils.JWTSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{
			"message": "invalid token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(401).JSON(fiber.Map{
			"message": "invalid claims",
		})
	}

	c.Locals("user", map[string]interface{}{
		"id":       claims["id"],
		"username": claims["username"],
		"role":     claims["role"],
	})

	return c.Next()
}