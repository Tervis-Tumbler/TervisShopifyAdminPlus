// WIP. Replicates Shopify POS API.

let ShopifyPOS = {
    cart: {
        line_items: [
            {
                title: "Test Product",
                price: 100
            }
        ]
    },
    ready: callback => callback(),
    fetchCart: function (success, failure) {
        return success(this.cart)
    },
    flashNotice: msg => alert(msg),
    flashError: msg => alert(msg),
    addLineItemProperties: function (index, props, callbacks) {
        Object.assign(this.cart[index], props)
        return callbacks.success(this.cart)
    }
}

cart.addLineItemProperties(0, {
    promotion: "1 free item",
    trim: "brown leather"
}, {
    success: function (cart) {
        ShopifyPOS.flashNotice("Successfully added properties to lineitem")
    },
    error: function (errors) {
        ShopifyPOS.flashError("Failed to add properties to lineitem")
    }
})