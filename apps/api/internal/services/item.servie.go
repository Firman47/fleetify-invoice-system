package services

import (
	"fleetify-invoice-api/internal/models"

	"gorm.io/gorm"
)

type ItemService struct {
	DB *gorm.DB
}

func NewItemService(db *gorm.DB) *ItemService{
	return &ItemService{DB: db}
}

func (s *ItemService) GetAll(code string) ([]models.Item, error) {
	var items []models.Item

	query := s.DB.Model(&models.Item{})

	if code != "" {
		query = query.Where("code LIKE ? ", "%" + code +"%" )
	}

	err := query.Limit(10).Find(&items).Error
	return items, err
}