var ShopifyPOS = {
    // "grand_total": "58.83",
    "grand_total": "68.2",
    "line_items": [
        {
        "quantity": 2,
        "discount": {
            "amount": 2,
            "type": "flat",
            "discount_description": "$1.99 Lids"
        },
        "tax_lines": [
            {
            "price": "3.06",
            "title": "Florida State Tax",
            "rate": "0.06"
            },
            {
            "price": "0.51",
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
        "requires_shipping": true,
        "discounts": [
            {
            "amount": 2,
            "type": "flat",
            "discount_description": "$1.99 Lids"
            }
        ]
        },
        {
        "quantity": 1,
        "tax_lines": [
            {
            "price": "0.77",
            "title": "Florida State Tax",
            "rate": "0.06"
            },
            {
            "price": "0.13",
            "title": "Sarasota County Tax",
            "rate": "0.01"
            }
        ],
        "taxable": true,
        "sku": "1352248",
        "variant_id": 33144690376841,
        "title": "30A Logo",
        "price": 16.99,
        "product_id": 4778592501897,
        "vendor": "Tervis",
        "grams": 0,
        "variant_title": "",
        "requires_shipping": true
        }
    ],
    "subtotal": "63.73",
    "tax_total": "4.47",
    "cart_discount": {
        "amount": 0.25,
        "type": "percent",
        "discount_description": "Last Chance 25%"
    },
    "properties": [
        {
        "name": "discountReport",
        "value": "[{\"discount_description\":\"$1.99 Lids\",\"type\":\"flat\",\"amount\":2,\"kind\":\"line\",\"description_text\":\"$1.99 Lid with tumbler purchase\",\"parameters\":\"\",\"count\":2,\"discountedAmount\":0,\"discountAmount\":0},{\"discount_description\":\"Last Chance 25%\",\"type\":\"percent\",\"amount\":0.25,\"kind\":\"cart\",\"description_text\":\"25% off Last Chance \",\"parameters\":\"\",\"count\":1,\"discountedAmount\":0,\"discountAmount\":0}]"
        }
    ],
    ready: function(callback) {
        callback()
    },
    fetchCart: function ({success, error}) {
        if (true) {
            success(this)
        } else {
            error("error")
        }
    },
    fetchLocation: function ({success, error}) {
        try {
            success({
                "phone": "+19419668614",
                "city": "Osprey",
                "address1": "928 S Tamiami Trail",
                "id": 44018073737,
                "active": true,
                "country_name": "United States",
                "zip": "34229",
                "country_code": "US",
                "name": "Tervis Factory Store - Osprey, FL",
                "province": "Florida"
            })
        } catch (errors) {
            error(errors)
        }
    },
    flashNotice: function(message) {
        console.log(message)
    },
    addLineItem: function (lineItem, {success, error}) {
        try {
            if (lineItem.variant_id == "33143854268553") {
                lineItem.sku = "1154266"
            } else if (lineItem.variant_id == "34264108335241") {
                lineItem.sku = "1154269"
            }
            this.line_items.push(lineItem)
            success(this)
        } catch (errors) {
            error(errors)
        }
    },
    addLineItemProperties: function (index, properties, {success, error}) {
        try {
            let item = this.line_items[index]
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
            success(this)
        } catch (errors) {
            error(errors)
        }
    },
    removeLineItem: function (index, {success, error}) {
        try {
            this.line_items.splice(index, 1)
            success(this)
        } catch (errors) {
            error(errors)
        }
    },
    updateLineItem: function (index, {quantity}, {success, error}) {
        try {
            let lineItem = this.line_items[index]
            lineItem.quantity = quantity
            success(this)
        } catch (errors) {
            error(errors)
        }
    },
    setDiscount: function (
            {amount, discount_description, type} = {type: "flat"}, 
            // {success, error}
        ) {
        try {
            this.cart_discount = {
                amount: amount,
                discount_description: discount_description,
                type: type
            }
            // success(this)
        } catch (errors) {
            // error(errors)
        }
    },
    removeDiscount: function ({success, error}) {
        try {
            delete this.cart_discount
            success(this)
        } catch (errors) {
            error(errors)
        }
    },
    setLineItemDiscount: function (
            index, 
            {amount, discount_description, type} = {type: "flat"},
            // {success, error}
        ) {
            try {
                this.line_items[index].discount = {
                    amount: amount,
                    discount_description: discount_description,
                    type: type
                }
                // success(this)
            } catch (errors) {
                // error(errors)
            }
        },
    removeLineItemDiscount: function (index) {
        delete this.line_items[index].discount
    },
    addProperties: function (properties, {success, error}) {
        try {
            if (this.properties === undefined) {
                this.properties = []
            }
            let keys = Object.keys(properties)
            keys.forEach(key => {

                let propIndex = this.properties.findIndex( prop => prop.name === key)

                if (propIndex > -1) {
                    this.properties[propIndex].value = properties[key]
                } else {
                    this.properties.push({
                        name: key,
                        value: properties[key]
                    })
                }
            })
            success(this)
        } catch (errors) {
            error(errors)
        }
    }
}