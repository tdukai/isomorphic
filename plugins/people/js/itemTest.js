/*global move, document, dust, $ */
"use strict";

var _ajax = new move.RealAjax();
$(document).ready(function () {
    var data = {
        "id": "b91265a0-3dee-4e02-9166-d532d22d88e5",
        "firstName": "Dante",
        "lastName": "Canizares",
        "emails": [
            {
                "email": "dante.canizares@move.com"
            }
        ],
        "phones": [
            {
                "phoneSearch": "6042708819",
                "phone": "(604) 270-8819",
                "verified": true,
                "description": "mobile"
            }
        ],
        "activites": 1,
        "date": "2015-12-05T01:31:22Z",
        "address": "2343 E 17th St Unit 313, Long Beach, CA, 90804",
        "mprId": "1018761864",
        "listingId": "589564160",
        "url": "http://qam.www.realtor.com/realestateandhomes-detail/M10187-61864",
        "message": "I would like more information regarding the property at 2343 E 17th St Unit 313 that I found on realtor.com\r\n\r\nhttp://rdc-next-f9.move.com/realestateandhomes-detail/2343-E-17th-St-Unit-313_Long-Beach_CA_90804_M10187-61864\r\n\r\nTesting",
        "mode": "INQUIRY"
    };

    // Load initial json data
    $('#json').val(JSON.stringify(data, null, 4));
    // DUST onload event to retrieve latest version of the template
    dust.onLoad = function dustLoad (templateName, options, callback) {
        _ajax.get(['/restricted/contacts/assets/view/', templateName].join(''), function (response) {
            callback(null, response);
        }, function (err) {
            callback(err);
        });
    };

    $('#render').on('click', function () {
        try {
            var data = JSON.parse($('#json').val());
            var model = new move.ContactsItemModel(data);
            dust.render('contacts-item.dust', model, function (err, out) {
                if (err !== null) {
                    console.error(err);
                } else {
                    $('#test-container').off().html('').append(out);
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    });
});
