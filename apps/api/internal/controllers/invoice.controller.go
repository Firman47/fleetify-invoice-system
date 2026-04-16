package controllers

import (
	"fleetify-invoice-api/internal/dto"
	"fleetify-invoice-api/internal/services"

	"github.com/gofiber/fiber/v3"
)

type InvoiceController struct {
	Service *services.InvoiceService
}

func NewInvoiceController(service *services.InvoiceService) *InvoiceController {
	return &InvoiceController{Service: service}
}

func (h *InvoiceController) GetAll(c fiber.Ctx) error {	
	invoices, err := h.Service.GetAll()

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve invoices",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Invoices retrieved successfully",
		"data":    invoices,
	})
}


func (h *InvoiceController) Create(c fiber.Ctx) error {
	var body dto.InvoiceRequest

	if err := c.Bind().Body(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request",
		})
	}

	user := c.Locals("user").(map[string]interface{})
	userID := uint(user["id"].(float64))

	invoice, err := h.Service.CreateInvoice(body, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Invoice created successfully",
		"data":    invoice,
	})
}