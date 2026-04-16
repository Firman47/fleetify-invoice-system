package services

import (
	"errors"
	"fleetify-invoice-api/internal/models"
	"fleetify-invoice-api/internal/utils"

	"gorm.io/gorm"
)

type AuthService struct {
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{}
}

var dummyUsers = []models.User{
	{
		ID: 1, Username: "admin",
		 Password: "$2a$10$jd5.8N3L2CUPsQnTJrkV4e2OcO0.bV/CosoPkKNkMNf1R/T3r.q7u",  // password: "admin123"
		 Role: "Admin",
	},
	{
		ID: 2, 
		Username: "kerani", 
		Password: "$2a$10$3RID8kbDDBFJcy80w1pj8ur/5preuUBspoPuamOuhXmOmaN.ir9CG", // password: "kerani123"
		Role: "Kerani",
	},
}

func (s *AuthService) Login(username, password string) (models.User, error) {
	for _, user := range dummyUsers{
			if user.Username == username {
				if !utils.CheckPassword(user.Password, password) {
					return user, errors.New("wrong password")
				}
				return user, nil
			}
		}
	return models.User{}, errors.New("user not found")
}