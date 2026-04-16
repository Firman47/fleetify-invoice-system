package models

type Item struct {
	ID    uint    `gorm:"primaryKey" json:"id"`
	Code  string  `gorm:"unique;not null" json:"code"`
	Name  string  `gorm:"not null" json:"name"`
	Price float64 `gorm:"not null" json:"price"`
}
