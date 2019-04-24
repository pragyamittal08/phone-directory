'use strict';

//// TODO
/*
    - [done] Ajax call to fetch the mock-data
    - [done] Add new contact [Name, Phone, E-mail]
    - [done] Validate contact on addition
    - [done] Pagination
    - [done] List contacts [Sorted alphabetically by Name]
    - [done] Search contacts: A user should be able to search for a contact using a query that represents either a contact name or a contact phone number
    - [done] Remove a contact
    - [done] The phone book can hold up to 10,000 contacts
*/

var APP = (function (window, undefined) {

    ////////// cache the DOM
    var phoneBook;
    var appContent = document.getElementById('app-content');
    var contactName = document.getElementById('contactName');
    var contactPhone = document.getElementById('contactPhone');
    var addBtn = document.getElementById('addBtn');
    var searchQuery = document.getElementById('searchQuery');
    var searchBtn = document.getElementById('searchBtn');
    var previousBtn = document.getElementById('previousBtn');
    var nextBtn = document.getElementById('nextBtn');

    var page = 1;


    ////////// callbacks
    var addNewContact = function (event) {
        // stop default action
        event.preventDefault();

        if (validateContact()) {
            // prepare contact data
            var newContact = {
                "name": contactName.value,
                "phone": contactPhone.value,
            };

            // add a new object
            phoneBook.add(newContact);

            // re-render the view
            render(phoneBook.list());

            // reset form values
            clearForm();
        }

    }

    var removeContact = function (event) {
        if (event.target && event.target.matches(".btn-remove")) {
            event.preventDefault();
            var index = event.target.parentElement.parentElement.children[0].innerText;
            phoneBook.remove(parseInt(index, 10));
            render(phoneBook.list());
        }
    }

    var searchContacts = function (event) {
        // stop default action
        event.preventDefault();
        var result = phoneBook.search(searchQuery.value);
        render(result);
        // reset form values
        clearForm();
    }

    var prevPage = function (event) {
        // stop default action
        event.preventDefault();
        page--;
        var defaultContacts = phoneBook.getDefaultContactsPerPage();
        var result = phoneBook.list(defaultContacts, page);
        nextBtn.disabled = false;
        render(result);
        if (page === 1) {
            previousBtn.disabled = true;
        }
    }

    var nextPage = function (event) {
        // stop default action
        event.preventDefault();
        var defaultContacts = phoneBook.getDefaultContactsPerPage();
        var totalPages = Math.ceil(phoneBook.getPhonebookCapacity() / defaultContacts);
        console.log('totalPages:', totalPages);

        page++;
        var result = phoneBook.list(defaultContacts, page);
        previousBtn.disabled = false;
        render(result);
        if (page >= totalPages) {
            nextBtn.disabled = true;
        }
    }


    ////////// Event Handlers
    addBtn.addEventListener('click', addNewContact);
    searchQuery.addEventListener('keyup', searchContacts);
    // searchBtn.addEventListener('click', searchContacts);
    appContent.addEventListener('click', removeContact);
    previousBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);


    
    ///////// HELPER FUNCTIONS
    var logError = function (message) {
        var errorElement = document.getElementById('app-error');
        errorElement.innerHTML += '<div class="alert alert-danger" role="alert">' + message +'</div>';
        setTimeout(function(){ 
            errorElement.innerHTML = '';
        }, 5000);
    }

    var validateContact = function () {
        var result = true;
        // validate name length: should not exceed 100 chars
        if (contactName.value.length > 99) {
            logError('Name cannot be more than 100 characters');
            result = false;
        }
        // validate phone number
        var phonePattern = /^\d{2}-\d{3}-\d{4}$/;
        var phoneResult = phonePattern.test(contactPhone.value);
        if (!phoneResult) {
            logError('Invalid Phone Number! Please enter a correct number (ex: 22-333-4444)');
            result = false;
        }
        // validate email number
        var emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        var emailResult = emailPattern.test(contactEmail.value);
        if (!emailResult) {
            logError('Invalid email format! Please add a correct email (ex: john@doe.com)');
            result = false;
        }
        return result;
    };

    // responsible to display contact data in DOM
    var render = function (data) {
        if (data && data.length > 0) {
            var htmlTemplate = '';
            data.forEach(function (contact, index) {
                htmlTemplate +=
                    '<tr class="contact-data">' +
                    '<td class="contact-index">' + index + '</td>' +
                    '<td class="contact-name">' + contact.name + '</td>' +
                    '<td class="contact-phone">' + contact.phone + '</td>' +
                    '<td class="contact-email">' + contact.email + '</td>' +
                    '<td class="contact-action"><button type="button" class="btn btn-danger btn-sm btn-remove"><span class="glyphicon glyphicon-remove"></span> Delete</button></td>' +
                    '</tr>';
            });
            appContent.innerHTML = '<table class="table table-striped"><thead><tr><th class="contact-index">Index</th><th class="contact-name">Name</th><th class="contact-phone">Phone</th><th class="contact-email">Email</th><th class="contact-action">Action</th></tr></thead><tbody>' + htmlTemplate + '</tbody></table>';
        }
        else {
            appContent.innerHTML = 'Sorry, Data not found yet! Keep typing or check spelling.';
        }
    }

    // reset form fields
    var clearForm = function () {
        contactName.value = '';
        contactPhone.value = '';
        contactEmail.value = '';
    }

    // ajax function to get mock-data from a third API
    var loadData = function (url, cb) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    cb(this);
                } else if (xhttp.status == 400) {
                    logError('There was an error 400');
                }
                else {
                    logError('Ajax Error!');
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    var init = function () {
        console.log('App initialized');
        // get data by ajax
        loadData('/assets/mock-data.json', function (data) {
            // parse json data
            var data = JSON.parse(data.responseText); // 40 records for testing
            // instantiate an object from our PhoneBook class
            phoneBook = new PhoneBook(data);
            // render data
            render(phoneBook.list());
        });
    }

    // explicitly return public methods when this object is instantiated
    return {
        init: init
    };

})(window);

try {
    APP.init();
} catch (error) {
    if (error instanceof ReferenceError) {
        console.error(error.message);
    }
    else if (error instanceof TypeError) {
        console.log(error.message);
    }
    else if (error instanceof RangeError) {
        console.log(error.message);
    }
    else {
        logError(error.message);
        console.error(error.message);
        console.error(error.stack);
    }
}
