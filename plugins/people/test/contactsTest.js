"use strict";

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = require('chai').expect;
const mocks = require('./mocks.json');
const ContactsPagingModel = require('../js/contactsPagingModel.js');
const ContactsItemModel = require('../js/contactsItemModel.js');
const ContactsDetailModel = require('../js/contactsDetailModel.js');

function combine (obj1, obj2) {
    const add = function add (target, source) {
        Object.getOwnPropertyNames(source).forEach(function (key) {
            target[key] = source[key];
        });
        return target;
    };
    let result = {};
    obj1 = obj1 || {};
    obj2 = obj2 || {};
    result = add(result, obj1);
    result = add(result, obj2);
    return result;
}

lab.experiment('Paging ', function () {

    lab.test('stepping', function (done) {
        var paging = new ContactsPagingModel(mocks.paging);
        // Check expectations
        expect(paging.hasNext()).to.be.equal(true);        // Count is bigger than page size so it should be ok to go next
        expect(paging.pageCount()).to.be.equal(3);  // Calculates page size: 3 (2 full page + 3)
        expect(paging.next()).to.be.equal(true);           // Step to next page
        expect(paging.page).to.be.equal(2);         // Page 2
        expect(paging.hasPrev()).to.be.equal(true);        // We can go back 
        expect(paging.hasNext()).to.be.equal(true);        // Still one more page to go!
        expect(paging.next()).to.be.equal(true);           // Step to last page
        expect(paging.hasNext()).to.be.equal(false);       // No more pages
        expect(paging.hasPrev()).to.be.equal(true);        // Yeah we can go back
        expect(paging.page).to.be.equal(3);         // Page 3
        expect(paging.hasNext()).to.be.equal(false);       // no more page forward
        expect(paging.prev()).to.be.equal(true);           // We can step back
        expect(paging.page).to.be.equal(2);         // Page 2 again
        expect(paging.first()).to.be.equal(true);          // Step to first page
        expect(paging.page).to.be.equal(1);         // Page 1 again
        expect(paging.hasPrev()).to.be.equal(false);       // Not possible to go back
        // finished testing
        done();
    });

});


lab.experiment('Contacts', function () {

    lab.test('item', function (done) {
        let item = new ContactsItemModel(mocks.contact);
        let d = new Date(item.date);
        let localDate = d.toLocaleDateString();
        // Check expectations
        expect(item.initials()).to.be.equal('JD');          // Initials from first and last name
        expect(item.fullName()).to.be.equal('Jane Doe');    // full name combined from first and last
        expect(item.isInquiry()).to.be.equal(true);                // mode = 'INQUIRY'
        expect(item.isContact()).to.be.equal(false);               // mode != 'CONTACT'
        expect(item.displayDate()).to.be.equal(localDate);  // Local date 

        // finished testing
        done();
    });

    lab.test('detail', function (done) {
        const json = combine(mocks.contact, mocks.detail);
        let entity = new ContactsDetailModel(json);
        let d = new Date(entity.date);
        let localDate = d.toLocaleDateString();
        // Check expectations for inherited component
        expect(entity.initials()).to.be.equal('JD');          // Initials from first and last name
        expect(entity.fullName()).to.be.equal('Jane Doe');    // full name combined from first and last
        expect(entity.isInquiry()).to.be.equal(true);                // mode = 'INQUIRY'
        expect(entity.isContact()).to.be.equal(false);               // mode != 'CONTACT'
        expect(entity.displayDate()).to.be.equal(localDate);  // Local date

        // Check expectations for the other elements
        expect(entity.displayPrice()).to.be.equal('$350,000.00');   // Price formatted
        expect(entity.displayBed()).to.be.equal('4');               // Bed formatted
        expect(entity.displayBath()).to.be.equal('3');              // Bath formatted
        expect(entity.displaySqft()).to.be.equal('2,541');          // Sqft formatted

        // Empty out the values
        entity.price = null;
        entity.bed = null;
        entity.bath = undefined;
        entity.sqft = undefined;
        expect(entity.displayPrice()).to.be.equal('$n/a');          // handle empty
        expect(entity.displayBed()).to.be.equal('n/a');             // handle empty
        expect(entity.displayBath()).to.be.equal('n/a');            // handle empty
        expect(entity.displaySqft()).to.be.equal('n/a');            // handle empty

        // finished testing
        done();
    });

});