package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_Should_Get_An_Error_When_Id_Is_Blank(t *testing.T) {
	order := Order{}

	assert.Error(t, order.Validate(), "invalid id")
}

func Test_Should_Get_An_Error_When_Price_Is_Blank(t *testing.T) {
	order := Order{ID: "123"}

	assert.Error(t, order.Validate(), "invalid price")
}

func Test_Should_Get_An_Error_When_Tax_Is_Blank(t *testing.T) {
	order := Order{ID: "123", Price: 10.0}

	assert.Error(t, order.Validate(), "invalid tax")
}

func Test_Should_Create_An_Order_When_Receive_Valid_Params(t *testing.T) {
	order := Order{ID: "123", Price: 10.0, Tax: 1.0}

	assert.NoError(t, order.Validate())
	assert.Equal(t, "123", order.ID)
	assert.Equal(t, 10.0, order.Price)
	assert.Equal(t, 1.0, order.Tax)
	order.CalculateFinalPrice()
	assert.Equal(t, 11.0, order.FinalPrice)
}
