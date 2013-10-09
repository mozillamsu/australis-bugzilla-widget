var User = function (manager) {
    // Bug manager
    this.manager = manager;

    // User info
    this.name = "";

    // Elements
    this.formNameElement = jQuery("#user-name");
    this.formElement = jQuery("#user-form");

    // Event handlers
    this.formElement.submit({self: this}, this.onUserNameSubmit);
}

User.prototype = {
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
        return this.formNameElement.val();
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
        alert("Checking for user.");
    },

    /**
     * Stops the spinner animation.
     */
    stopSpinner: function () {
        alert("Done.");
    },

    /**
     * Sets the User's name to the submitted username.
     */
    setUserName: function (userName) {
        // Set form value
        this.formNameElement.val(userName);

        // Set property
        this.name = userName;

        // Turn green
        this.formNameElement.removeClass("failure");
        this.formNameElement.addClass("success");

        // Populate bug lists
        this.manager.update();
    },

    /**
     * Lets the user know that the given username is invalid.
     */
    rejectUserName: function () {
        // Turn red
        this.formNameElement.removeClass("success");
        this.formNameElement.addClass("failure");
    }
}

// var user = (function () {
//     var pub = {};

//     // Elements
//     var this.formNameElement = document.getElementById("user-name");
//     pub.formElement = document.getElementById("user-form");

//     // Public Functions
//     /**
//      * Username submission event handler.
//      *
//      * Shuts down the form submission and checks whether the given user is valid.
//      */
//     pub.onUserNameSubmit = function (event) {
//         // Shut down the form submission
//         event.preventDefault();

//         // Get the user name from the form
//         var userName = getUserName();

//         // Is the user on the Bugzilla server?
//         var userNameFound = queryUserName(userName);
//     };

//     // Private functions
//     /**
//      * Gets the submitted user name from the form element.
//      */
//     function getUserName () {
//         return this.formNameElement.value;
//     };

//     /**
//      * Sends a query to the server to see whether the user exists.
//      */
//     function queryUserName (userName) {
//         // Start a waiting animation
//         startSpinner();

//         // Instantiate a BZ client
//         var client = bz.createClient({
//             url: "https://api-dev.bugzilla.mozilla.org/latest",
//             timeout: 30000
//         });

//         // Does the given user have bugs on the server?
//         client.countBugs({
//             email1: userName,
//             email1_assigned_to: 1,
//             email1_qa_contact: 1,
//             email1_type: "equals"
//         },
//         function (error, bugs) {
//             // Stop the waiting animation
//             stopSpinner();

//             // Let the user know if the given userName had any bugs
//             if (bugs > 0) {
//                 setUserName(userName);
//             } else {
//                 rejectUserName();
//             }
//         });
//     };

//     /**
//      * Starts the spinner animation.
//      */
//     function startSpinner () {
//         alert("Checking for user.");
//     };

//     /**
//      * Stops the spinner animation.
//      */
//     function stopSpinner () {
//         alert("Done.");
//     };

//     /**
//      * Sets the User's name to the submitted username.
//      */
//     function setUserName (userName) {
//         // Set form value
//         this.formNameElement.value = userName;

//         // Turn green
//         this.formNameElement.classList.remove("failure");
//         this.formNameElement.classList.add("success");
//     };

//     /**
//      * Lets the user know that the given username is invalid.
//      */
//     function rejectUserName () {
//         // Turn red
//         this.formNameElement.classList.remove("success");
//         this.formNameElement.classList.add("failure");
//     };

//     // Event handlers
//     pub.formElement.addEventListener('submit', pub.onUserNameSubmit);

//     return pub;
// }());