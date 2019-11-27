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
                <div id="LineItemSelectContainer"></div>
                <div id="QuantityRemainingToPersonalizeContainer"></div>
                <div id="PersonalizationInformationContainer">
                    <input type="hidden" value="">
                    ${$SideNumbers.map(
                        $SideNumber => html`
                            <label title="Side${$SideNumber}Label" hidden>Enable Side ${$SideNumber} Personalization</label>
                            <input type="checkbox" title="Side${$SideNumber}" @change=${Receive_SideCheckboxOnChnage} hidden disabled>
                            <label title="Side${$SideNumber}IsCustomerSuppliedDecorationLabel" hidden>Is Customer Supplied Decoration</label>
                            <input type="checkbox" title="Side${$SideNumber}IsCustomerSuppliedDecoration" @change=${Receive_IsCustomerSuppliedDecorationCheckboxOnChnage} hidden disabled>
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
                    <button type="button" @click=${Invoke_TervisShopifyPOSPersonalizationSave} title="Save" hidden>Save</button>
                    <br>
                </div>
                <div id="PersonalizationChargeLineItemsContainer"></div>
                <div id="Debug"></div>
            </form>
        `
    })
}

async function Receive_ShopifyPOSPersonalizationCart () {
    var $Cart = await Get_TervisShopifyCart()
    Out_TervisShopifyPOSDebug({$Object: $Cart})
    var $Content = New_TervisShopifyPOSPersonalizableLineItemSelect({$Cart})
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

function Get_TervisShopifyPOSPersonalizableLineItem ({
    $Cart
}) {
    return $Cart.line_items.filter(
        $LineItem => $LineItem.sku ? $LineItem.sku.slice(-1) === "P" : undefined
    )
}

function New_TervisShopifyPOSPersonalizableLineItemSelect ({
    $Cart
}) {
    var $PersonalizableLineItems = Get_TervisShopifyPOSPersonalizableLineItem({$Cart})

    return New_TervisSelect({
        $Title: "Select Line Item To Personalize",
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
    .querySelectorAll(`[title="Select Line Item To Personalize"]`)
    .forEach( $Element =>
        $Element.dispatchEvent(new Event('change', { bubbles: true }))
    )
}

async function Receive_TervisShopifyPOSPersonalizationChargeLineEditOnClick ($Event) {
    var $IndexOfPersonalizationChargeLineInCart = $Event.target.id
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizationChargeLineItemToEdit = $Cart.line_items[$IndexOfPersonalizationChargeLineInCart]
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

    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle({ $ProductTitle: $SelectedPersonalizableLineItem.title })

    var $Content = []
    if ($ProductQuantityRemainingThatCanBePersonalized > 0) {
        $Content.push(
            await New_TervisPersonalizationForm({
                $ProductSize,
                $ProductFormType,
                $PersonalizationChargeLineItem: $PersonalizationChargeLineItemToEdit,
                $IndexOfPersonalizationChargeLineInCart,
                $ProductQuantityRemainingThatCanBePersonalized
            })
        )
    }

    $PersonalizationChargeLineItems.splice(
        $PersonalizationChargeLineItems.indexOf($PersonalizationChargeLineItemToEdit),
        1
    )

    for (var $PersonalizationChargeLineItem of $PersonalizationChargeLineItems) {
        $Content.push(await New_TervisShopifyPOSPersonaliztaionChargeLineItemDisplay({$PersonalizationChargeLineItem, $Cart}))
    }

    // Set_ContainerContent({
    //     $TargetElementSelector: "#PersonalizationInformationContainer",
    //     $Content
    // })
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
//             @click=${Invoke_TervisShopifyPOSPersonalizationSave}
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
            ${$Name}: ${$Value}<br />
        `
    )

    $Content.push(html`Quantity: ${$PersonalizationChargeLineItem.quantity}<br />`)
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
    var $IndexOfPersonalizationChargeLineToRemove = $Event.target.id
    var $Cart = await Get_TervisShopifyCart()

    $Cart = await Remove_TervisShopifyCartLineItem({
        $Cart,
        $LineItemIndex: $IndexOfPersonalizationChargeLineToRemove
    })

    Update_PersonalizationForm()
    Out_TervisShopifyPOSDebug({$Object: $Cart})
}

async function New_TervisShopifyPOSPersonalizationQuantityOfLineQuantityToReceiveThisPersonalizationSelect ({
    $PersonalizationChargeLineItem,
    $ProductQuantityRemainingThatCanBePersonalized
}) {
    return New_TervisSelect({
        $Title: "Quantity of line item to apply personalization to",
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

async function Invoke_TervisShopifyPOSPersonalizationSave () {
    if (document.querySelector("#ShopifyPOSPersonalizationForm").reportValidity()) {
        var $Cart = await Get_TervisShopifyCart()
        var $SelectedLineItem = await Get_TervisShopifyPOSPersonalizableLineItemSelected()
        var $PersonalizationProperties = await Get_TervisPersonalizationFormProperties()
        var $PersonalizationChargeLineItemQuantity = Number(Get_ElementPropertyValue({
            $QuerySelector: "[title='Quantity of line item to apply personalization to']",
            $PropertyName: "value"
        }))
        var $NumberOfPersonalizedSides = Get_TervisPersonalizationNumberSides({$PersonalizationProperties})
        var $LineItemProperties = $PersonalizationProperties

        $LineItemProperties.RelatedLineItemSKU = $SelectedLineItem.sku
        
        var $Price
        if ($NumberOfPersonalizedSides === 1) {
            $Price = 5
        } else if ($NumberOfPersonalizedSides === 2) {
            $Price = 7.5
        }

        var $IndexOfPersonalizationChargeLineBeingEdited = Get_ElementPropertyValue({
            $QuerySelector: "input[type='hidden']",
            $PropertyName: "value"
        })

        if($IndexOfPersonalizationChargeLineBeingEdited) {
            $Cart = await Remove_TervisShopifyCartLineItem({
                $Cart,
                $LineItemIndex: $IndexOfPersonalizationChargeLineBeingEdited
            })
        }

        $Cart = await Add_TervisShopifyCartLineItem({
            $Cart,
            $Price,
            $Quantity: $PersonalizationChargeLineItemQuantity,
            $Title: `Personalization for ${$SelectedLineItem.title} ${crypto.getRandomValues(new Uint16Array(1))[0]}`
        })

        var $LineItemIndex = $Cart.line_items.length - 1
        
        $Cart = await Add_TervisShopifyCartLineItemProperties({
            $Cart,
            $LineItemIndex,
            $LineItemProperties
        })

        Update_PersonalizationForm()
        Out_TervisShopifyPOSDebug({$Object: $Cart})
    }
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
    .filter( $Node => $Node.value)
    .forEach(
        $Node => $Properties[$Node.title] = $Node.value
    )

    Array.from(document.querySelectorAll("#PersonalizationInformationContainer input[title*='Monogram']:not([hidden])"))
    .filter( $Node => $Node.value)
    .forEach(
        $Node => $Properties[$Node.title.replace(/MonogramAllCharactersRequired/, "").replace(/MonogramAllCharactersNotRequired/, "")] = $Node.value
    )

    return $Properties
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
