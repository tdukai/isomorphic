"use strict";

const ContactsItemModel = require('./contactsItemModel.js');
const ContactsDetailModel = require('./contactsDetailModel.js');

/* Transform the contact */
const getContact = function getContact (item) {
    var result;
    if (item.contact) {
        result = {
            id: item.contact.contactId,
            firstName: item.contact.firstName,
            lastName: item.contact.lastName,
            emails: item.contact.emails,
            phones: item.contact.phones,
            activites: item.count,
            date: item.touchpoint.modified_date
        };
        // Check if resource available
        if (item.touchpoint && item.touchpoint.resource && item.touchpoint.resource.resource_details) {
            const res = item.touchpoint.resource.resource_details;
            result.address = [res.address.line, res.address.city, res.address.state_code, res.address.postal_code].join(', ');
            result.mprId = res.mpr_id;
            result.listingId = res.master_listing_id;
            result.url = res.web_url;
            result.message = item.touchpoint.message.body;
            result.mode = 'INQUIRY';
        } else {
            result.message = item.touchpoint.message.body;
            result.mode = 'CONTACT';
        }
    }
    return result;
};

/**
* Business logic object for contacts
*
* @class Transform
* @constructor
* @return {function} 
*/
class Transform {

    /**
    * Transforming search entities
    *
    * @method list
    * @param {object} data - Generic response from service
    * @return {data} - formatted data
    */
    list (data) {
        if (data && Array.isArray(data.contacts)) {
            let contacts = [];
            data.contacts.forEach(function (item) {
                if (item.contact) {
                    contacts.push(new ContactsItemModel(getContact(item)));
                }
            });
            data.contacts = contacts;
        }
        return data;
    }

    /**
    * Transforming detail result
    *
    * @method detail
    * @param {object} data - Generic response from service
    * @return {data} - formatted data
    */
    detail (data) {
        var result;
        if (data) {
            result = new ContactsDetailModel(getContact(data));
            if (data.contact) {
                result.socialMedia = data.contact.social_media;
            }
            // Get property
            if (data.touchpoint && data.touchpoint.resource && data.touchpoint.resource.resource_details) {
                var res = data.touchpoint.resource.resource_details;
                result.price = res.price;
                result.bed = res.beds;
                result.bath = res.baths;
                result.sqft = res.sqft;
                result.status = res.status;
                result.mlsId = res.mls_id;
                result.photo = res.photo ? res.photo.href : '/images/coming-soon.svg';
                result.note = res.note;
                if (res.agent) {
                    result.agentName = res.agent.name;
                    result.agentEmail = res.agent.email;
                }
                if (res.broker) {
                    result.brokerName = res.broker.name;
                    result.brokerPhone = res.broker.phone1 ? res.broker.phone1.number : undefined;
                }
            }
            result.paging = {}; // Empty paging for details
        }
        return result;
    }
}

module.exports = Transform;