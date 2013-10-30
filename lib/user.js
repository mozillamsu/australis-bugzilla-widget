exports.User = function (document) {
    // Document
    this.document = document;

    // User info
    this.name = "";

    // Elements
    this.formNameElement = this.document.getElementById("user-name");
    this.formElement = this.document.getElementById("user-form");

    // Event handlers
    this.formElement.addEventListener('submit', this.onUserNameSubmit);
}

exports.User.prototype = {
    /**
     * Username submission event handler.
     *
     * Shuts down the form submission and checks whether the given user is valid.
     */
    onUserNameSubmit: function (event) {
        var self = event.data.self;

        // Shut down the form submission
        event.preventDefault();

        // Get the user name from the form
        var userName = self.getUserName();

        // Is the user on the Bugzilla server?
        var userNameFound = self.queryUserName(userName);
    },

    /**
     * Gets the submitted user name from the form element.
     */
    getUserName: function () {
        return this.formNameElement.value;
    },

    /**
     * Sends a query to the server to see whether the user exists.
     */
    queryUserName: function (userName) {
        // Start a waiting animation
        this.startSpinner();

        // Instantiate a BZ client
        var client = bz.createClient({
            url: "https://api-dev.bugzilla.mozilla.org/latest",
            timeout: 30000
        });

        var self = this;

        // Does the given user have bugs on the server?
        client.countBugs({
            email1: userName,
            email1_assigned_to: 1,
            email1_qa_contact: 1,
            email1_type: "equals"
        },
        function (error, bugs) {
            // Stop the waiting animation
            self.stopSpinner();

            // Let the user know if the given userName had any bugs
            if (bugs > 0) {
                self.setUserName(userName);
            } else {
                self.rejectUserName();
            }
        });
    },

    /**
     * Starts the spinner animation.
     */
    startSpinner: function () {
        this.formNameElement.className = "spinner";
    },

    /**
     * Stops the spinner animation.
     */
    stopSpinner: function () {
        this.formNameElement.className = "";
    },

    /**
     * Sets the User's name to the submitted username.
     */
    setUserName: function (userName) {
        // Set form value
        this.formNameElement.value = userName;

        // Set property
        this.name = userName;

        // Turn green
        this.formNameElement.className = "success";
    },

    /**
     * Lets the user know that the given username is invalid.
     */
    rejectUserName: function () {
        // Turn red
        this.formNameElement.className = "failure";
    }
}
