/* *******
 * Imports
 * *******/
// Modules
var User = require("./user").User;

// Chrome
let {Cc, Ci, Cu, Cr, Cm, Components} = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

// Window
let window = require('sdk/window/utils').getMostRecentBrowserWindow();


/* *****
 * Setup
 * *****/
// DOM
let document = window.document;

// Create Form
var formElement = document.createElement('form');
formElement.id = "user-form";

// Create name input box
var formNameElement = document.createElement('input');
formNameElement.id = "user-name";
formNameElement.type = "input";

// Wire form up to the DOM
formElement.appendChild(formNameElement);
document.documentElement.appendChild(formElement);


/* ****************
 * Functional Tests
 * ****************/
exports["test User created"] = function (assert) {

    // Setup
    var user = new User(document);

    // Assert
    assert.ok(("formNameElement" in user), "User object was created.");
};


/* ***
 * Run
 * ***/
require("sdk/test").run(exports);