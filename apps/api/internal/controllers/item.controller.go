package controllers

import (
	"fleetify-invoice-api/internal/services"

	"github.com/gofiber/fiber/v3"
)

type ItemController struct {
	services *services.ItemService
}

func NewItemController(services *services.ItemService) *ItemController {
	return &ItemController{services: services}
}

func (h *ItemController) GetAll(c fiber.Ctx) error {
	code := c.Query("code")

	items, err := h.services.GetAll(code)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve items",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Items retrieved successfully",
		"data":    items,
	})
}