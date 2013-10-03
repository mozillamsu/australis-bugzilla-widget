var user = (function () {
    var pub = {};

    // Elements
    var formNameElement = document.getElementById("user-name");
    pub.formElement = document.getElementById("user-form");

    // Public Functions
    pub.onUserNameSubmit = function (event) {
        // Shut down the form submission
        event.preventDefault();

        // Get the user name from the form
        var userName = getUserName();

        // Is the user on the Bugzilla server?
        var userNameFound = queryUserName(userName);
    };

    // Private functions
    function getUserName () {
        return formNameElement.value;
    };

    function queryUserName (userName) {
        // Start a waiting animation
        startSpinner();

        // Instantiate a BZ client
        var client = bz.createClient({
            url: "https://api-dev.bugzilla.mozilla.org/latest",
            timeout: 30000
        });

        // Does the given user have bugs on the server?
        client.countBugs({
            email1: userName,
            email1_assigned_to: 1,
            email1_qa_contact: 1,
            email1_type: "equals"
        },
        function (error, bugs) {
            // Stop the waiting animation
            stopSpinner();

            // Let the user know if the given userName had any bugs
            if (bugs > 0) {
                setUserName(userName);
            } else {
                rejectUserName();
            }
        });
    };

    function startSpinner () {
        alert("Checking for user.");
    };

    function stopSpinner () {
        alert("Done.");
    };

    function setUserName (userName) {
        // Set form value
        formNameElement.value = userName;

        // Turn green
        formNameElement.classList.remove("failure");
        formNameElement.classList.add("success");
    };

    function rejectUserName () {
        // Turn red
        formNameElement.classList.remove("success");
        formNameElement.classList.add("failure");
    };

    // Event handlers
    pub.formElement.addEventListener('submit', pub.onUserNameSubmit);

    return pub;
}());
