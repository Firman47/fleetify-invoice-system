package services

import (
	"errors"
	"fleetify-invoice-api/internal/dto"
	"fleetify-invoice-api/internal/models"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type InvoiceService struct {
	DB *gorm.DB
}

func NewInvoiceService(db *gorm.DB) *InvoiceService {
	return &InvoiceService{DB: db}
}

func (s *InvoiceService) GetAll() ([]models.Invoice, error) {
	var invoices []models.Invoice
	err := s.DB.Preload("Details").Find(&invoices).Error
	return invoices, err
}

func (s *InvoiceService) CreateInvoice(req dto.InvoiceRequest, userID uint) (*models.Invoice, error) {
	var invoice models.Invoice

	err := s.DB.Transaction(func(tx *gorm.DB) error {
		var totalAmount float64
		var details []models.InvoiceDetail

		for _, item := range req.Items {
			var dbItem models.Item

			if err := tx.First(&dbItem, item.ItemID).Error; err != nil {
				return errors.New("item not found")
			}

			subtotal := dbItem.Price * float64(item.Quantity)
			totalAmount += subtotal

			detail := models.InvoiceDetail{
				ItemID:   dbItem.ID,
				Quantity: item.Quantity,
				Price:    dbItem.Price,
				Subtotal: subtotal,
			}

			details = append(details, detail)
		}

		// 🔥 generate invoice number
		invoiceNumber := fmt.Sprintf("INV-%d", time.Now().Unix())

		invoice = models.Invoice{
			InvoiceNumber:   invoiceNumber,
			SenderName:      req.SenderName,
			SenderAddress:   req.SenderAddress,
			ReceiverName:    req.ReceiverName,
			ReceiverAddress: req.ReceiverAddress,
			TotalAmount:     totalAmount,
			CreatedBy:       userID,
		}

		// insert header
		if err := tx.Create(&invoice).Error; err != nil {
			return err
		}

		// insert details
		for i := range details {
			details[i].InvoiceID = invoice.ID
			if err := tx.Create(&details[i]).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &invoice, nil
}