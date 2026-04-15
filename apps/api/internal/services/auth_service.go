package services

import (
	"errors"
	"fleetify-invoice-api/internal/models"
	"fleetify-invoice-api/internal/utils"

	"gorm.io/gorm"
)

type AuthService struct {
	DB *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{DB: db}
}

func (s *AuthService) RegisterUser(username, password string) error {
	var existing models.User

	if err := s.DB.Where("username = ?", username).First(&existing).Error; err == nil {
		return errors.New("user already exists")
	}

	hashed, err := utils.HashPassword(password)
	if err != nil {
		return err
	}

	user := models.User{
		Username: username,
		Password: hashed,
	}

	return s.DB.Create(&user).Error
}

func (s *AuthService) Login(username, password string) (models.User, error) {
	var user models.User

	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return user, errors.New("user not found")
	}

	if !utils.CheckPassword(user.Password, password) {
		return user, errors.New("wrong password")
	}

	return user, nil
}