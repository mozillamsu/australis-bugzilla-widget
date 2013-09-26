var user = (function () {
    var pub = {};

    // Elements
    var formNameElement = document.getElementById("user-name");
    pub.formElement = document.getElementById("user-input");

    // Public Functions
    pub.onUserNameSubmit = function (event) {
        // Shut down the form submission
        event.preventDefault();

        // Get the user name from the form
        var userName = getUserName();

        // Is the user on the Bugzilla server?
        var userNameFound = queryUserName(userName);
        if (userNameFound) {
            setUserName(userName);
        } else {
            rejectUserName();
        }
    };

    // Private functions
    function getUserName () {
        return formNameElement.value;
    };

    function queryUserName (userName) {
        return (userName === "pass");
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
