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

    // Manager
    this.manager = null;

    // User info
    this.name = "";
    this.email = "";

    // Bugzilla API client
    this.bz = BugzillaApi.createClient({
        url: "http://api-dev.bugzilla.mozilla.org/latest",
        timeout: 30000
    });

}

exports.User.prototype = {
    /**
     * Sets the document.
     *
     * @param {XULDocument} document The document in which the user's form exists.
     */
    setDocument: function (document) {
        // Set document
        this.document = document; 

        // Elements
        this.emailElement = this.document.getElementById("user-email");

        // Event handlers
        this.emailElement.addEventListener('change', this.onUserEmailSubmit.bind(this), false);
    },

    draw: function () {
        // Set form value
        this.emailElement.setAttribute('value', this.email);
    },

    /**
     * Sets the BugManager which controls the user's bugs.
     *
     * @param {BugManager} manager The BugManager which controls the user's bugs.
     */
    setManager: function (manager) {
        this.manager = manager;
    },

    /**
     * User email submission event handler.
     *
     * Shuts down the form submission and checks whether the given user is valid.
     */
    onUserEmailSubmit: function (event) {
        // Get the user name from the form
        var userEmail = this.getUserEmail();

        // Is the user on the Bugzilla server?
        var userEmailFound = this.queryUserEmail(userEmail);

        event.preventDefault();
    },

    /**
     * Gets the submitted user email from the form element.
     */
    getUserEmail: function () {
        return this.emailElement.value;
    },

    /**
     * Sends a query to the server to see whether the user exists.
     */
    queryUserEmail: function (userEmail) {
        // Start a waiting animation
        this.startSpinner();

        // Does the given user have bugs on the server?
        this.bz.getUser(userEmail, this.onUserEmailResponse.bind(this, userEmail));
    },

    /**
     * Starts the spinner animation.
     */
    startSpinner: function () {
        this.emailElement.className = "spinner";
    },

    /**
     * Handles the response to the user email query.
     *
     * @param  {string} userEmail The username whose validity is being tested.
     * @param  {error} error Any errors with the request.
     * @param  {object} user A Bugzilla user object.
     */
    onUserEmailResponse: function (userEmail, error, user) {
        // Stop the waiting animation
        this.stopSpinner();

        // Vomit errors
        if (typeof(error) !== 'undefined') {
            console.log(error);
        }

        // Let the user know if the given user is valid
        if (typeof(user) !== 'undefined') {
            this.setUserName(user.real_name.match(/\[.*:(.*)\]/)[1]);
            this.setUserEmail(userEmail);
        } else {
            this.rejectUserEmail();
        }
    },

    /**
     * Stops the spinner animation.
     */
    stopSpinner: function () {
        this.emailElement.className = "";
    },

    /**
     * Sets the User's name.
     * 
     * @param {string} userName The new name of the User.
     */
    setUserName: function (userName) {
        this.name = userName;
    },

    /**
     * Sets the User's email to the submitted email.
     *
     * @param {string} userEmail The new email of the User.
     */
    setUserEmail: function (userEmail) {
        // Set form value
        this.emailElement.value = userEmail;

        // Set property
        this.email = userEmail;

        // Turn green
        this.emailElement.className = "success";

        // Update bug lists
        this.manager.update();

        // Reset the update timer
        this.manager.resetTimer();
    },

    /**
     * Lets the user know that the given username is invalid.
     */
    rejectUserEmail: function () {
        // Turn red
        this.emailElement.className = "failure";
    }
}
