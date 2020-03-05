import {
    html,
    render,
    directive
} from 'https://unpkg.com/lit-html?module'

import {
    ifDefined
} from 'https://unpkg.com/lit-html/directives/if-defined.js?module'

import {
    Get_TervisProductMetaDataUsingIndex
} from 'https://unpkg.com/@tervis/tervisproductmetadata?module'

import {
    New_Range,
    Add_MemberScriptProperty
} from 'https://unpkg.com/@tervis/tervisutilityjs?module'

import {
    Test_IsTervisItemPersonalizable
} from 'https://unpkg.com/@tervis/tervispersonalizableitemsjs?module'

var $Debug = true

async function main () {
    Initialize_TervisShopifyPOSPersonalizationFormStructure()
    Receive_ShopifyPOSPersonalizationCart()
}

async function Receive_SideCheckboxOnChnage ($Event) {
    var $SideName = $Event.target.title
    this.closest('div')
    .querySelectorAll(`[title="${$SideName}IsCustomerSuppliedDecorationLabel"], [title="${$SideName}IsCustomerSuppliedDecoration"], [title="${$SideName}ColorName"], [title="${$SideName}FontName"]`)
    .forEach($Element => {
        $Element.hidden = !this.checked || this.hidden
        $Element.disabled = !this.checked || this.hidden
    })

    if (this.checked) {
        var $ProductMetadata = await Get_TervisShopifyPOSPersonalizableLineItemSelectedProductMetadata()
        var $SupportedFontNames = $ProductMetadata.Personalization.SupportedFontName
        
        this.closest('div')
        .querySelectorAll(`[title="${$SideName}FontName"] option`)
        .forEach($Element => {
            if($Element.value) {
                $Element.hidden = !$SupportedFontNames.includes($Element.value)
                $Element.disabled = !$SupportedFontNames.includes($Element.value)
                if($SupportedFontNames.length === 1 && $SupportedFontNames.includes($Element.value)) {
                    $Element.selected = true
                    $Element.closest("select").dispatchEvent(new Event('change', { bubbles: true }))    
                }
            }
        })
    }

    this.closest('div')
    .querySelectorAll(`[title="${$SideName}IsCustomerSuppliedDecoration"]`)
    .forEach($Element => {
        $Element.dispatchEvent(new Event('change', { bubbles: true }))  
    })
}

async function Receive_IsCustomerSuppliedDecorationCheckboxOnChnage ($Event) {
    var $SideName = $Event.target.title.substring(0,5)
    if (!this.hidden) {
        this.closest('div')
        .querySelectorAll(`[title="${$SideName}ColorName"], [title="${$SideName}FontName"]`)
        .forEach($Element => {
            $Element.hidden = this.checked
            $Element.disabled = this.checked
            $Element.dispatchEvent(new Event('change', { bubbles: true }))
        })
    
        this.closest('div')
        .querySelectorAll(`[title="${$SideName}CustomerSuppliedDecorationNote"]`)
        .forEach($Element => {
            $Element.hidden = !this.checked
            $Element.disabled = !this.checked
        })
    } else {
        this.closest('div')
        .querySelectorAll(`[title="${$SideName}ColorName"], [title="${$SideName}FontName"]`)
        .forEach($Element => {
            $Element.hidden = true
            $Element.disabled = true
            $Element.dispatchEvent(new Event('change', { bubbles: true }))
        })
    
        this.closest('div')
        .querySelectorAll(`[title="${$SideName}CustomerSuppliedDecorationNote"]`)
        .forEach($Element => {
            $Element.hidden = true
            $Element.disabled = true
        })
    }
}

async function Receive_FontNameOnChnage ($Event) {
    var $SideName = $Event.target.title.substring(0,5)
    var $FormContainer = this.closest('div')
    var $NodesToHide = []
    var $NodesToShow = []

    if (!$Event.target.hidden && $Event.target.value) {
        var $SideNumber = $SideName[4]
        var $FontMetadata = Get_TervisPersonalizationSelectedFontMetadata({$SideNumber})

        if ($FontMetadata.MonogramStyle) {
            if ($FontMetadata.AllCharactersRequired) {
                $NodesToHide = $FormContainer.querySelectorAll(
                    `[type='text'][title='${$SideName}MonogramAllCharactersNotRequired']:not([hidden]), [type='text'][title^='${$SideName}']:not([title^='${$SideName}MonogramAllCharactersRequired'])`
                )
                $NodesToShow = $FormContainer.querySelectorAll(`[type='text'][title^='${$SideName}MonogramAllCharactersRequired'][hidden]`)
            } else {
                $NodesToHide = $FormContainer.querySelectorAll(
                    `[type='text'][title='${$SideName}MonogramAllCharactersRequired']:not([hidden]), [type='text'][title^='${$SideName}']:not([title^='${$SideName}MonogramAllCharactersNotRequired'])`
                )
                $NodesToShow = $FormContainer.querySelectorAll(`[type='text'][title^='${$SideName}MonogramAllCharactersNotRequired'][hidden]`)
            }
        } else {
            $NodesToHide = $FormContainer.querySelectorAll(`[type='text'][title^='${$SideName}Monogram']:not([hidden])`)
            
            var $ProductMetadata = await Get_TervisShopifyPOSPersonalizableLineItemSelectedProductMetadata()

            //This shouldn't be needed, we need to fix in TervisProductMetadata.js to set this value to 1 on all objects that don't have the values specified
            var $MaximumLineCount = $ProductMetadata.Personalization.MaximumLineCount ? 
                $ProductMetadata.Personalization.MaximumLineCount :
                1
            
            var $Selector = New_Range({$Start: 1, $Stop: $MaximumLineCount})
            .map(
                $LineNumber =>
                `[type='text'][title='${$SideName}Line${$LineNumber}'][hidden]:not([title^='${$SideName}Monogram'])`
            )
            .join(",")
            $NodesToShow = $FormContainer.querySelectorAll($Selector)
        }
    } else {
        $NodesToHide = $FormContainer.querySelectorAll(`[type='text'][title*='${$SideName}']:not([hidden])`)
    }
    
    $NodesToHide.forEach(
        $Node => {
            $Node.hidden = true
            $Node.disabled = true
        }
    )

    $NodesToShow.forEach(
        $Node => {
            $Node.hidden = false
            $Node.disabled = false
        }
    )
}

function Initialize_TervisShopifyPOSPersonalizationFormStructure () {
    var $SideNumbers = [1,2]
    Set_ContainerContent({
        $TargetElementSelector: "#content",
        $Content: html`
            <form id="ShopifyPOSPersonalizationForm">
                <div id="PersonalizationOptions">
                    <div id="LineItemSelectContainer"></div>
                    <div id="QuantityRemainingToPersonalizeContainer"></div>
                    <div id="PersonalizationInformationContainer">
                        <input type="hidden" value="">
                        ${$SideNumbers.map(
                            $SideNumber => html`
                                <label title="Side${$SideNumber}Label" hidden>
                                    <input type="checkbox" title="Side${$SideNumber}" @change=${Receive_SideCheckboxOnChnage} hidden disabled>
                                    <span class="labelText">Personalize side ${$SideNumber}</span>
                                </label>
                                <label title="Side${$SideNumber}IsCustomerSuppliedDecorationLabel" hidden>
                                    <input type="checkbox" title="Side${$SideNumber}IsCustomerSuppliedDecoration" @change=${Receive_IsCustomerSuppliedDecorationCheckboxOnChnage} hidden disabled>
                                    <span class="labelText">Is Customer Supplied Decoration</span>
                                </label>
                                <input type="text" title="Side${$SideNumber}CustomerSuppliedDecorationNote" placeholder="Side${$SideNumber}CustomerSuppliedDecorationNote" hidden disabled>
                                <select title="Side${$SideNumber}ColorName" required hidden disabled>
                                    <option selected disabled value="">Side${$SideNumber}ColorName</option>
                                    <option>Black</option>
                                    <option>Chocolate</option>
                                    <option>Fuchsia</option>
                                    <option>Green</option>
                                    <option>Hunter</option>
                                    <option>Navy</option>
                                    <option>Orange</option>
                                    <option>Purple</option>
                                    <option>Red</option>
                                    <option>Royal Blue</option>
                                    <option>Turquoise</option>
                                    <option>White</option>
                                    <option>Yellow</option>
                                </select>
                                <select title="Side${$SideNumber}FontName" required @change=${Receive_FontNameOnChnage} hidden disabled>
                                    <option selected="" disabled="" value="">Side${$SideNumber}FontName</option>
                                    <option>Script</option>
                                    <option>Block U/L</option>
                                    <option>Monogram</option>
                                    <option>Initials Block</option>
                                    <option>Initials Script</option>
                                </select>
                                <input type="text" title="Side${$SideNumber}Line1" maxlength="13" placeholder="Side${$SideNumber}Line1" hidden disabled>
                                <input type="text" title="Side${$SideNumber}Line2" maxlength="13" placeholder="Side${$SideNumber}Line2" hidden disabled>
                                <input type="text" title="Side${$SideNumber}Line3" maxlength="13" placeholder="Side${$SideNumber}Line3" hidden disabled>
                                <input type="text" title="Side${$SideNumber}MonogramAllCharactersRequiredLine1" maxlength="3" minlength="3" hidden disabled pattern="[A-Z]*" placeholder="Side${$SideNumber}MonogramAllCharactersRequiredLine1">
                                <input type="text" title="Side${$SideNumber}MonogramAllCharactersNotRequiredLine1" maxlength="3" hidden disabled pattern="[A-Z]*" placeholder="Side${$SideNumber}MonogramAllCharactersNotRequiredLine1">
                            `
                        )}
                        <button type="button" @click=${Receive_TervisShopifyPOSPersonalizationSaveOnClick} title="Save" hidden>Save</button>
                        <br>
                    </div>
                </div>
                <div>
                    <strong>Personalization Cart:</strong>
                    <div id="PersonalizationChargeLineItemsContainer"></div>
                <div>
            </form>
            <div id="Debug"></div>
        `
    })
}

async function Receive_ShopifyPOSPersonalizationCart () {
    var $Cart = await Get_TervisShopifyCart()
    // Out_TervisShopifyPOSDebug({$Object: $Cart})
    var $Content = await New_TervisShopifyPOSPersonalizableLineItemSelect({$Cart})
    Set_ContainerContent({
        $TargetElementSelector: "#LineItemSelectContainer",
        $Content
    })
}

function Out_TervisShopifyPOSDebug ({
    $Object
}) {
    if ($Debug) {
        Set_ContainerContent({
            $TargetElementSelector: "#Debug",
            $Content: html`<textarea rows="30" cols="60">${JSON.stringify($Object, null, 2)}</textarea>`
        })    
    }
}

async function Get_TervisShopifyPOSPersonalizableLineItem ({
    $Cart
}) {
    let $PendingLookup = $Cart.line_items.map(
        $Line => Test_IsTervisItemPersonalizable({ $ItemNumber: $Line.sku })
    )

    let $IsIndexPersonalizable = await Promise.all($PendingLookup)

    let $PersonalizableLineItems = $Cart.line_items.filter(
        ($LineItem, $LineItemIndex) => {
            return $IsIndexPersonalizable[$LineItemIndex] ? $LineItem : undefined
        }
    )

    return $PersonalizableLineItems
}

async function New_TervisShopifyPOSPersonalizableLineItemSelect ({
    $Cart
}) {
    var $PersonalizableLineItems = await Get_TervisShopifyPOSPersonalizableLineItem({$Cart})

    return New_TervisSelect({
        $Title: "Select item to personalize",
        $Options: $PersonalizableLineItems.map(
            $LineItem => ({
                Value: $Cart.line_items.indexOf($LineItem),
                Text: `${$LineItem.title} ${$LineItem.quantity}`
            })
        ),
        $OnChange: Receive_TervisShopifyPOSPersonalizableLineItemSelectOnChange
    })
}

function Get_TervisShopifyPOSPersonalizableLineItemQuantityRemainingToPersonalize ({
    $PersonalizableLineItem,
    $PersonalizationChargeLineItems
}) {
    var $SumOfQuantityOfPersonalizationChargeLines = $PersonalizationChargeLineItems ?
        $PersonalizationChargeLineItems
        .reduce(
            ($Sum, $PersonalizationChargeLineItem) =>
            ($Sum + Number($PersonalizationChargeLineItem.quantity)),
            0
        ) :
        0

    return $PersonalizableLineItem.quantity - $SumOfQuantityOfPersonalizationChargeLines
}

async function Receive_TervisShopifyPOSPersonalizableLineItemSelectOnChange ($Event) {
    var $IndexInCartOfSelectedPersonalizableLineItem = $Event.target.value
    var $Cart = await Get_TervisShopifyCart()
    var $SelectedPersonalizableLineItem = $Cart.line_items[$IndexInCartOfSelectedPersonalizableLineItem]
    var $PersonalizationChargeLineItems =
    Get_TervisShopifyPOSPersonalizableLineItemAssociatedPersonalizationChargeLine({
        $Cart,
        $PersonalizableLineItem: $SelectedPersonalizableLineItem
    })

    var $ProductQuantityRemainingThatCanBePersonalized = Get_TervisShopifyPOSPersonalizableLineItemQuantityRemainingToPersonalize ({
        $PersonalizableLineItem: $SelectedPersonalizableLineItem,
        $PersonalizationChargeLineItems
    })

    if ($ProductQuantityRemainingThatCanBePersonalized > 0) {
        Set_ContainerContent({
            $TargetElementSelector: "#QuantityRemainingToPersonalizeContainer",
            $Content: await New_TervisShopifyPOSPersonalizationQuantityOfLineQuantityToReceiveThisPersonalizationSelect({
                $ProductQuantityRemainingThatCanBePersonalized
            })
        })

        document.querySelectorAll("[title='Side1Label'], [title='Side2Label']")
        .forEach( $Element => {
            $Element.hidden = false
            $Element.disabled = false
        })

        document.querySelectorAll("[title='Side1'], [title='Side2']")
        .forEach( $Element => {
            $Element.hidden = false
            $Element.disabled = false
            
            $Element.dispatchEvent(new Event('change', { bubbles: true }))
        })
    
        document.querySelector("button[title='Save']").hidden = false
    } else {
        Set_ContainerContent({
            $TargetElementSelector: "#QuantityRemainingToPersonalizeContainer",
            $Content: ""
        })

        document.querySelectorAll("[title='Side1Label'], [title='Side2Label']")
        .forEach( $Element => {
            $Element.hidden = true
            $Element.disabled = true
        })

        document.querySelectorAll("[title='Side1'], [title='Side2']")
        .forEach( $Element => {
            $Element.hidden = true
            $Element.disabled = true
            
            $Element.dispatchEvent(new Event('change', { bubbles: true }))
        })
    
        document.querySelector("button[title='Save']").hidden = true
    }

    var $Content = []
    for (var $PersonalizationChargeLineItem of $PersonalizationChargeLineItems) {
        $Content.push(await New_TervisShopifyPOSPersonaliztaionChargeLineItemDisplay({$PersonalizationChargeLineItem, $Cart}))
    }

    Set_ContainerContent({
        $TargetElementSelector: "#PersonalizationChargeLineItemsContainer",
        $Content
    })
}

async function Update_PersonalizationForm () {
    document
    .querySelectorAll(`[title="Select item to personalize"]`)
    .forEach( $Element =>
        $Element.dispatchEvent(new Event('change', { bubbles: true }))
    )
    setTimeout(() => window.scrollTo(0,0), 1000)
}

async function Receive_TervisShopifyPOSPersonalizationChargeLineEditOnClick ($Event) {
    var $PersonalizationChargeLineToEditIndexInCart = $Event.target.id
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizationChargeLineItemToEdit = $Cart.line_items[$PersonalizationChargeLineToEditIndexInCart]
    Add_PersonalizationChargeLineCustomProperties({
        $PersonalizationChargeLineItem: $PersonalizationChargeLineItemToEdit
    })
    
    var $SelectedPersonalizableLineItem = Get_LineItemRelatedToPersonalizationChargeLineItem({ 
        $PersonalizationChargeLineItem: $PersonalizationChargeLineItemToEdit,
        $Cart
    })
    var $PersonalizationChargeLineItems =
    Get_TervisShopifyPOSPersonalizableLineItemAssociatedPersonalizationChargeLine({
        $Cart,
        $PersonalizableLineItem: $SelectedPersonalizableLineItem
    })

    var $ProductQuantityRemainingThatCanBePersonalized = Get_TervisShopifyPOSPersonalizableLineItemQuantityRemainingToPersonalize ({
        $PersonalizableLineItem: $SelectedPersonalizableLineItem,
        $PersonalizationChargeLineItems
    }) + $PersonalizationChargeLineItemToEdit.quantity

    if ($ProductQuantityRemainingThatCanBePersonalized > 0) {
        Set_ContainerContent({
            $TargetElementSelector: "#QuantityRemainingToPersonalizeContainer",
            $Content: await New_TervisShopifyPOSPersonalizationQuantityOfLineQuantityToReceiveThisPersonalizationSelect({
                $PersonalizationChargeLineItem: $PersonalizationChargeLineItemToEdit,
                $ProductQuantityRemainingThatCanBePersonalized
            })
        })

        document.querySelector("[type='hidden']").value = $PersonalizationChargeLineToEditIndexInCart

        Object.entries($PersonalizationChargeLineItemToEdit.PropertiesObject)
        .filter(([$PropertyName, ]) => $PropertyName.slice(0,4) === "Side")
        .forEach(
            ([$PropertyName, $PropertyValue]) => {
                var $ElementTitle = $PropertyName

                var $SideName = $PropertyName.slice(0,5)
                var $FontName = $PersonalizationChargeLineItemToEdit.PropertiesObject[`${$SideName}FontName`]
                var $FontMetadata = $FontMetadataHashtable[$FontName]                
                if ($PropertyName.slice(-5) === "Line1" && $FontMetadata.MonogramStyle) {
                    $ElementTitle = `${$SideName}MonogramAllCharacters${!$FontMetadata.AllCharactersRequired ? "Not" : "" }RequiredLine1`
                }

                var $Element = document.querySelector(`[title='${$ElementTitle}']`)
                $Element.hidden = false
                $Element.disabled = false

                if ($Element.type !== "checkbox") {
                    $Element.value = $PropertyValue
                } else {
                    $Element.checked = true
                    var $LabelElement = document.querySelector(`[title='${$ElementTitle}Label']`)
                    $LabelElement.hidden = false
                    $LabelElement.disabled = false
                }
            }
        )

        document.querySelectorAll("[title='Side1'], [title='Side2']")
        .forEach( $Element => {
            $Element.hidden = false
            $Element.disabled = false
            
            $Element.dispatchEvent(new Event('change', { bubbles: true }))
        })

        var $SaveButtonElement = document.querySelector("[title='Save']")
        $SaveButtonElement.hidden = false
        $SaveButtonElement.disabled = false
    }

    $PersonalizationChargeLineItems.splice(
        $PersonalizationChargeLineItems.indexOf($PersonalizationChargeLineItemToEdit),
        1
    )

    var $Content = []
    for (var $PersonalizationChargeLineItem of $PersonalizationChargeLineItems) {
        $Content.push(await New_TervisShopifyPOSPersonaliztaionChargeLineItemDisplay({$PersonalizationChargeLineItem, $Cart}))
    }

    Set_ContainerContent({
        $TargetElementSelector: "#PersonalizationChargeLineItemsContainer",
        $Content
    })
}

// async function New_TervisPersonalizationForm ({
//     $PersonalizationChargeLineItem,
//     $IndexOfPersonalizationChargeLineInCart,
//     $ProductSize,
//     $ProductFormType,
//     $ProductQuantityRemainingThatCanBePersonalized
// }) {
//     return html`
//         ${await New_TervisShopifyPersonalizationChargeLineItemIDInput({$IndexOfPersonalizationChargeLineInCart})}
//         ${await New_TervisPersonalizationPropertiesForm({
//             $PersonalizationChargeLineItem,
//             $ProductSize,
//             $ProductFormType
//         })}
//         <button
//             type="button"
//             @click=${Receive_TervisShopifyPOSPersonalizationSaveOnClick}
//         >Save</button>
//         <br>
//     `
// }

// async function New_TervisShopifyPersonalizationChargeLineItemIDInput({
//     $IndexOfPersonalizationChargeLineInCart
// }) {
//     return html`
//         <input 
//             type="hidden"
//             .value=${forceWrite($IndexOfPersonalizationChargeLineInCart ? $IndexOfPersonalizationChargeLineInCart : "")}
//         >
//     `
// }

async function New_TervisShopifyPOSPersonaliztaionChargeLineItemDisplay ({
    $PersonalizationChargeLineItem,
    $Cart
}) {
    var $IndexOfPersonalizationChargeLineItem = $Cart.line_items.indexOf($PersonalizationChargeLineItem)
    var $Content
    $Content = Object.entries($PersonalizationChargeLineItem.PropertiesObject)
    .filter(
        ([$Name, ]) => !["RelatedLineItemSKU", "ID"].includes($Name)
    )
    .map(
        ([$Name, $Value]) =>
        html`
            <span class="PersonalizationPropertyName">${$Name}:</span> ${$Value}<br />
        `
    )

    $Content.push(html`<span class="PersonalizationPropertyName">Quantity:</span> ${$PersonalizationChargeLineItem.quantity}<br />`)
    $Content.push(html`
        <button
            type="button"
            id=${$IndexOfPersonalizationChargeLineItem}
            @click=${Receive_TervisShopifyPOSPersonalizationChargeLineEditOnClick}
        >Edit</button>
        <button
            type="button"
            id=${$IndexOfPersonalizationChargeLineItem}
            @click=${Receive_TervisShopifyPOSPersonalizationChargeLineRemoveOnClick}
        >Remove</button>
        <br>
    `)

    return $Content
}

function Get_LineItemRelatedToPersonalizationChargeLineItem ({
    $PersonalizationChargeLineItem,
    $Cart
}) {
    return $Cart.line_items.filter( 
        $LineItem =>
        $LineItem.sku === $PersonalizationChargeLineItem.PropertiesObject.RelatedLineItemSKU
    )[0]
}

async function Receive_TervisShopifyPOSPersonalizationChargeLineRemoveOnClick ($Event) {
    try {
    var $IndexOfPersonalizationChargeLineToRemove = $Event.target.id
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizationChargeLineItem = $Cart.line_items[$IndexOfPersonalizationChargeLineToRemove]
    Add_PersonalizationChargeLineCustomProperties({$PersonalizationChargeLineItem})
    var $PersonalizationFeeSKU = $PersonalizationChargeLineItem.PropertiesObject.PersonalizationFeeSKU
    // Out_TervisShopifyPOSDebug({$Object: $PersonalizationChargeLineItem})
    $Cart = await Remove_TervisShopifyCartLineItem({
        $Cart,
        $LineItemIndex: $IndexOfPersonalizationChargeLineToRemove
    })

    var $PersonalizationFeeLineItemIndex = Get_IndexOfLineItemBySKU({
        $Cart,
        $SKU: $PersonalizationFeeSKU
    })
    alert($PersonalizationFeeLineItemIndex)
    alert($PersonalizationFeeSKU)
    alert(JSON.stringify($PersonalizationChargeLineItem,null,'  '))
    var $PersonalizationFeeLineItem = $Cart.line_items[$PersonalizationFeeLineItemIndex]
    if ($PersonalizationChargeLineItem.quantity === $PersonalizationFeeLineItem.quantity) {
        $Cart = await Remove_TervisShopifyCartLineItem({
            $Cart,
            $LineItemIndex: $PersonalizationFeeLineItemIndex
        })
    } else {
        $NewPersonalizationFeeLineItemQuantity = $PersonalizationFeeLineItem.quantity - $PersonalizationChargeLineItem.quantity
        $Cart = await Update_TervisShopifyCartLineItem({
            $Cart,
            $LineItemIndex: $PersonalizationFeeLineItemIndex,
            $Quantity: $NewPersonalizationFeeLineItemQuantity
        })
    }

    Update_PersonalizationForm()
    } catch (e) {
        alert(e)
        Out_TervisShopifyPOSDebug({$Object: e})
    }
}

function Get_IndexOfLineItemBySKU ({
    $Cart,
    $SKU
}) {
    alert(JSON.stringify($Cart, null, '  '))
    let $ResultingIndex = -1
    $Cart.line_items.forEach(($LineItem, $Index) => {
        let $IsSKUMatch = $LineItem.sku === $SKU
        alert(`Incoming line item SKU: ${$LineItem.sku}
        SKU we're looking for: ${$SKU}
        Match?: ${$IsSKUMatch}`)
        if ($IsSKUMatch) {
            $ResultingIndex = $Index
        }
    })
    return $ResultingIndex
}

async function New_TervisShopifyPOSPersonalizationQuantityOfLineQuantityToReceiveThisPersonalizationSelect ({
    $PersonalizationChargeLineItem,
    $ProductQuantityRemainingThatCanBePersonalized
}) {
    return New_TervisSelect({
        $Title: "Select number of cups to personalize",
        $Required: true,
        $Options:  New_Range({$Start: 1, $Stop: $ProductQuantityRemainingThatCanBePersonalized})
        .map(
            $Quantity =>
            ({
                Text: $Quantity,
                Selected: $PersonalizationChargeLineItem ? $Quantity === $PersonalizationChargeLineItem.quantity : undefined
            })
        )
    })
}

async function Get_TervisShopifyPOSPersonalizableLineItemSelected () {
    var $Cart = await Get_TervisShopifyCart()
    var $SelectedLineItemIndex = Get_TervisShopifyPOSPersonalizationLineItemSelectedIndex()
    return $Cart.line_items[$SelectedLineItemIndex]
}

async function Get_TervisShopifyPOSPersonalizableLineItemSelectedProductMetadata () {
    var $SelectedPersonalizableLineItem = await Get_TervisShopifyPOSPersonalizableLineItemSelected()
    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle({ $ProductTitle: $SelectedPersonalizableLineItem.title })
    return await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
}

function Get_TervisShopifyPOSPersonalizationLineItemSelectedIndex () {
    return Get_ElementPropertyValue({
        $QuerySelector: "#LineItemSelectContainer > select",
        $PropertyName: "value" 
    })
}

async function Receive_TervisPersonalizationFontNameSelectOnChange ($Event) {
    var $Element = document.querySelector(`[title='${$Event.target.title}']`)
    var $IndexOfPersonalizationChargeLineBeingEdited = $Element.closest("div").querySelector("[type='hidden']").value
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizationChargeLineItem = $Cart.line_items[$IndexOfPersonalizationChargeLineBeingEdited]
    Add_PersonalizationChargeLineCustomProperties({
        $PersonalizationChargeLineItem
    })

    var $SideNumber = $Event.target.title[4]
    var $FontMetadata = Get_TervisPersonalizationSelectedFontMetadata({$SideNumber})

    var $NodesToHide
    var $NodesToShow
    if ($FontMetadata.MonogramStyle) {
        if ($FontMetadata.AllCharactersRequired) {
            $NodesToHide = document.querySelectorAll(
                `#PersonalizationInformationContainer [type='text'][title='Side${$SideNumber}MonogramAllCharactersNotRequired']:not([hidden]), #PersonalizationInformationContainer [type='text'][title^='Side${$SideNumber}']:not([title^='Side${$SideNumber}MonogramAllCharactersRequired'])`
            )
            $NodesToShow = document.querySelectorAll(`#PersonalizationInformationContainer [type='text'][title^='Side${$SideNumber}MonogramAllCharactersRequired'][hidden]`)
        } else {
            $NodesToHide = document.querySelectorAll(
                `#PersonalizationInformationContainer [type='text'][title='Side${$SideNumber}MonogramAllCharactersRequired']:not([hidden]), #PersonalizationInformationContainer [type='text'][title^='Side${$SideNumber}']:not([title^='Side${$SideNumber}MonogramAllCharactersNotRequired'])`
            )
            $NodesToShow = document.querySelectorAll(`#PersonalizationInformationContainer [type='text'][title^='Side${$SideNumber}MonogramAllCharactersNotRequired'][hidden]`)
        }
    } else {
        $NodesToHide = document.querySelectorAll(`#PersonalizationInformationContainer [type='text'][title^='Side${$SideNumber}Monogram']:not([hidden])`)
        $NodesToShow = document.querySelectorAll(`#PersonalizationInformationContainer [type='text'][hidden][title^='Side${$SideNumber}'][hidden]:not([title^='Side${$SideNumber}Monogram']`)
    }

    $NodesToHide.forEach(
        $Node =>
        $Node.hidden = true
    )

    $NodesToShow.forEach(
        $Node =>
        $Node.hidden = false
    )
}

function New_TervisPersonalizationPropertiesSideAndLineForm ({
    $PersonalizationChargeLineItem,
    $ProductMetadata,
    $SideNumber
}) {
    var $Content = []
    for (var $LineNumber of New_Range({$Start: 1, $Stop: $ProductMetadata.Personalization.MaximumLineCount})) {
        var $Title = `Side${$SideNumber}Line${$LineNumber}`
        $Content.push(
            New_InputText({
                $Title,
                $PlaceHolder: $Title,
                $MaxLength: 13,
                $Hidden: true,
                $Value: $PersonalizationChargeLineItem ? $PersonalizationChargeLineItem.PropertiesObject[$Title] ? $PersonalizationChargeLineItem.PropertiesObject[$Title] : "" : undefined
            })
        )
    }

    var $Title = `Side${$SideNumber}MonogramAllCharactersRequiredLine1`
    $Content.push(
        New_InputText({
            $Title,
            $PlaceHolder: $Title,
            $MaxLength: 3,
            $MinLength: 3,
            $Pattern: $MonogramValidCharactersPatternAttributeRegex,
            $Hidden: true,
            $Value: $PersonalizationChargeLineItem ? $PersonalizationChargeLineItem.PropertiesObject[$Title] ? $PersonalizationChargeLineItem.PropertiesObject[$Title] : "" : undefined
        })
    )

    var $Title = `Side${$SideNumber}MonogramAllCharactersNotRequiredLine1`
    $Content.push(
        New_InputText({
            $Title,
            $PlaceHolder: $Title,
            $MaxLength: 3,
            $Pattern: $MonogramValidCharactersPatternAttributeRegex,
            $Hidden: true,
            $Value: $PersonalizationChargeLineItem ? $PersonalizationChargeLineItem.PropertiesObject[$Title] ? $PersonalizationChargeLineItem.PropertiesObject[$Title] : "" : undefined
        })
    )
    return $Content
}

var $MonogramValidCharactersPatternAttributeRegex = "[A-Z]*"

async function Receive_TervisShopifyPOSPersonalizationSaveOnClick () {
    if (document.querySelector("#ShopifyPOSPersonalizationForm").reportValidity()) {
        var $Cart = await Get_TervisShopifyCart()
        var $SelectedLineItem = await Get_TervisShopifyPOSPersonalizableLineItemSelected()
        var $PersonalizationProperties = await Get_TervisPersonalizationFormProperties()
        var $PersonalizationChargeLineItemQuantity = Number(Get_ElementPropertyValue({
            $QuerySelector: "[title='Select number of cups to personalize']",
            $PropertyName: "value"
        }))
        var $NumberOfPersonalizedSides = Get_TervisPersonalizationNumberSides({$PersonalizationProperties})
        var $PersonalizationFeeObject = Get_TervisPersonalizationFeeObject({$NumberOfPersonalizedSides})
        var $LineItemProperties = $PersonalizationProperties

        $LineItemProperties.RelatedLineItemSKU = $SelectedLineItem.sku
        $LineItemProperties.PersonalizationFeeSKU = $PersonalizationFeeObject.sku
        
        var $Price = 0.00000001 // This makes the item basically free, even at the max qty of 99,999

        var $IndexOfPersonalizationChargeLineBeingEdited = Get_ElementPropertyValue({
            $QuerySelector: "input[type='hidden']",
            $PropertyName: "value"
        })

        if ($IndexOfPersonalizationChargeLineBeingEdited) {
            $Cart = await Remove_TervisShopifyCartLineItem({
                $Cart,
                $LineItemIndex: $IndexOfPersonalizationChargeLineBeingEdited
            })
            document.querySelector("input[type='hidden']").removeAttribute("value")
        }

        $Cart = await Add_TervisShopifyCartLineItem({
            $Cart,
            $Price,
            $Quantity: $PersonalizationChargeLineItemQuantity,
            $Title: `Personalization for ${$SelectedLineItem.title} ${crypto.getRandomValues(new Uint16Array(1))[0]}`
        })

        
        var $LineItemIndex = $Cart.line_items.length - 1
                                
        // Out_TervisShopifyPOSDebug({$Object: $LineItemProperties})
        
        $Cart = await Add_TervisShopifyCartLineItemProperties({
            $Cart,
            $LineItemIndex,
            $LineItemProperties
        })
        
        $Cart = await Add_TervisShopifyCartLineItem({
            $Cart,
            $VariantID: $PersonalizationFeeObject.variant_id,
            $Quantity: $PersonalizationChargeLineItemQuantity
        })

        Clear_Form()
        Update_PersonalizationForm()
        Out_TervisShopifyPOSDebug({$Object: $Cart})
    }
}

function Clear_Form () {
    let $TextFields = document.querySelectorAll('input[type="text"]')
    let $Selectors = document.querySelectorAll('select:not([title="Select item to personalize"]')
    let $Checkboxes = document.querySelectorAll('input[type="checkbox"]')
    $TextFields.forEach($Node => $Node.value = "")
    $Selectors.forEach($Node => $Node.selectedIndex = 0)
    $Checkboxes.forEach($Node => $Node.checked = false)
  }
  

function Get_TervisPersonalizationNumberSides ({
   $PersonalizationProperties
}) {
    return Object
    .entries($PersonalizationProperties)
    .map(
        ([$Name, ]) => $Name.slice(0,5)
    )
    .filter(
        $PropertyName => $PropertyName.startsWith("Side")
    )
    .filter(
        (value, index, self) => self.indexOf(value) === index
    )
    .length
}

function Get_TervisPersonalizationFeeObject ({
    $NumberOfPersonalizedSides
}) {
    if ($NumberOfPersonalizedSides === 1) {
        return {
            sku: "1154266",
            variant_id: 30370826125393
        }
    } else if ($NumberOfPersonalizedSides === 2) {
        return {
            sku: "1154269",
            variant_id: 31038255431761
        }
    }
}

async function Get_TervisPersonalizationFormProperties () {
    var $Properties = {}
    Array.from(
        document
        .querySelector(
            "#PersonalizationInformationContainer"
        )
        .querySelectorAll(
            "input:not([title*='Monogram']):not([hidden]), select:not([hidden])"
        )
    )
    .filter($Node => $Node.value)
    .filter($Node => $Node.type !== "checkbox" || $Node.checked === true)
    .filter($Node => $Node.type !== "hidden")
    .forEach(
        $Node => $Properties[$Node.title] = $Node.type === "checkbox" ? $Node.checked : $Node.value
    )

    Array.from(document.querySelectorAll("#PersonalizationInformationContainer input[title*='Monogram']:not([hidden])"))
    .filter( $Node => $Node.value)
    .forEach(
        $Node => $Properties[$Node.title.replace(/MonogramAllCharactersRequired/, "").replace(/MonogramAllCharactersNotRequired/, "")] = $Node.value
    )
    

    return Object.keys($Properties)
    .sort()
    .reduce(
        ($SortedProperties, $PropertyName) => {
            $SortedProperties[$PropertyName] = `${$Properties[$PropertyName]}`
            return $SortedProperties
        },
        {}
    )
}

function Get_TervisShopifyPOSPersonalizableLineItemAssociatedPersonalizationChargeLine ({
    $Cart,
    $PersonalizableLineItem
}) {
    var $PersonalizationChargeLineItems = $Cart.line_items
    .filter(
        $CartLineItem => {
            if ($CartLineItem.properties) { // remove once https://github.com/tc39/proposal-optional-chaining is live, next line should be $CartLineItem?.properties
                return $CartLineItem.properties
                    .filter( 
                        $Property =>
                        $Property.name === "RelatedLineItemSKU" &&
                        $Property.value === $PersonalizableLineItem.sku
                    )[0]
            }
        }
    )

    Add_PersonalizationChargeLineCustomProperties({
        $PersonalizationChargeLineItem: $PersonalizationChargeLineItems
    })

    return $PersonalizationChargeLineItems
}

function Add_PersonalizationChargeLineCustomProperties ({
    $PersonalizationChargeLineItem
}) {
    if ($PersonalizationChargeLineItem) {
        Add_MemberScriptProperty({
            $InputObject: $PersonalizationChargeLineItem,
            $Name: "PropertiesObject",
            $Value: function () { 
                return this.properties.reduce(
                    ($FinalReturnValue, $CurrentValue) =>
                    ($FinalReturnValue[$CurrentValue.name] = $CurrentValue.value, $FinalReturnValue),
                    {}
                )
            }
        })    
    }
}

// Replace with optional chaining once that has browser support https://github.com/tc39/proposal-optional-chaining
function Get_ElementPropertyValue ({
    $QuerySelector,
    $PropertyName
}) {
    var $Element = document.querySelector($QuerySelector)
    return $Element ?
    $Element[$PropertyName] :
    undefined
}

function Get_TervisPersonalizationSelectedFontName ({
    $SideNumber
}) {
    return Get_ElementPropertyValue({$QuerySelector: `[title='Side${$SideNumber}FontName']`, $PropertyName: "value"})
}

function Get_TervisPersonalizationSelectedColorName ({
    $SideNumber
}) {
    return Get_ElementPropertyValue({$QuerySelector: `[title='Side${$SideNumber}ColorName']`, $PropertyName: "value"})
}

function Get_TervisPersonalizationSelectedFontMetadata ({
    $PersonalizationChargeLineItem,
    $SideNumber
}) {
    var $FontName = $PersonalizationChargeLineItem ?
    $PersonalizationChargeLineItem.PropertiesObject[`Side${$SideNumber}FontName`] :
    Get_TervisPersonalizationSelectedFontName({$SideNumber})
    
    var $FontMetadata = $FontMetadataHashtable[$FontName]
    if ($FontMetadata) {
        $FontMetadata.Name = $FontName
        return $FontMetadata    
    }
}

var $FontMetadataHashtable = {
    "Script": {
        "MaximumCharactersPerLine": "13"
    },
    "Block U/L": {
        "MaximumCharactersPerLine": "13"
    },
    "Monogram": {
        "MonogramStyle": true,
        "AllCharactersRequired": true,
        "MaximumCharacters": "3"
    },
    "Initials Block": {
        "MonogramStyle": true,
        "MaximumCharacters": "3"
    },
    "Initials Script": {
        "MonogramStyle": true,
        "MaximumCharacters": "3"
    }
}

var $PersonalizationColors =  [ 
    "Black",
    "Chocolate",
    "Fuchsia",
    "Green",
    "Hunter",
    "Navy",
    "Orange",
    "Purple",
    "Red",
    "Royal Blue",
    "Turquoise",
    "White",
    "Yellow"
]

function New_InputText ({
    $ID,
    $Title,
    $Value,
    $PlaceHolder,
    $MaxLength,
    $MinLength,
    $Required,
    $Pattern,
    $Hidden,
    $OnChange
}) {
    return html`
    <input
        id=${ifDefined($ID)}
        title=${ifDefined($Title)}
        .value=${ifDefined($Value)}
        type="text"
        maxlength=${ifDefined($MaxLength)}
        minlength=${ifDefined($MinLength)}
        ?required=${$Required}
        ?hidden=${$Hidden}
        pattern=${ifDefined($Pattern)}
        placeholder=${ifDefined($PlaceHolder)}
        @change=${$OnChange}
    />
    `
}

function New_TervisSelect ({
    $Title,
    $ID,
    $Options,
    $Required,
    $OnChange
}) {
    return html`
        <select
            id=${ifDefined($ID)}
            title=${ifDefined($Title)}
            ?required=${$Required}
            @change=${$OnChange}
        >
        <option selected disabled value="">${$Title}</option>
        ${
            $Options
            .map(
                $Option => 
                html`
                    <option 
                        .value=${ifDefined($Option.Value)}
                        ?selected=${$Option.Selected}
                    >${$Option.Text}</option>
                `
            )
        }
        </select>
    `
}

function Set_ContainerContent ({
    $TargetElementSelector,
    $Content
}) {
    var $Container = document.querySelector($TargetElementSelector)
    render(
        $Content,
        $Container
    )
}

function ConvertFrom_TervisShopifyPOSProductTitle ({
    $ProductTitle
}) {
    var [,$ProductFormType,,,$ProductSize] = $ProductTitle.split(".")
    return {$ProductSize, $ProductFormType}
}

const forceWrite = directive((value) => (part) => {
    part.setValue(value);
  });

main ()

// function getPersonalizeItConfig() {
//     return {
//         "restrictionUrl": "c:\\Program Files\\nChannel\\Personalize\\PersonalizationGuidelines.html",
//     };
// }

// var $ItemUPCToAddToCartForOneSidedPersonaliztaion = "093597845116"
// var $ItemUPCToAddToCartForTwoSidedPersonaliztaion = "093597845123"
// var $ItemSKUToAddToCartForOneSidedPersonaliztaion = "1154266"
// var $ItemSKUToAddToCartForTwoSidedPersonaliztaion = "1154269"
// var $ItemVariantIDToAddToCartForOneSidedPersonaliztaion = "30370826125393"
// var $ItemVariantIDToAddToCartForTwoSidedPersonaliztaion = "31038255431761"
