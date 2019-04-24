// PhoneBook Class

var PhoneBook = function (contactList) {
    if (!contactList || contactList.length === 0) {
        console.log('You just initialized an empty phonebook!');
    }

    ////////// private properties

    var contacts = contactList;
    // console.log('Original contact');
    // console.table(contacts);
    var currentCapacity = contacts.length;
    var maxLength = 10000;
    var filteredContacts = [];
    var defaultContactsPerPage = 10;
    var defaultPage = 1;

    ////////// private methods

    // Function creats pagination, return array
    var paginate = function (array, itemsPerPage, page) {
        --page; // pages should start with 1, but arrays in javascript starts with 0
        return array.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    };

    // sort contacts by name
    var sortAlphabetically = function (arrContacts) {
        if (arrContacts && arrContacts.length > 0) {
            arrContacts.sort(function (a, b) {
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
                if (nameA < nameB) //sort string ascending
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0; //default return value (no sorting)
            });
        }
    }
    sortAlphabetically(contacts);
    // console.log('contact after sort');
    // console.table(contacts);

    // checks if the phonebook can accept more contacts, return boolean
    var isFull = function () {
        if (currentCapacity < maxLength) {
            return true;
        } else {
            return false;
        }
    };

    var updateState = function () {
        currentCapacity = contacts.length;  // needed each time after calling add()
        // if (contacts.length > 0) {
        //     sortAlphabetically(contacts);   // needed to sort the new updated contacts
        // }
        console.log('State updated:');
        console.dir(contacts);
    };

    ////////// public methods

    // list all contacts or some contacts in pages, return array
    this.list = function (contactsPerPage, page) {
        var paginatedResult;
        if (!contactsPerPage && !page) {
            // return default contacts;
            paginatedResult = paginate(contacts, defaultContactsPerPage, defaultPage);
            // sortAlphabetically(paginatedResult);
            return paginatedResult;
        } else {
            paginatedResult = paginate(contacts, contactsPerPage, page);
            // sortAlphabetically(paginatedResult);
            return paginatedResult;
        }
    };

    // add new contact to the phonebook, receives an object param {name, email, phone}
    this.add = function (contactInfo) {
        if (contactInfo) {
            if (isFull()) {
                contacts.push(contactInfo);
                updateState();
                sortAlphabetically(contacts);
            } else {
                console.log('Max Number of contacts reached, Sorry you cannot add more contacts');
            }
        }
        else {
            console.log('empty parameter!', contactInfo);
        }

    };

    // removes a contact by index and update the state
    this.remove = function (index) {
        if (typeof index === 'number') {
            contacts.splice(index, 1)
            updateState();
        }
    };

    this.search = function (query) {
        if (query === '') {
            var paginatedResult = paginate(contacts, defaultContactsPerPage, defaultPage);
            return paginatedResult;
        } else {
            filteredContacts = contacts.filter(function (contact) {
                return contact.name.toLowerCase() === query.toLowerCase() || contact.phone.toLowerCase() === query.toLowerCase();
            });
            return filteredContacts;
        }
    };

    // get defaultContactsPerPage
    this.getDefaultContactsPerPage = function () {
        return defaultContactsPerPage;
    };

    // get defaultContactsPerPage
    this.getPhonebookCapacity = function () {
        return currentCapacity;
    };
};


PhoneBook.prototype.toString = function () {
    var result = '';
    var contacts = this.list();
    contacts.forEach(function (element) {
        result += element.name + ', ' + element.phone + '\n';
    });
    return result;
}