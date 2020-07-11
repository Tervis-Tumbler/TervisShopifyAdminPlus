let ShopifyPOS = {
    cart: {
        "grand_total": "58.83",
        "line_items": [
            {
                "quantity": 1,
                "tax_lines": [
                    {
                        "price": "0.9",
                        "title": "Florida State Tax",
                        "rate": "0.06"
                    },
                    {
                        "price": "0.15",
                        "title": "Sarasota County Tax",
                        "rate": "0.01"
                    }
                ],
                "taxable": true,
                "sku": "1000032",
                "variant_id": 33140897284233,
                "title": "Margaritaville - It's 5 O'Clock Somewhere - Red Parrot",
                "price": 14.99,
                "product_id": 4777219621001,
                "vendor": "Tervis",
                "grams": 0,
                "variant_title": "",
                "requires_shipping": true
            },
            {
                "quantity": 1,
                "tax_lines": [
                    {
                        "price": "2.1",
                        "title": "Florida State Tax",
                        "rate": "0.06"
                    },
                    {
                        "price": "0.35",
                        "title": "Sarasota County Tax",
                        "rate": "0.01"
                    }
                ],
                "taxable": true,
                "sku": "1344638",
                "variant_id": 33143803609225,
                "title": "30A Beach Happy Palms",
                "price": 34.99,
                "product_id": 4778229170313,
                "vendor": "Tervis",
                "grams": 0,
                "variant_title": "",
                "requires_shipping": true
            },
            {
                "custom": true,
                "quantity": 1,
                "taxable": true,
                "requires_shipping": true,
                "price": 5,
                "title": "Somefin",
                "tax_lines": [
                    {
                        "price": "0.3",
                        "title": "Florida State Tax",
                        "rate": "0.06"
                    },
                    {
                        "price": "0.05",
                        "title": "Sarasota County Tax",
                        "rate": "0.01"
                    }
                ]
            }
        ],
        "subtotal": "54.98",
        "tax_total": "3.85"
    },
    fetchCart: function ({success, error}) {
        if (true) {
            success(this.cart)
        } else {
            error("error")
        }
    },
    addLineItem: function (lineItem, {success, error}) {
        try {
            this.cart.line_items.push(lineItem)
            success(this.cart)
        } catch (errors) {
            error(errors)
        }
    },
    addLineItemProperties: function (index, properties, {success, error}) {
        try {
            let item = this.cart.line_items[index]
            if (item.properties === undefined) {
                item.properties = []
            }
            let keys = Object.keys(properties)
            keys.forEach(key => {

                let propIndex = item.properties.findIndex( prop => prop.name === key)

                if (propIndex > -1) {
                    item.properties[propIndex].value = properties[key]
                } else {
                    item.properties.push({
                        name: key,
                        value: properties[key]
                    })
                }
            })
            success(this.cart)
        } catch (errors) {
            error(errors)
        }
    },
    removeLineItem: function (index, {success, error}) {
        try {
            this.cart.line_items.splice(index, 1)
            success(this.cart)
        } catch (errors) {
            error(errors)
        }
    },
    updateLineItem: function (index, {quantity}, {success, error}) {
        try {
            let lineItem = this.cart.line_items[index]
            lineItem.quantity = quantity
            success(this.cart)
        } catch (errors) {
            error(errors)
        }
    }
}