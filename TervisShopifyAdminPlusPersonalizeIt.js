import {
    html,
    render
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

var $ItemUPCToAddToCartForOneSidedPersonaliztaion = "093597845116"
var $ItemUPCToAddToCartForTwoSidedPersonaliztaion = "093597845123"

var $ItemSKUToAddToCartForOneSidedPersonaliztaion = "1154266"
var $ItemSKUToAddToCartForTwoSidedPersonaliztaion = "1154269"

var $ItemVariantIDToAddToCartForOneSidedPersonaliztaion = "30370826125393"
var $ItemVariantIDToAddToCartForTwoSidedPersonaliztaion = "31038255431761"

var $Debug = true

async function main () {
    Initialize_TervisShopifyPOSPersonalizationFormStructure()
    Receive_ShopifyPOSPersonalizationCart()
}

function Initialize_TervisShopifyPOSPersonalizationFormStructure () {
    Set_ContainerContent({
        $TargetElementSelector: "#content",
        $Content: html`
            <form id="ShopifyPOSPersonalizationForm">
                <div id="LineItemSelectContainer"></div>
                <div id="PersonalizationInformationContainer"></div>
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
            ($Sum + Number($PersonalizationChargeLineItem.Quantity)),
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
                $ProductQuantityRemainingThatCanBePersonalized
            })
        )
    }

    for (var $PersonalizationChargeLineItem of $PersonalizationChargeLineItems) {
        $Content.push(await New_TervisShopifyPOSPersonaliztaionChargeLineItemDisplay({$PersonalizationChargeLineItem, $Cart}))
    }

    Set_ContainerContent({
        $TargetElementSelector: "#PersonalizationInformationContainer",
        $Content
    })
}

async function Receive_TervisShopifyPOSPersonalizationChargeLineEditOnClick ($Event) {
    var $IndexOfPersonalizationChargeLineInCart = $Event.target.id
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizationChargeLineItemToEdit = $Cart.line_items[$IndexOfPersonalizationChargeLineInCart]
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
                $ProductQuantityRemainingThatCanBePersonalized
            })
        )
    }

    $PersonalizationChargeLineItems = $PersonalizationChargeLineItems.splice(
        $PersonalizationChargeLineItems.indexOf($PersonalizationChargeLineItemToEdit),
        1
    )

    for (var $PersonalizationChargeLineItem of $PersonalizationChargeLineItems) {
        $Content.push(await New_TervisShopifyPOSPersonaliztaionChargeLineItemDisplay({$PersonalizationChargeLineItem, $Cart}))
    }

    Set_ContainerContent({
        $TargetElementSelector: "#PersonalizationInformationContainer",
        $Content
    })

    // var {
    //     $ProductSize,
    //     $ProductFormType
    // } = ConvertFrom_TervisShopifyPOSProductTitle({ $ProductTitle: $LineItemToEdit.title })

    // var $PersonalizationPropertiesFromLineItem = Get_PersonalizationPropertiesFromPersonalizationChargeLineItem({
    //     $PersonalizationChargeLineItem: $LineItemToEdit
    // })

    // var $SumOfQuantityOfPersonalizationChargeLines = $PersonalizationPropertiesFromLineItem ?
    //     $PersonalizationPropertiesFromLineItem
    //     .reduce(
    //         ($Sum, $PersonalizationProperties) =>
    //         ($Sum + Number($PersonalizationProperties.Quantity)),
    //         0
    //     ) :
    //     0

    // var $QuantityRemiainingToBePersonalized = $LineItemToEdit.quantity + $SumOfQuantityOfPersonalizationChargeLines

    // New_TervisPersonalizationForm({
    //     $PersonalizationChargeLineItem,
    //     $ProductSize,
    //     $ProductFormType,
    //     $ProductQuantityRemainingThatCanBePersonalized: $QuantityRemiainingToBePersonalized
    // })
}

async function New_TervisPersonalizationForm ({
    $PersonalizationChargeLineItem,
    $ProductSize,
    $ProductFormType,
    $ProductQuantityRemainingThatCanBePersonalized
}) {
    return html`
        ${await New_TervisShopifyPersonalizationChargeLineItemIDInput({$PersonalizationChargeLineItem})}
        ${await New_TervisShopifyPOSPersonalizationQuantityOfLineQuantityToRecieveThisPersonalizationSelect({
            $PersonalizationChargeLineItem,
            $ProductQuantityRemainingThatCanBePersonalized
        })}
        ${await New_TervisShopifyPOSPersonalizationColorSelect({$PersonalizationChargeLineItem})}
        ${await New_TervisShopifyPOSPersonalizationFontSelect({
            $PersonalizationChargeLineItem,
            $ProductSize,
            $ProductFormType
        })}
        ${await New_TervisPersonalizationSideAndLineElement({
            $PersonalizationChargeLineItem,
            $ProductSize,
            $ProductFormType
        })}
        <button
            type="button"
            @click=${Invoke_TervisShopifyPOSPersonalizationSave}
        >Save</button>
    `
}

async function New_TervisShopifyPersonalizationChargeLineItemIDInput({
    $PersonalizationChargeLineItem
}) {
    return New_InputText({
        $Value: $PersonalizationChargeLineItem ? $PersonalizationChargeLineItem.PropertiesObject.ID : undefined,
        $Hidden: true
    })
}

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
    var $IDOfPersonalizationChargeLineToRemove = $Event.target.id
    var $Cart = await Get_TervisShopifyCart()
    var $LineItemToRemove = $Cart.line_items.filter( 
        $LineItem =>
        $LineItem.properties ?
        $LineItem.properties.reduce(
            ($HasMatchingIDProperty, $Property) =>
            (
                $HasMatchingIDProperty || 
                (
                    $Property.name === "ID" &&
                    $Property.value === $IDOfPersonalizationChargeLineToRemove
                )
            ),
            false
        ) :
        undefined
    )[0]

    var $IndexOfItemToRemove = $Cart.line_items.indexOf($LineItemToRemove)
    $Cart = await Remove_TervisShopifyCartLineItem({
        $Cart,
        $LineItemIndex: $IndexOfItemToRemove
    })

    Receive_TervisShopifyPOSPersonalizableLineItemSelectOnChange()
    Out_TervisShopifyPOSDebug({$Object: $Cart})
}

async function New_TervisShopifyPOSPersonalizationQuantityOfLineQuantityToRecieveThisPersonalizationSelect ({
    $PersonalizationChargeLineItem,
    $ProductQuantityRemainingThatCanBePersonalized
}) {
    return New_TervisSelect({
        $Title: "Quantity of line item to apply personalization to",
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

async function New_TervisShopifyPOSPersonalizationFontSelect({
    $PersonalizationChargeLineItem,
    $ProductSize,
    $ProductFormType
}) {
    return await New_TervisPersonalizationFontPicker({
        $ProductSize,
        $ProductFormType,
        $SelectedFontName: $PersonalizationChargeLineItem ?
            $PersonalizationChargeLineItem.PropertiesObject.FontName :
            undefined
    })
}

async function New_TervisShopifyPOSPersonalizationColorSelect ({
    $PersonalizationChargeLineItem
}) {
    return New_TervisSelect({
        $Title: "Color Name",
        $Options: $PersonalizationColors.map(
            $Color =>
            ({
                Text: $Color,
                Selected: $PersonalizationChargeLineItem ? $Color === $PersonalizationChargeLineItem.PropertiesObject.Color : undefined
            })
        )
    })
}

async function Get_TervisShopifyPOSPersonalizableLineItemSelected () {
    var $Cart = await Get_TervisShopifyCart()
    var $SelectedLineItemIndex = Get_TervisShopifyPOSPersonalizationLineItemSelectedIndex()
    return $Cart.line_items[$SelectedLineItemIndex]
}

function Get_TervisShopifyPOSPersonalizationLineItemSelectedIndex () {
    return Get_ElementPropertyValue({
        $QuerySelector: "#LineItemSelectContainer > select",
        $PropertyName: "value" 
    })
}

async function New_TervisPersonalizationFontPicker ({
    $ProductSize,
    $ProductFormType,
    $SelectedFontName
}) {
    var $ProductMetadata = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    var $FontNames = $ProductMetadata.Personalization.SupportedFontName
    return New_TervisSelect({
        $Title: "Font Name",
        $Options: $FontNames.map(
            $FontName => ({
                Text: $FontName,
                Selected: $SelectedFontName === $FontName
            })
        ),
        $OnChange: Receive_TervisPersonalizationFontPickerOnChange
    })
}

async function Receive_TervisPersonalizationFontPickerOnChange () {
    Receive_TervisShopifyPOSPersonalizableLineItemSelectOnChange()
    // Update_TervisPersonalizationSideAndLineElement()
}

async function Update_TervisPersonalizationSideAndLineElement () {
    var $SelectedLineItem = await Get_TervisShopifyPOSPersonalizableLineItemSelected()
    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle({ $ProductTitle: $SelectedLineItem.title })

    var $Content = New_TervisPersonalizationSideAndLineElement({
        $ProductSize,
        $ProductFormType
    })
}

var $MonogramValidCharactersPatternAttributeRegex = "[A-Z]*"

async function New_TervisPersonalizationSideAndLineElement ({
    $PersonalizationChargeLineItem,
    $ProductSize,
    $ProductFormType
}) {
    var $FontMetadata = Get_TervisPersonalizationSelectedFontMetadata()
    if ($FontMetadata) {
        var $ProductMetadata = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
        
        var $Content = []
        for (var $SideNumber of New_Range({$Start: 1, $Stop: $ProductMetadata.Personalization.MaximumSideCount})) {
            if (!$FontMetadata.MonogramStyle) {
                for (var $LineNumber of New_Range({$Start: 1, $Stop: $ProductMetadata.Personalization.MaximumLineCount})) {
                    var $ID = `Side${$SideNumber}Line${$LineNumber}`
                    $Content.push(
                        New_InputText({
                            $ID,
                            $PlaceHolder: $ID,
                            $MaxLength: $FontMetadata.MaximumCharactersPerLine,
                            $Value: $PersonalizationChargeLineItem ? $PersonalizationChargeLineItem.PropertiesObject[$ID] ? $PersonalizationChargeLineItem.PropertiesObject[$ID] : "" : undefined
                        })
                    )
                }
            } else {
                var $ID = `Side${$SideNumber}Line1`
                $Content.push(
                    New_InputText({
                        $ID,
                        $PlaceHolder: $ID,
                        $MaxLength: 3,
                        $MinLength: $FontMetadata.AllCharactersRequired ? 3 : undefined,
                        $Pattern: $MonogramValidCharactersPatternAttributeRegex,
                        $Value: $PersonalizationChargeLineItem ? $PersonalizationChargeLineItem.PropertiesObject[$ID] ? $PersonalizationChargeLineItem.PropertiesObject[$ID] : "" : undefined
                    })
                )
            }
        }
        
        return $Content
    }
}

async function Invoke_TervisShopifyPOSPersonalizationSave () {
    if (document.querySelector("#ShopifyPOSPersonalizationForm").reportValidity()) {
        var $Cart = await Get_TervisShopifyCart()
        var $SelectedLineItem = await Get_TervisShopifyPOSPersonalizableLineItemSelected()
        var $PersonalizationProperties = await Get_TervisPersonalizationFormProperties()
        var $PersonalizationChargeLineItemQuantity = Get_ElementPropertyValue({
            $QuerySelector: "[title='Quantity of line item to apply personalization to']",
            $PropertyName: "value"
        })
        var $NumberOfPersonalizedSides = Get_TervisPersonalizationNumberSides({$PersonalizationProperties})
        var $LineItemProperties = $PersonalizationProperties

        $LineItemProperties.RelatedLineItemSKU = $SelectedLineItem.sku
        $LineItemProperties.ID = uuidv4()
        
        var $Price
        if ($NumberOfPersonalizedSides === 1) {
            $Price = 5
        } else if ($NumberOfPersonalizedSides === 2) {
            $Price = 7.5
        }

        $Cart = await Add_TervisShopifyCartLineItem({
            $Cart,
            $Price,
            $Quantity: $PersonalizationChargeLineItemQuantity,
            $Title: `Personalization for sku ${$SelectedLineItem.sku} ${$SelectedLineItem.title}`
        })

        var $LineItemIndex = $Cart.line_items.length - 1
        
        $Cart = await Add_TervisShopifyCartLineItemProperties({
            $Cart,
            $LineItemIndex,
            $LineItemProperties
        })

        Receive_TervisShopifyPOSPersonalizableLineItemSelectOnChange()
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
    var $SelectedLineItem = await Get_TervisShopifyPOSPersonalizableLineItemSelected()
    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle ({ $ProductTitle: $SelectedLineItem.title })
    var $ProductMetadata = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    
    var $Properties = {}
    $Properties.ColorName = Get_TervisPersonalizationSelectedColorName()
    var $FontMetadata = Get_TervisPersonalizationSelectedFontMetadata()
    $Properties.FontName = $FontMetadata.Name

    for (var $SideNumber of New_Range({$Start: 1, $Stop: $ProductMetadata.Personalization.MaximumSideCount})) {
        if (!$FontMetadata.MonogramStyle) {
            for (var $LineNumber of New_Range({$Start: 1, $Stop: $ProductMetadata.Personalization.MaximumLineCount})) {
                var $ID = `Side${$SideNumber}Line${$LineNumber}`
                var $Value = Get_ElementPropertyValue({$PropertyName: "value", $QuerySelector: `#${$ID}`})
                if ($Value) {
                    $Properties[$ID] = $Value
                }
            }
        } else {
            var $ID = `Side${$SideNumber}Line1`
            var $Value = Get_ElementPropertyValue({$PropertyName: "value", $QuerySelector: `#${$ID}`})
            if ($Value) {
                $Properties[$ID] = $Value
            }
        }
    }
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

    Add_MemberScriptProperty({
        $InputObject: $PersonalizationChargeLineItems,
        $Name: "PropertiesObject",
        $Value: function () { 
            return this.properties.reduce(
                ($FinalReturnValue, $CurrentValue) =>
                ($FinalReturnValue[$CurrentValue.name] = $CurrentValue.value, $FinalReturnValue),
                {}
            )
        }
    })

    return $PersonalizationChargeLineItems
}

// async function Get_TervisShopifyPOSLineItemPersonalizationProperties ({
//     $PersonalizableLineItem
// }) {
//     var $Cart = await Get_TervisShopifyCart()
//     var $PersonalizationChargeLineItems = Get_TervisShopifyPOSPersonalizableLineItemAssociatedPersonalizationChargeLine({
//         $Cart,
//         $PersonalizableLineItem
//     })
    
//     return $PersonalizationChargeLineItems.length > 0 ?
//         $PersonalizationChargeLineItems.map(
//             $PersonalizationChargeLineItem => {
//                 return Get_PersonalizationPropertiesFromPersonalizationChargeLineItem({$PersonalizationChargeLineItem})
//             }
//         ) :
//         undefined
// }

// function Get_PersonalizationPropertiesFromPersonalizationChargeLineItem ({
//     $PersonalizationChargeLineItem
// }) {
//     var $Properties = $PersonalizationChargeLineItem.properties
//     // https://stackoverflow.com/a/44325124/101679
//     .reduce(
//         ($FinalReturnValue, $CurrentValue) =>
//         ($FinalReturnValue[$CurrentValue.name] = $CurrentValue.value, $FinalReturnValue),
//         {}
//     )
//     $Properties.Quantity = $PersonalizationChargeLineItem.quantity
//     return $Properties
// }

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

function Get_TervisPersonalizationSelectedFontName () {
    return Get_ElementPropertyValue({$QuerySelector: "[title='Font Name']", $PropertyName: "value"})
}

function Get_TervisPersonalizationSelectedColorName () {
    return Get_ElementPropertyValue({$QuerySelector: "[title='Color Name']", $PropertyName: "value"})
}

function Get_TervisPersonalizationSelectedFontMetadata () {
    var $FontName = Get_TervisPersonalizationSelectedFontName()
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
    $OnChange
}) {
    return html`
        <select
            id=${ifDefined($ID)}
            title=${ifDefined($Title)}
            @change=${$OnChange}
        >
        <option selected disabled>${$Title}</option>
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

// https://stackoverflow.com/a/2117523/101679
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

main ()

// function getPersonalizeItConfig() {
//     return {
//         "restrictionUrl": "c:\\Program Files\\nChannel\\Personalize\\PersonalizationGuidelines.html",
//     };
// }