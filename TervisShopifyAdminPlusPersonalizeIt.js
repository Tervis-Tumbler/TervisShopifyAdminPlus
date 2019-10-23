import {
    html,
    render
} from 'https://unpkg.com/lit-html?module'

import {
    Get_TervisProductMetaDataUsingIndex
} from 'https://unpkg.com/@tervis/tervisproductmetadata?module'

var $ItemSKUToAddToCartForOneSidedPersonaliztaion = "093597845116"
var $ItemSKUToAddToCartForTwoSidedPersonaliztaion = "093597845123"

function ConvertFrom_TervisShopifyPOSProductTitle ({
    $ProductTitle
}) {
    var [,$ProductFormType,,,$ProductSize] = $ProductTitle.split(".")
    return {$ProductSize, $ProductFormType}
}

async function New_PersonalizationCartLineItemForm ({
    $LineItem
}) {
    var {
        $ProductSize,
        $ProductFormType
    } = ConvertFrom_TervisShopifyPOSProductTitle ({ $ProductTitle: $LineItem.title })

    // var $ProductMetadata = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})

    return html`
        ${await New_TervisPersonalizationFontPicker({$ProductSize, $ProductFormType})}
    `
}

function Receive_TervisPersonalizationFontPickerOnChange () {
    //trigger rerender of the lines controls as based on the font there will be different numbers of lines available/characters available for monogram
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
                $Option => html`<option>${$Option}</option>`
            )
        }
        </select>
    `
}

async function New_TervisPersonalizationFontPicker ({
    $ProductSize,
    $ProductFormType
}) {
    var $ProductMetadata = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    var $FontNames = $ProductMetadata.Personalization.Font.Name
    return New_TervisSelect({
        $Title: "Font Name",
        $Options: $FontNames,
        $OnChange: Receive_TervisPersonalizationFontPickerOnChange
    })
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

function Receive_TervisPersonalizationLineItemSelectOnChange () {

}

async function Receive_ShopifyPOSPersonalizationCart ( $Cart ) {
    // var $ContentArray = []
    var $PersonalizableLineItems = $Cart.line_items.filter(
        $LineItem => $LineItem.sku.slice(-1) === "P"
    )

    // var $SelectLineItemContent = New_TervisSelect({
    //     $Title: "Select Line Item To Personalize",
    //     $Options: $PersonalizableLineItems,
    //     $OnChange: Receive_TervisPersonalizationLineItemSelectOnChange
    // })

    // $ContentArray.push($SelectLineItemContent)

    var $ContentPromises = $PersonalizableLineItems.map(
        $LineItem => New_PersonalizationCartLineItemForm({$LineItem})
    )
    var $ContentArray = await Promise.all($ContentPromises)
    // $ContentArray = $ContentArray.concat()

    Set_ContainerContent({
        $TargetElementSelector: "#content",
        $ContentArray
    })

    // Set_ContainerContent({
    //     $TargetElementSelector: "#content",
    //     $Content: html`Hello World ${JSON.stringify($PersonalizableLineItems)}`
    // })

    // if(!$Cart.line_items) {
    //     ShopifyPOS.flashError("You have no items in your cart.")
    //     ShopifyPOS.Modal.close()
    // }

    // var personalizeItConfig = getPersonalizeItConfig();

    // for (var i in $Cart.line_items) {
    //     var hash = getItemHash($Cart.line_items[i]);
    //     $('#property-editor tr').last().before("<tr><td colspan=3>" + $Cart.line_items[i].title + "</td></tr>");

    //     //  Set up font
    //     let fontNames = [];
    //     personalizeItConfig.fonts.forEach(font => fontNames.push(font.name));
    //     $(`<tr><td><select required class=item-${i} id="${i}-font"><option value=""></option></select>`)
    //         .insertBefore($('#property-editor tr').last());
    //     // console.log(s);
    //     fontNames.forEach( fontName => {
    //         $("<option />", {value: fontName, text: fontName})
    //             .appendTo($(`#${i}-font`));
    //     });

    //     // Set up color
    //     let colorNames = [];
    //     personalizeItConfig.colors.forEach(color => colorNames.push(color.name));
    //     $(`<tr><td><select required class=item-${i} id="${i}-color"><option value=""></option></select>`)
    //         .insertBefore($('#property-editor tr').last());
    //     // console.log(s);
    //     colorNames.forEach( colorName => {
    //         $("<option />", {value: colorName, text: colorName})
    //             .appendTo($(`#${i}-color`));
    //     });

    //     // Based on font and cup, add text lines
    //     // Get cup props
    //     // Add text lines per cup props


    //     var properties = ["Text"];
    //     for (var j = 0; j < properties.length; ++j) {
    //         $("<tr><td><input class='item-" + i + "' type='text' placeholder='" + properties[j] + "'/></td></tr>")
    //             .insertBefore($('#property-editor tr').last())
    //             .find("input")
    //             .val(hash[properties[j]]);
    //     }
    // }

    // $('#save-button').click(function() {
    //     $('button, input').prop('disabled', true);
    //     var additions = [];
    //     var removals = [];

    //     for (var i in $Cart.line_items) {
    //         var newHash = {};
    //         var oldHash = getItemHash($Cart.line_items[i]);
    //         var toRemove = [];
    //         $('.item-' + i).each(function() {
    //             var key = $(this).attr('placeholder');
    //             if ($(this).val() != '' && oldHash[key] != $(this).val())
    //                 newHash[key] = $(this).val();
    //             else if (oldHash[key] && $(this).val() == '') {
    //                 toRemove.push(key);
    //             }
    //         });
    //         if (toRemove.length > 0)
    //             removals.push({ index: i, removals: toRemove });
    //         if (Object.keys(newHash).length > 0)
    //             additions.push({ index: i, additions: newHash });
    //     }

    //     var totalToDo = additions.length + removals.length;
    //     var errorList = [];

    //     var onFinish = function() {
    //         if (errorList.length == 0) {
    //                 ShopifyPOS.flashNotice("Successfully modified line item properties!");
    //         } else {
    //                 ShopifyPOS.flashNotice("Error updating properties: " + JSON.stringify(errorList));
    //         }
    //         ShopifyPOS.Modal.close();
    //     };


    //     if (totalToDo == 0) {
    //         onFinish();
    //     } else {
    //         for (var i = 0; i < additions.length; ++i) {
    //             $Cart.addLineItemProperties(parseInt(additions[i].index), additions[i].additions, {
    //                 success: function($Cart) {
    //                     if (--totalToDo == 0)
    //                         onFinish()
    //                 },
    //                 error: function(errors) {
    //                     errorList.push(errors);
    //                     if (--totalToDo == 0)
    //                         onFinish();
    //                 }
    //             });
    //         }
    //         for (var i = 0; i < removals.length; ++i) {
    //             $Cart.removeLineItemProperties(parseInt(removals[i].index), removals[i].removals, {
    //                 success: function($Cart) {
    //                     if (--totalToDo == 0)
    //                         onFinish();
    //                 },
    //                 error: function(errors) {
    //                     errorList.push(errors);
    //                     if (--totalToDo == 0)
    //                         onFinish();
    //                 }
    //             });
    //         }
    //     }
    // });
}

// ShopifyPOS.fetchCart({
//     success: Receive_ShopifyPOSPersonalizationCart
// });

Receive_ShopifyPOSPersonalizationCart(
    {
        line_items: [
            {
                title: "CLEAR.DWT.CL1.NA.16.OZ.EA.NA",
                sku: "1234P"
            }
        ]
    }
)

// function getItemHash(item) {
//     var oldHash = {};
//     if (item.properties) {
//         for (var j = 0; j < item.properties.length; ++j) {
//             oldHash[item.properties[j].name]= item.properties[j].value;
//         }
//     }
//     return oldHash;
// }


// var $ProductMetaData = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})

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

