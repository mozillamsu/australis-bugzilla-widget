/* ********
 * Requires
 * ********/
let BugzillaApi = require('./bz.js/bz');


/**
 * A class to input and handle a user.
 *
 * @constructor
 */
exports.User = function () {
    // Document
    this.document = null;

    // User info
    this.name = "";

    // Bugzilla API client
    this.bz = BugzillaApi.createClient({
        url: "https://api-dev.bugzilla.mozilla.org/latest",
        timeout: 30000
    });

}

exports.User.prototype = {
    /**
     * Sets the document.
     */
    setDocument: function (document) {
        // Set document
        this.document = document; 

        // Elements
        this.nameElement = this.document.getElementById("user-name");

        // Event handlers
        this.nameElement.addEventListener('change', this.onUserNameSubmit.bind(this), false);
    },

    /**
     * Username submission event handler.
     *
     * Shuts down the form submission and checks whether the given user is valid.
     */
    onUserNameSubmit: function (event) {
        // Get the user name from the form
        var userName = this.getUserName();

        // Is the user on the Bugzilla server?
        var userNameFound = this.queryUserName(userName);
    },

    /**
     * Gets the submitted user name from the form element.
     */
    getUserName: function () {
        return this.nameElement.value;
    },

    /**
     * Sends a query to the server to see whether the user exists.
     */
    queryUserName: function (userName) {
        console.log('queryUserName');
        // Start a waiting animation
        this.startSpinner();

        // Does the given user have bugs on the server?
        this.bz.countBugs({
            email1: userName,
            email1_assigned_to: 1,
            email1_qa_contact: 1,
            email1_type: "equals"
        },
        this.onUserNameResponse.bind(this, userName));
    },

    /**
     * Starts the spinner animation.
     */
    startSpinner: function () {
        console.log('startSpinner');
        this.nameElement.className = "spinner";
    },


    onUserNameResponse: function (userName, error, bugs) {
        // Stop the waiting animation
        this.stopSpinner();

        // Let the user know if the given userName had any bugs
        if (bugs > 0) {
            this.setUserName(userName);
        } else {
            this.rejectUserName();
        }
    },

    /**
     * Stops the spinner animation.
     */
    stopSpinner: function () {
        console.log('stopSpinner');
        this.nameElement.className = "";
    },

    /**
     * Sets the User's name to the submitted username.
     */
    setUserName: function (userName) {
        console.log('setUserName');
        // Set form value
        this.nameElement.value = userName;

        // Set property
        this.name = userName;

        // Turn green
        this.nameElement.className = "success";
    },

    /**
     * Lets the user know that the given username is invalid.
     */
    rejectUserName: function () {
        console.log('rejectUserName');
        // Turn red
        this.nameElement.className = "failure";
    }
}
