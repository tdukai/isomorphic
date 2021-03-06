/*global window, tools, bimo */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
    isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var Model = isNode ? require('bimo').Model : bimo.Model;
var Format = isNode ? require('./format.js') : tools.Format;


/**
* PageModel 
* @class models.PageModel
* @constructor
*/
var PageModel = function (data) {
    Model.call(this, data);
    this.counts = new Model(data.counts);
    this._format = new Format();
};

PageModel.prototype = Object.create(Model.prototype);
PageModel.constructor = Model;

/* Check mode */
/*
PageModel.prototype.isDashboard = function isDashboard () {
    return (this.mode === 'dashboard');
};

PageModel.prototype.isSearch = function isSearch () {
    return (this.mode === 'search');
};

/* Format the count */
PageModel.prototype.formatCount = function formatCount(name) {
    var result = 'na';
    if (this.counts && this.counts[name]) {
        result = this._format.addSeparators(this.counts[name]);
    }
    return result;
};

PageModel.prototype.userCount = function userCount() {
    return this.formatCount('total');
};

PageModel.prototype.femaleCount = function femaleCount() {
    return this.formatCount('female');
};

PageModel.prototype.maleCount = function maleCount() {
    return this.formatCount('male');
};

PageModel.prototype.countryCount = function countryCount() {
    return this.formatCount('country');
};

PageModel.prototype.regionCount = function regionCount() {
    return this.formatCount('region');
};

PageModel.prototype.cityCount = function cityCount() {
    return this.formatCount('city');
};

PageModel.prototype.divorcedPercent = function divorcedPercent () {
    var result = 'na';
    if (this.counts && this.counts.total && this.counts.divorced) {
        result = ((this.counts.divorced / this.counts.total) * 100).toFixed(1) + '%';
    }
    return result;
};

if (isBrowser) {
    window.models = window.models || {};
    window.models.PageModel = PageModel;
} else if (isNode) {
    module.exports = PageModel;
}
/*global window, module */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
 isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

/**
* Contacts single item model
* @class ContactsItemModel
* @constructor
*/
var ContactsItemModel = function (data) {
    data = data || {};
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            this[key] = data[key];
        }
    }
};


/* Provides initals for contact icon */
ContactsItemModel.prototype.initials = function initials () {
    var result = '';
    if (this.firstName) {
        result += this.firstName.substring(0, 1).toUpperCase();
    }
    if (this.lastName) {
        result += this.lastName.substring(0, 1).toUpperCase();
    }
    if (result === '') {
        result = '??';
    }
    return result;
};

/* Provides full name */
ContactsItemModel.prototype.fullName = function fullName () {
    var result = 'n/a';
    if (this.firstName && this.lastName) {
        result = [this.firstName, this.lastName].join(' ');
    }
    return result;
};

/* Checks if mode is inquiry */
ContactsItemModel.prototype.isInquiry = function isInquiry () {
    return (this.mode === 'INQUIRY');
};

/* Checks if mode is contact */
ContactsItemModel.prototype.isContact = function isContact () {
    return (this.mode === 'CONTACT');
};

/* Displays proper date format */
ContactsItemModel.prototype.displayDate = function displayDate () {
    var result;
    if (this.date) {
        var d = new Date(this.date);
        result = d.toLocaleDateString();
    }
    return result;
};


if (isBrowser) {
    window.move = window.move || {};
    window.move.ContactsItemModel = ContactsItemModel;
} else if (isNode) {
    module.exports = ContactsItemModel;
}
/*global window, module */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
 isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

/**
* Contacts single paging model
* @class ContactsPagingModel
* @constructor
*/
var ContactsPagingModel = function (data) {
    data = data || {};
    this.page = data.page ? parseInt(data.page, 10) : 0;
    this.size = data.size ? parseInt(data.size, 10) : 0;
    this.sort = data.sort || '';
    this.count = data.count || 0;
};

/* Calculate page count */
ContactsPagingModel.prototype.pageCount = function pageCount () {
    var result = this.count / this.size;
    if (this.count <= this.size) {
        result = 1;
    } else {
        result = Math.floor(this.count / this.size);
        var r = this.count % this.size; 
        if (r > 0) {
            result++;
        }
    }
    return result;
};

/* Check if multiple pages exists */
ContactsPagingModel.prototype.hasNext = function hasNext () {
    return (this.page < (this.count / this.size));
};

/* Checks if we are on next page */
ContactsPagingModel.prototype.hasPrev = function hasPrev () {
    return (this.page > 1);
};

/* Next page */
ContactsPagingModel.prototype.next = function next () {
    var result = false;
    if (this.page < this.pageCount()) {
        this.page++;
        result = true;
    }
    return result;
};

/* Previous page */
ContactsPagingModel.prototype.prev = function prev() {
    var result = false;
    if (this.page > 1) {
        this.page--;
        result = true;
    }
    return result;
};

/* First page */
ContactsPagingModel.prototype.first = function first () {
    this.page = 1;
    return true;
};

/* Last page */
ContactsPagingModel.prototype.last = function last () {
    this.page = this.pageCount();
    return true;
};

if (isBrowser) {
    window.move = window.move || {};
    window.move.ContactsPagingModel = ContactsPagingModel;
} else if (isNode) {
    module.exports = ContactsPagingModel;
}

/*global window, module, move */
"use strict";

var isBrowser = (typeof window !== 'undefined'),
 isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');
var ContactsItemModel = isNode ? require('./contactsItemModel.js') : move.ContactsItemModel;

/**
* Contact detail model
* @class ContactsDetailModel
* @constructor
*/
var ContactsDetailModel = function (data) {
    ContactsItemModel.call(this, data);
    this.isDetail = true;
};

ContactsDetailModel.prototype = Object.create(ContactsItemModel.prototype);
ContactsDetailModel.constructor = ContactsItemModel;

/* Adds commas to numbers (thousand separator) */
ContactsDetailModel.prototype.addCommas = function addCommas (number) {
    var regex = /(\d+)(\d{3})/;
    number = number === undefined ? 0 : number;
    number = number.toString();
    while (regex.test(number)) {
        number = number.replace(regex, '$1' + ',' + '$2');
    }
    return number;
};

/* Display price */
ContactsDetailModel.prototype.displayPrice = function displayPrice () {
    var result = '$n/a';
    if (typeof this.price === 'number') {
        result = '$' + this.addCommas(this.price.toFixed(2));
    }
    return result;
};

/* Display beds */
ContactsDetailModel.prototype.displayBed = function displayBed () {
    var result = 'n/a';
    if (typeof this.bed === 'number') {
        result = this.bed.toString();
    }
    return result;
};

/* Display baths */
ContactsDetailModel.prototype.displayBath = function displayBath () {
    var result = 'n/a';
    if (typeof this.bath === 'number') {
        result = this.bath.toString();
    }
    return result;
};

/* Display sqft */
ContactsDetailModel.prototype.displaySqft = function displaySqft () {
    var result = 'n/a';
    if (typeof this.sqft === 'number') {
        result = this.addCommas(this.sqft);
    }
    return result;
};

if (isBrowser) {
    window.move = window.move || {};
    window.move.ContactsDetailModel = ContactsDetailModel;
} else if (isNode) {
    module.exports = ContactsDetailModel;
}
/*global window, document, $, dust, move, alert */
"use strict";

/**
* Contacts client side page level object
* @class Contacts
* @constructor
*/
var ContactsPage = function (options) {
    var self = this,
    _ajax = new move.RealAjax(),
    _oldUrl = null,
    _selected = null,
    _url = new move.RealUrl(),
    _view,
    _scroll = null,
    _paging,
    DEFAULT_PAGING = {
        page: 1,
        size: 10,
        sort: 'newest'
    },
    displayError,
    displayNotImplemented,
    displayList,
    displayDetail,
    renderMenu,
    renderContacts,
    renderDetail,
    updatePaging,
    sortChanged,
    pageChanged,
    contactClicked,
    backToListClicked,
    requestList,
    requestListCompleted,
    requestDetail,
    requestDetailCompleted;

    /* Displays error on console */
    displayError = function (err) {
        if (console) {
            console.error(err);
        }
    };

    /* Shows not implemented */
    displayNotImplemented = function displayNotImplemented (e) {
        e.preventDefault();
        e.stopPropagation();
        alert('Not Implemented yet');
        if (console) {
            console.log('Not Implemented yet');
        }
    };

    /* Changes mode between list and detail */
    displayList = function displayList () {
        _view = 'list';
        // Hide detail, show search
        self.dom.detailContainer.hide();
        self.dom.listContainer.show();
        // Restore url
        if (_oldUrl !== null) {
            _url.update({}, _oldUrl);
            _oldUrl = null;
        }
        if (_scroll !== null) {
            self.dom.document.scrollTop(_scroll);
            _scroll = null;
        }
    };

    /* Changes mode between list and detail */
    displayDetail = function displayDetail () {
        _view = 'detail';
        _scroll = self.dom.document.scrollTop();
        if (typeof _selected === 'string') {
            _oldUrl = window.location.href;
            var newUrl = _url.host('/contact-detail/' + _selected);
            _url.update({}, newUrl);
        }
        self.dom.listContainer.hide();
        self.dom.detailContainer.show();
        self.dom.document.scrollTop(0);
    };

    /* Renders the top menu */
    renderMenu = function (err, out) {
        self.dom.menu = self.dom.menu || $('#widget--menu-widget');
        if (err !== null) {
            displayError(err);
        } else {
            self.dom.menu.html('').append(out);
        }
    };

    /* Render contact items */
    renderContacts = function renderContacts (err, out) {
        self.dom.contacts = self.dom.contacts || $('#contacts-items');
        if (err !== null) {
            displayError(err);
        } else {
            self.dom.contacts.html('').append(out);
        }
    };

    renderDetail = function renderDetail (err, out) {
        self.dom.detailContainer = self.dom.detailContainer || $('#detail-container');
        if (err !== null) {
            displayError(err);
        } else {
            self.dom.detailContainer.html('').append(out);
            displayDetail();
        }
    };

    /* Update paging */
    updatePaging = function updatePaging () {
        _url.update({
            page: _paging.page,
            size: _paging.size,
            sort: _paging.sort
        });
        self.dom.sort.val(_paging.sort);
        // Update bottom paging
        self.dom.prev.hide();
        if (_paging.hasPrev()) {
            self.dom.prev.show();
        }
        self.dom.next.hide();
        if (_paging.hasNext()) {
            self.dom.next.show();
        }
    };

    /* List request */
    requestList = function requestList (paging, cb) {
        cb = cb || requestListCompleted;
        var data = {
            page: paging.page,
            size: paging.size,
            sort: paging.sort
        };
        _ajax.post('/api/contacts/list', JSON.stringify(data), cb, displayError);
    };

    /* Event handler for list request completed */
    requestListCompleted = function requestListCompleted (response, cb) {
        if (response) {
            _paging = null;
            _paging = new move.ContactsPagingModel(response.paging);
            // Empty cache and load it up
            self.cache.list = [];
            for (var i = 0, len = response.contacts.length; i < len; i++) {
                self.cache.list.push(new move.ContactsItemModel(response.contacts[i]));
            }
            // Render view
            dust.render('contacts-list.dust',  { contacts: self.cache.list }, renderContacts);
            // Update url with paging data
            if (cb) {
                cb();
            } else {
                updatePaging();
            }
        } else if (cb) {
            cb();
        }
    };

    /* Detail request */
    requestDetail = function requestDetail (id, cb) {
        cb = cb || requestDetailCompleted;
        _ajax.get('/api/contacts/detail/' + id, cb, displayError);
    };

    /* Event handler for detail request completed */
    requestDetailCompleted = function requestDetailCompleted (response) {
        if (response) {
            var model = new move.ContactsDetailModel(response);
            // Store the detail in the cache
            self.cache.detail[model.id] = model;
            dust.render('contacts-detail.dust', model, renderDetail);
        }
    };

    /* Sort control changed */
    sortChanged = function sortChanged () {
        if (_paging.sort !== self.dom.sort.val()) {
            _paging.sort = self.dom.sort.val();
            requestList(_paging);
        }
    };

    /* Change the page */
    pageChanged = function pageChanged (e) {
        e.stopPropagation();
        var $control = $(e.target),
        flag = false;
        if ($control.hasClass('js-nav-next')) {
            flag = _paging.next();
        } else if ($control.hasClass('js-nav-prev')) {
            flag = _paging.prev();
        }
        updatePaging();
        if (flag) {
            requestList(_paging);
        }
    };

    /* Handling when contact item clicked */
    contactClicked = function contactClicked (e) {
        e.stopPropagation();
        var id = $(e.target).parents('*[data-contact-id]').data('contact-id');
        if (id !== undefined && id !== '') {
            _selected = id;
            requestDetail(id);
        }
    };

    /* Event handler when detail mode back to list link clicked */
    backToListClicked = function backToListClicked (e) {
        e.preventDefault();
        e.stopPropagation();
        // Detect when original detail rendered goes back to list mode
        if (_paging.page === 0 && _paging.size === 0) {
            // Request list data
            requestList(DEFAULT_PAGING, function (response) {
                requestListCompleted(response, function () {
                    _scroll = 0; // Set scroll to top
                    _oldUrl = _url.host('/contacts'); // Set list url
                    displayList(); // Change to list mode
                    updatePaging(); // Update paging info on url and sort control
                });
            });
        } else {
            displayList();
        }
    };

    /**
    * Options 
    * @property options
    */
    self.options = options || {};

    /**
    * Cached DOM elements
    * @property dom
    */
    self.dom = {};

    /**
    * Cached other data
    * @property cache
    */
    self.cache = {
        list: [],
        detail: {}
    };

    /**
    * Initialize the page
    * @method init
    */
    self.init = function init (options) {
        options = options || {};
        options.container = options.container || document;
        self.dom.container = self.dom.container || ((typeof options.container === 'string') ? $(options.container) : options.container);
        // Render client side the menu
        dust.render('contacts-menu.dust', {}, renderMenu);
        // Cache dom objects
        self.dom.document = self.dom.document || $(document);
        self.dom.container = self.dom.container || self.dom.document;
        self.dom.sort = self.dom.sort || $('.js-sort', self.dom.container);
        self.dom.next = self.dom.next || $('.js-nav-next', self.dom.container);
        self.dom.prev = self.dom.prev || $('.js-nav-prev', self.dom.container);
        self.dom.contacts = self.dom.contacts || $('#contacts-items', self.dom.container);
        self.dom.detailContainer = self.dom.detailContainer || $('#detail-container', self.dom.container); // The whole detail section container
        self.dom.listContainer = self.dom.listContainer || $('#list-container', self.dom.container); // The whole list section container
        // Initialize event handlers
        self.dom.sort.on('change', sortChanged);
        self.dom.next.on('click', pageChanged);
        self.dom.prev.on('click', pageChanged);
        self.dom.contacts.on('click', 'div', contactClicked);
        self.dom.document.on('click', '.js-back-to-list', backToListClicked);
        self.dom.document.on('click', '.js-edit-contact', displayNotImplemented);
        // Get paging, update url, sort and paging
        _paging = new move.ContactsPagingModel(options.paging);
        updatePaging();
    };
};

window.move = window.move || {};
window.move.ContactsPage = ContactsPage;