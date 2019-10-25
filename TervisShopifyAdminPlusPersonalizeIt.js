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

var $ItemSKUToAddToCartForOneSidedPersonaliztaion = "093597845116"
var $ItemSKUToAddToCartForTwoSidedPersonaliztaion = "093597845123"

async function main () {
    Initialize_TervisShopifyPOSPersonalizationFormStructure()
    Receive_ShopifyPOSPersonalizationCart()
}

function Initialize_TervisShopifyPOSPersonalizationFormStructure () {
    Set_ContainerContent({
        $TargetElementSelector: "#content",
        $Content: html`
            <div id="LineItemSelectContainer"></div>
            <div id="PersonalizationFormContainer"></div>
            <button
                type="button"
                @click=${Invoke_TervisShopifyPOSPersonalizationSave}
            >Save</button>
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
    // var $Cart = await Get_TervisShopifyCart()
    Set_ContainerContent({
        $TargetElementSelector: "#FontSelectContainer",
        $Content: html`${JSON.stringify(ShopifyPOS)}`
    })
    // New_TervisShopifyPOSPersonalizableLineItemSelect()
}

async function New_TervisShopifyPOSPersonalizableLineItemSelect () {
    var $Cart = await Get_TervisShopifyCart()
    var $PersonalizableLineItems = $Cart.line_items.filter(
        $LineItem => $LineItem.sku.slice(-1) === "P"
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
    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle ({ $ProductTitle: $SelectedLineItem.title })

    Set_ContainerContent({
        $TargetElementSelector: "#FontSelectContainer",
        $Content: await New_TervisPersonalizationFontPicker({$ProductSize, $ProductFormType})
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
    $ProductFormType
}) {
    var $ProductMetadata = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    var $FontNames = $ProductMetadata.Personalization.SupportedFontName
    return New_TervisSelect({
        $Title: "Font Name",
        $Options: $FontNames.map( $FontName => ({Text: $FontName}) ),
        $OnChange: Receive_TervisPersonalizationFontPickerOnChange
    })
}

async function Receive_TervisPersonalizationFontPickerOnChange () {
    New_TervisPersonalizationSideAndLineElement()
}

async function New_TervisPersonalizationSideAndLineElement () {
    var $FontMetadata = Get_TervisPersonalizationSelectedFontMetadata()
    if ($FontMetadata) {
        var $SelectedLineItem = await Get_TervisShopifyPOSLineItemSelected()
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
                    $Content.push(New_InputText({$ID, $PlaceHolder: $ID, $MaxLength: $FontMetadata.MaximumCharactersPerLine}))
                }
            } else {
                var $ID = `Side${$SideNumber}Line1`
                $Content.push(New_InputText({$ID, $PlaceHolder: $ID, $MaxLength: 3}))
            }
        }
        
        Set_ContainerContent({$TargetElementSelector: "#LineTextBoxContainer", $Content})    
    }
}

async function Invoke_TervisShopifyPOSPersonalizationSave () {
    var $Cart = await Get_TervisShopifyCart()
    var $LineItemIndex = Get_TervisShopifyPOSPersonalizationLineItemSelectedIndex()
    var $PersonalizationProperties = await Get_TervisPersonalizationFormProperties()  
    
    $Cart.addLineItemProperties(
        $LineItemIndex,
        $PersonalizationProperties
    )
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

var $MonogramValidCharactersPatternAttributeRegex = "[a-zA-Z]*"

function New_InputText ({
    $ID,
    $PlaceHolder,
    $MaxLength,
    $Required,
    $Pattern,
    $OnChange
}) {
    return html`
    <input
        id="${ifDefined($ID)}"
        type="text"
        maxlength="${ifDefined($MaxLength)}"
        ?required=${$Required}
        pattern="${ifDefined($Pattern)}"
        placeholder="${ifDefined($PlaceHolder)}"
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
                $Option => html`<option .value=${ifDefined($Option.Value)}>${$Option.Text}</option>`
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

var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
if (isChrome) {
    var ShopifyPOS = {
        fetchCart: function ({
            success,
            error
        }) {
            success(
                {
                    line_items: [
                        {
                            title: "CLEAR.DWT.CL1.NA.16.OZ.EA.NA",
                            sku: "1001837P"
                        },
                        {
                            title: "CLEAR.ICE.CL1.NA.87.OZ.BX.NA",
                            sku: "1001842P"
                        }
                    ],
                    addLineItemProperties: function (
                        $LineItemIndex,
                        $Properties
                    ) {
                        localStorage.setItem($LineItemIndex, JSON.stringify($Properties, undefined, 2))
                    }
                }
            )
        }
    }
}

async function Get_TervisShopifyCart () {
    return new Promise((resolve, reject) => {
        ShopifyPOS.fetchCart({
            success: resolve,
            error: reject
        })
    })
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

