import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

new Vue({
    el: "#content",
    data: {
        selectedShipMethod: null,
        shipMethods: [
            {
                name: "Made4Life/Osprey Pickup",
                value: "000001_CUSTROUTE_L_TBD",
                price: 0,
                threshold: undefined
            },
            {
                name: "FedEx Air Standard Overnight",
                value: "000001_FEDEXP_A_SON",
                price: 20,
                threshold: undefined
            },
            {
                name: "FedEx Parcel Ground (Business)",
                value: "000001_FEDEX_P_GND",
                price: 6.95,
                threshold: 49.99
            },
            {
                name: "FedEx Parcel Home Delivery (Residential)",
                value: "000001_FEDEX_P_HDY",
                price: 6.95,
                threshold: 49.99
            },
            {
                name: "Pick up in store",
                value: "000001_PICKUP_P_TRV",
                price: 0,
                threshold: 0
            }
        ],
        cart: "lol"
    },
    methods: {
        doThing() {
            alert(`Submitted ${this.selectedShipMethod}`)
            Add_TervisShopifyCartLineItem({
                $Cart: this.cart,
                $Price: 9.99,
                $Quantity: 1,
                $Title: "wut",
                $VariantID: 1
            })
        },
        showCart() {
            alert(JSON.stringify(this.cart.line_items, null, 4))
        },
        getShipMethod() {
            let result = this.shipMethods
                .filter( shipMethod => {
                    return shipMethod.name === this.selectedShipMethod
                })[0]
            console.log(JSON.stringify(result, null, 4))
            return result
        },
        getCartSubtotal() {
            let subtotal = this.cart.line_items.reduce((acc,curr) => {
                return acc + curr.quantity
            }, 0)
            console.log(subtotal)
        }
    },
    created: function() {
        // Get_TervisShopifyCart()
        //     .then(shopifyCart => this.cart = shopifyCart)
        this.cart = {
            line_items: [
                {
                    title: "CLEAR.ICE.CL1.NA.87.OZ.BX.NA",
                    sku: "1001842",
                    quantity: 2
                },
                {
                    title: "CLEAR.DWT.CL1.NA.16.OZ.EA.NA",
                    sku: "1001837",
                    quantity: 3
                }
            ]
        }
    }
})

alert("after vue")