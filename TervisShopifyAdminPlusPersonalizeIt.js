import {
    html,
    render
} from 'https://unpkg.com/lit-html?module'

import {
    ifDefined
} from 'https://unpkg.com/lit-html@1.1.2/directives/if-defined.js?module'

import {
    Get_TervisProductMetaDataUsingIndex
} from 'https://unpkg.com/@tervis/tervisproductmetadata?module'

import {
    New_Range
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
                <div id="PersonalizationFormContainer"></div>
                <button
                    type="button"
                    @click=${Invoke_TervisShopifyPOSPersonalizationSave}
                >Save</button>
                <div id="Debug"></div>
            </form>
        `
    })

    Initialize_TervisPersonalizationFormStructure({$TargetElementSelector: "#PersonalizationFormContainer"})
}

function Initialize_TervisPersonalizationFormStructure ({
    $TargetElementSelector
}) {
    Set_ContainerContent({
        $TargetElementSelector,
        $Content: html`
            <div id="FontSelectContainer"></div>
            <div id="LineTextBoxContainer"></div>
        `
    })
}

async function Receive_ShopifyPOSPersonalizationCart () {
    var $Cart = await Get_TervisShopifyCart()
    Out_TervisShopifyPOSDebug({$Object: $Cart})
    New_TervisShopifyPOSPersonalizableLineItemSelect()
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

async function New_TervisShopifyPOSPersonalizableLineItemSelect () {
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizableLineItems = $Cart.line_items.filter(
        $LineItem => $LineItem.sku ? $LineItem.sku.slice(-1) === "P" : undefined
    )

    var $SelectLineItemContent = New_TervisSelect({
        $Title: "Select Line Item To Personalize",
        $Options: $PersonalizableLineItems.map($LineItem => ({Value: $PersonalizableLineItems.indexOf($LineItem), Text: $LineItem.title}) ),
        $OnChange: Receive_TervisPersonalizationLineItemSelectOnChange
    })

    Set_ContainerContent({
        $TargetElementSelector: "#LineItemSelectContainer",
        $Content: $SelectLineItemContent
    })
}

async function Receive_TervisPersonalizationLineItemSelectOnChange () {
    await New_TervisShopifyPOSPersonalizationFontSelect()
    await New_TervisPersonalizationSideAndLineElement()
}

async function New_TervisShopifyPOSPersonalizationFontSelect() {
    var $SelectedLineItem = await Get_TervisShopifyPOSLineItemSelected()
    var $PersonalizationPropertiesFromLineItem = await Get_TervisShopifyPOSLineItemPersonalizationProperites({
        $LineItem: $SelectedLineItem
    })
    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle({ $ProductTitle: $SelectedLineItem.title })

    Set_ContainerContent({
        $TargetElementSelector: "#FontSelectContainer",
        $Content: await New_TervisPersonalizationFontPicker({
            $ProductSize,
            $ProductFormType,
            $SelectedFontName: $PersonalizationPropertiesFromLineItem ?
                $PersonalizationPropertiesFromLineItem.FontName :
                undefined
        })
    })
}

async function Get_TervisShopifyPOSLineItemSelected () {
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
    New_TervisPersonalizationSideAndLineElement()
}

var $MonogramValidCharactersPatternAttributeRegex = "[A-Z]*"

async function New_TervisPersonalizationSideAndLineElement () {
    var $FontMetadata = Get_TervisPersonalizationSelectedFontMetadata()
    if ($FontMetadata) {
        var $SelectedLineItem = await Get_TervisShopifyPOSLineItemSelected()
        var $PersonalizationPropertiesFromLineItem = await Get_TervisShopifyPOSLineItemPersonalizationProperites({
            $LineItem: $SelectedLineItem
        })
        var {
            $ProductSize,
            $ProductFormType
        } = ConvertFrom_TervisShopifyPOSProductTitle ({ $ProductTitle: $SelectedLineItem.title })
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
                            $Value: $PersonalizationPropertiesFromLineItem ? PersonalizationPropertiesFromLineItem[$ID] : undefined
                        }))
                }
            } else {
                var $ID = `Side${$SideNumber}Line1`
                $Content.push(
                    New_InputText({
                        $ID,
                        $PlaceHolder: $ID,
                        $MaxLength: 3,
                        $Pattern: $MonogramValidCharactersPatternAttributeRegex,
                        $Value: $PersonalizationPropertiesFromLineItem ? $PersonalizationPropertiesFromLineItem[$ID] : undefined
                    }))
            }
        }
        
        Set_ContainerContent({$TargetElementSelector: "#LineTextBoxContainer", $Content})    
    }
}

async function Invoke_TervisShopifyPOSPersonalizationSave () {
    if (document.querySelector("#ShopifyPOSPersonalizationForm").reportValidity()) {
        var $Cart = await Get_TervisShopifyCart()
        var $SelectedLineItemIndex = Get_TervisShopifyPOSPersonalizationLineItemSelectedIndex()
        var $SelectedLineItem = await Get_TervisShopifyPOSLineItemSelected()
        var $PersonalizationProperties = await Get_TervisPersonalizationFormProperties()  
        var $NumberOfPersonalizedSides = Get_TervisPersonalizationNumberSides({$PersonalizationProperties})
        var $LineItemProperties = $PersonalizationProperties

        $LineItemProperties.RelatedLineItemSKU = $SelectedLineItem.sku
        
        var $Price
        if ($NumberOfPersonalizedSides === 1) {
            $Price = 5
        } else if ($NumberOfPersonalizedSides === 2) {
            $Price = 7.5
        }

        await Add_TervisShopifyCartLineItem({
            $Cart,
            $Price,
            $Quantity: $SelectedLineItem.quantity,
            $Title: `Personalization for sku ${$SelectedLineItem.sku} ${$SelectedLineItem.title}`
        })

        var $LineItemIndex = $Cart.line_items.length - 1
        
        await Add_TervisShopifyCartLineItemProperties({
            $Cart,
            $LineItemIndex,
            $LineItemProperties
        })

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
    var $SelectedLineItem = await Get_TervisShopifyPOSLineItemSelected()
    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle ({ $ProductTitle: $SelectedLineItem.title })
    var $ProductMetadata = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    
    var $Properties = {}
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

async function Get_TervisShopifyPOSLineItemPersonalizationProperites ({
    $LineItem
}) {
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizationChargeLineItem = $Cart.line_items
        .filter(
            $CartLineItem => {
                if ($CartLineItem.properties) { // remove once https://github.com/tc39/proposal-optional-chaining is live, next line should be $CartLineItem?.properties
                    return $CartLineItem.properties
                        .filter( 
                            $Property =>
                            $Property.name === "RelatedLineItemSKU" &&
                            $Property.value === $LineItem.sku
                        )[0]
                }
            }
        )[0]
    
    // remove terinary once https://github.com/tc39/proposal-optional-chaining is live, next line should be $PersonalizationChargeLineItem?.properties
    return $PersonalizationChargeLineItem ?
        $PersonalizationChargeLineItem.properties
        // https://stackoverflow.com/a/44325124/101679
        .reduce(
            ($FinalReturnValue, $CurrentValue) =>
            ($FinalReturnValue[$CurrentValue.name] = $CurrentValue.value, $FinalReturnValue),
            {}
        ) :
        undefined
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

function Get_TervisPersonalizationSelectedFontName () {
    return Get_ElementPropertyValue({$QuerySelector: "#FontSelectContainer > select", $PropertyName: "value"})
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

function New_InputText ({
    $ID,
    $Value,
    $PlaceHolder,
    $MaxLength,
    $Required,
    $Pattern,
    $OnChange
}) {
    return html`
    <input
        id=${ifDefined($ID)}
        .value=${ifDefined($Value)}
        type="text"
        maxlength=${ifDefined($MaxLength)}
        ?required=${$Required}
        pattern=${ifDefined($Pattern)}
        placeholder=${ifDefined($PlaceHolder)}
        @change=${$OnChange}
    />
    `
}

function New_TervisSelect ({
    $Title,
    $Options,
    $OnChange
}) {
    return html`
        <select
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


// Refactor to TervisShopifyPOS module
function ConvertFrom_TervisShopifyPOSProductTitle ({
    $ProductTitle
}) {
    var [,$ProductFormType,,,$ProductSize] = $ProductTitle.split(".")
    return {$ProductSize, $ProductFormType}
}

main ()

// function getPersonalizeItConfig() {
//     return {

//         "colors": [
//             {
//                 "name": "Black",
//                 "red": "0",
//                 "green": "0",
//                 "blue": "0"
//             },
//             {
//                 "name": "Chocolate",
//                 "red": "210",
//                 "green": "105",
//                 "blue": "30"
//             },
//             {
//                 "name": "Fuchsia",
//                 "red": "201",
//                 "green": "0",
//                 "blue": "98"
//             },
//             {
//                 "name": "Green",
//                 "red": "0",
//                 "green": "128",
//                 "blue": "0"
//             },
//             {
//                 "name": "Hunter",
//                 "red": "3",
//                 "green": "86",
//                 "blue": "66"
//             },
//             {
//                 "name": "Navy",
//                 "red": "0",
//                 "green": "0",
//                 "blue": "128"
//             },
//             {
//                 "name": "Orange",
//                 "red": "255",
//                 "green": "165",
//                 "blue": "0"
//             },
//             {
//                 "name": "Purple",
//                 "red": "128",
//                 "green": "0",
//                 "blue": "128"
//             },
//             {
//                 "name": "Red",
//                 "red": "183",
//                 "green": "18",
//                 "blue": "52"
//             },
//             {
//                 "name": "Royal Blue",
//                 "red": "18",
//                 "green": "51",
//                 "blue": "168"
//             },
//             {
//                 "name": "Turquoise",
//                 "red": "0",
//                 "green": "128",
//                 "blue": "128"
//             },
//             {
//                 "name": "White",
//                 "red": "255",
//                 "green": "255",
//                 "blue": "255"
//             },
//             {
//                 "name": "Yellow",
//                 "red": "255",
//                 "green": "204",
//                 "blue": "0"
//             }
//         ],
//         "restrictionUrl": "c:\\Program Files\\nChannel\\Personalize\\PersonalizationGuidelines.html",
//     };
// }

// function getCupPropertiesFromTitle(title) {
//     let titleArray = title.split(".");
//     return {
//         name: `${titleArray[0]}`,
//         size: `${titleArray[4]}`,
//         category: `${titleArray[1]}`,
//     };
// }



// var $Content = html`
// ${New_TervisPersonalizationFontPicker({$ProductSize, $ProductFormType})}
// <!-- <table id='property-editor' class='table table-striped'>
//     <tr>
//         <th>PersonalizeIt</th>
//     </tr>
//     <tr id="noitems"></tr>
//     <tr>
//         <td>
//            <button id='save-button' class='btn btn-success' style='width:100%;'>Save</button>
//         </td>
//     </tr>
// </table> -->
// `

// render(
//     $Content,
//     document.querySelector("#content")
// )

