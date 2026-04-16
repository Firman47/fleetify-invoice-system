package database

import (
	"fleetify-invoice-api/internal/models"

	"gorm.io/gorm"
)

func SeedItems(db *gorm.DB) {
	items := []models.Item{
		{Code: "BRG-001", Name: "Laptop", Price: 10000},
		{Code: "BRG-002", Name: "Mouse", Price: 500},
		{Code: "BRG-003", Name: "Keyboard", Price: 1500},
	}

	for _, item := range items {
		db.FirstOrCreate(&item, models.Item{Code: item.Code})
	}
}