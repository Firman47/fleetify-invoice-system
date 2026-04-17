package database

import (
	"fleetify-invoice-api/internal/models"
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func GetDSN() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
	)
}

func ConnectDB() *gorm.DB {
	dsn := GetDSN()

	var db *gorm.DB
	var err error

	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Println("DB connected")
			break
		}

		log.Println("DB not ready, retrying... attempt:", i+1)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatal("DB connection failed after retries:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("failed to get db instance:", err)
	}

	if err := sqlDB.Ping(); err != nil {
		log.Fatal("DB ping failed:", err)
	}

	db.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Invoice{},
		&models.InvoiceDetail{},
	)

	return db
}