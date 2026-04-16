package models

import "time"

type Invoice struct {
	ID              uint              `gorm:"primaryKey"`
	InvoiceNumber   string
	SenderName      string
	SenderAddress   string
	ReceiverName    string
	ReceiverAddress string
	TotalAmount     float64
	CreatedBy       uint
	CreatedAt       time.Time

	Details []InvoiceDetail `gorm:"foreignKey:InvoiceID"`
}