import {
    html,
    render,
    directive
} from 'https://unpkg.com/lit-html?module'

var $Content = html`
<link rel="stylesheet" type="text/css" href="/static/css/compiled/catalyst/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="/static/css/compiled/catalyst/bootstrap-responsive.css" />
<script type='text/javascript'>
function getItemHash(item) {
    var oldHash = {};
    if (item.properties) {
        for (var j = 0; j < item.properties.length; ++j) {
            oldHash[item.properties[j].name]= item.properties[j].value;
        }
    }
    return oldHash;
}

function getPersonalizeItConfig() {
    return {
        "skus": {
            "sku1": "093597845116",
            "sku2": "093597845123"
        },
        "cups": [
            {
                "size": "6",
                "category": "sip",
                "sideCount": "1"
            },
            {
                "size": "10",
                "category": "dwt",
                "sideCount": "2"
            },
            {
                "size": "10",
                "category": "wav",
                "sideCount": "2"
            },
            {
                "size": "12",
                "category": "dwt",
                "sideCount": "2"
            },
            {
                "size": "12",
                "category": "stl",
                "sideCount": "2"
            },
            {
                "size": "16",
                "category": "dwt",
                "sideCount": "2"
            },
            {
                "size": "16",
                "category": "gob",
                "sideCount": "2"
            },
            {
                "size": "16",
                "category": "mug",
                "sideCount": "2"
            },
            {
                "size": "16",
                "category": "beer",
                "sideCount": "2"
            },
            {
                "size": "24",
                "category": "dwt",
                "sideCount": "2"
            },
            {
                "size": "24",
                "category": "wb",
                "sideCount": "2"
            },
            {
                "size": "24",
                "category": "swb",
                "sideCount": "2"
            },
            {
                "size": "87",
                "category": "ice",
                "sideCount": "1"
            }
        ],
        "colors": [
            {
                "name": "Black",
                "red": "0",
                "green": "0",
                "blue": "0"
            },
            {
                "name": "Chocolate",
                "red": "210",
                "green": "105",
                "blue": "30"
            },
            {
                "name": "Fuchsia",
                "red": "201",
                "green": "0",
                "blue": "98"
            },
            {
                "name": "Green",
                "red": "0",
                "green": "128",
                "blue": "0"
            },
            {
                "name": "Hunter",
                "red": "3",
                "green": "86",
                "blue": "66"
            },
            {
                "name": "Navy",
                "red": "0",
                "green": "0",
                "blue": "128"
            },
            {
                "name": "Orange",
                "red": "255",
                "green": "165",
                "blue": "0"
            },
            {
                "name": "Purple",
                "red": "128",
                "green": "0",
                "blue": "128"
            },
            {
                "name": "Red",
                "red": "183",
                "green": "18",
                "blue": "52"
            },
            {
                "name": "Royal Blue",
                "red": "18",
                "green": "51",
                "blue": "168"
            },
            {
                "name": "Turquoise",
                "red": "0",
                "green": "128",
                "blue": "128"
            },
            {
                "name": "White",
                "red": "255",
                "green": "255",
                "blue": "255"
            },
            {
                "name": "Yellow",
                "red": "255",
                "green": "204",
                "blue": "0"
            }
        ],
        "fonts": [
            {
                "name": "Script",
                "cups": [
                    {
                        "size": "10",
                        "category": "dwt",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "10",
                        "category": "wav",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "12",
                        "category": "dwt",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "12",
                        "category": "stl",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "dwt",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "gob",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "mug",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "beer",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "24",
                        "category": "dwt",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "24",
                        "category": "wb",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "24",
                        "category": "swb",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    }
                ]
            },
            {
                "name": "Block U/L",
                "cups": [
                    {
                        "size": "10",
                        "category": "dwt",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "10",
                        "category": "wav",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "12",
                        "category": "dwt",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "12",
                        "category": "stl",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "dwt",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "gob",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "mug",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "16",
                        "category": "beer",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "24",
                        "category": "dwt",
                        "lines": "3",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "24",
                        "category": "wb",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    },
                    {
                        "size": "24",
                        "category": "swb",
                        "lines": "2",
                        "minCharacters": "0",
                        "maxCharacters": "13"
                    }
                ]
            },
            {
                "name": "Monogram",
                "cups": [
                    {
                        "size": "6",
                        "category": "sip",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "10",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "10",
                        "category": "wav",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "12",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "12",
                        "category": "stl",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "gob",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "mug",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "beer",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "wb",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "swb",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "87",
                        "category": "ice",
                        "lines": "1",
                        "minCharacters": "3",
                        "maxCharacters": "3"
                    }
                ]
            },
            {
                "name": "Initials Block",
                "cups": [
                    {
                        "size": "10",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "10",
                        "category": "wav",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "12",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "12",
                        "category": "stl",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "gob",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "mug",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "beer",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "wb",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "swb",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    }
                ]
            },
            {
                "name": "Initials Script",
                "cups": [
                    {
                        "size": "10",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "10",
                        "category": "wav",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "12",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "12",
                        "category": "stl",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "gob",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "mug",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "16",
                        "category": "beer",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "dwt",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "wb",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    },
                    {
                        "size": "24",
                        "category": "swb",
                        "lines": "1",
                        "minCharacters": "0",
                        "maxCharacters": "3"
                    }
                ]
            }
        ],
        "restrictionUrl": "c:\\Program Files\\nChannel\\Personalize\\PersonalizationGuidelines.html",
        "sizeVariants": [
            {
                "size": "10oz (5 1/2\")"
            },
            {
                "size": "12oz (4 1/4\")"
            },
            {
                "size": "16oz (6\")"
            },
            {
                "size": "24oz (7 7/8\")"
            },
            {
                "size": "8oz (4\")"
            },
            {
                "size": "My First Tervis Sippy Cup (5 1/5\")"
            },
            {
                "size": "Collectible (2 3/4\")"
            },
            {
                "size": "Goblet (7 7/8\")"
            },
            {
                "size": "Mug (5\")"
            },
            {
                "size": "Beer Mug"
            },
            {
                "size": "Stout (3 1/2\")"
            },
            {
                "size": "Tall (6 1/4\")"
            },
            {
                "size": "Water Bottle (10.4\")"
            },
            {
                "size": "Wavy (5 1/2\")"
            },
            {
                "size": "Ice Bucket"
            },
            {
                "size": "Wine Glass"
            },
            {
                "size": "Stemless Wine Glass"
            },
            {
                "size": "Stainless 12oz"
            },
            {
                "size": "Stainless 20oz"
            },
            {
                "size": "Stainless 27oz"
            },
            {
                "size": "Stainless 30oz"
            },
            {
                "size": "Stainless Water Bottle"
            }
        ],
        "returnReasons": [
            {
                "code": "02.100.01",
                "description": "02-Product.100-Weld/Seal.01-Tumbler in Two Pieces"
            },
            {
                "code": "02.100.07",
                "description": "02-Product.100-Weld/Seal.07-Moisture Between Walls"
            },
            {
                "code": "02.110.01",
                "description": "02-Product.110 Cracked.01-Cracked at Weld"
            },
            {
                "code": "02.110.02",
                "description": "02-Product.110 Cracked.02-Stress Cracks"
            },
            {
                "code": "02.110.03",
                "description": "02-Product.110 Cracked.03-Not at weld"
            },
            {
                "code": "02.110.04",
                "description": "02-Product.110 Cracked.04-Lid"
            },
            {
                "code": "02.120.01",
                "description": "02-Product.120 Leak.01-Lid"
            },
            {
                "code": "02.130.01",
                "description": "02-Product.130 Missing Component.01-Lid"
            },
            {
                "code": "02.130.02",
                "description": "02-Product.130 Missing Component.02-Valve"
            },
            {
                "code": "02.130.03",
                "description": "02-Product.130 Missing Component.03-O-ring"
            },
            {
                "code": "02.130.04",
                "description": "02-Product.130 Missing Component.04-Strainer"
            },
            {
                "code": "02.200.02",
                "description": "02-Product.200-Surface.02-Film/Stains"
            },
            {
                "code": "02.200.03",
                "description": "02-Product.200-Surface.03-Sunscreen"
            },
            {
                "code": "02.500.01",
                "description": "02-Product.500-Foreign Object.01-Foreign Object"
            },
            {
                "code": "02.600.01",
                "description": "02-Product.600-Decoration.01-Damaged"
            },
            {
                "code": "02.900.00",
                "description": "02-Product.900-Deformed.00"
            },
            {
                "code": "02.090.90",
                "description": "02-Product.090-Supplier.90-Supplier Defect"
            },
            {
                "code": "02.090.95",
                "description": "02-Product.090-Supplier.95-Poor Thermal Performance"
            },
            {
                "code": "02.090.96",
                "description": "02-Product.090-Supplier.96-Stainless Rattle"
            },
            {
                "code": "02.090.97",
                "description": "02-Product.090-Stainless Lid.97 Stainless Lid Defective"
            }
        ]
    };
}

function getCupPropertiesFromTitle(title) {
    let titleArray = title.split(".");
    return {
        name: `${titleArray[0]}`,
        size: `${titleArray[4]}`,
        category: `${titleArray[1]}`,
    };
}

</script>
<style type='text/css'>
    input[type='text'] {
        width: 100%;
        height: 24px;
    }
</style>
<table id='property-editor' class='table table-striped'>
    <tr>
        <th>PersonalizeIt</th>
    </tr>
    <tr id="noitems"></tr>
    <tr>
       <td><button id='save-button' class='btn btn-success' style='width:100%;'>Save</button></td> 
    </tr>
</table>
<script>
ShopifyPOS.fetchCart({
    success: function(cart) {
        let personalizeItConfig;
        if(!cart.line_items) {
            $("#noitems").append("<td>You have no items in your cart.</td>");
        } else {
            personalizeItConfig = getPersonalizeItConfig();
        }

        for (var i in cart.line_items) {
            var hash = getItemHash(cart.line_items[i]);
            $('#property-editor tr').last().before("<tr><td colspan=3>" + cart.line_items[i].title + "</td></tr>");

            //  Set up font
            let fontNames = [];
            personalizeItConfig.fonts.forEach(font => fontNames.push(font.name));
            $(`<tr><td><select required class=item-${i} id="${i}-font"><option value=""></option></select>`)
                .insertBefore($('#property-editor tr').last());
            // console.log(s);
            fontNames.forEach( fontName => {
                $("<option />", {value: fontName, text: fontName})
                    .appendTo($(`#${i}-font`));
            });

            // Set up color
            let colorNames = [];
            personalizeItConfig.colors.forEach(color => colorNames.push(color.name));
            $(`<tr><td><select required class=item-${i} id="${i}-color"><option value=""></option></select>`)
                .insertBefore($('#property-editor tr').last());
            // console.log(s);
            colorNames.forEach( colorName => {
                $("<option />", {value: colorName, text: colorName})
                    .appendTo($(`#${i}-color`));
            });

            // Based on font and cup, add text lines
            // Get cup props
            // Add text lines per cup props


            var properties = ["Text"];
            for (var j = 0; j < properties.length; ++j) {
                $("<tr><td><input class='item-" + i + "' type='text' placeholder='" + properties[j] + "'/></td></tr>")
                    .insertBefore($('#property-editor tr').last())
                    .find("input")
                    .val(hash[properties[j]]);
            }
        }        
        
        $('#save-button').click(function() {
            $('button, input').prop('disabled', true);
            var additions = [];
            var removals = [];
        
            for (var i in cart.line_items) {
                var newHash = {};
                var oldHash = getItemHash(cart.line_items[i]);
                var toRemove = [];
                $('.item-' + i).each(function() {
                    var key = $(this).attr('placeholder');
                    if ($(this).val() != '' && oldHash[key] != $(this).val())
                        newHash[key] = $(this).val();
                    else if (oldHash[key] && $(this).val() == '') {
                        toRemove.push(key);
                    }
                });
                if (toRemove.length > 0)
                    removals.push({ index: i, removals: toRemove });
                if (Object.keys(newHash).length > 0)
                    additions.push({ index: i, additions: newHash });
            }
            
            var totalToDo = additions.length + removals.length;
            var errorList = [];
            
            var onFinish = function() {
                if (errorList.length == 0) {
                        ShopifyPOS.flashNotice("Successfully modified line item properties!");
                } else {
                        ShopifyPOS.flashNotice("Error updating properties: " + JSON.stringify(errorList));
                }
                ShopifyPOS.Modal.close();
            };
            
            
            if (totalToDo == 0) {
                onFinish();
            } else {
                for (var i = 0; i < additions.length; ++i) {
                    cart.addLineItemProperties(parseInt(additions[i].index), additions[i].additions, {
                        success: function(cart) {
                            if (--totalToDo == 0)
                                onFinish()
                        },
                        error: function(errors) {
                            errorList.push(errors);
                            if (--totalToDo == 0)
                                onFinish();
                        }
                    });
                }
                for (var i = 0; i < removals.length; ++i) {
                    cart.removeLineItemProperties(parseInt(removals[i].index), removals[i].removals, {
                        success: function(cart) {
                            if (--totalToDo == 0)
                                onFinish();
                        },
                        error: function(errors) {
                            errorList.push(errors);
                            if (--totalToDo == 0)
                                onFinish();
                        }
                    });
                }
            }
        });
        
    }
});
</script>
`

render(
    $Content,
    document.querySelector("#content")
)