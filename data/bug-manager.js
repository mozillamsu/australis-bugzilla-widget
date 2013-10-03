var bugManager = (function () {
    var pub = {};

    // Elements
    var bugCategoryElements = document.getElementsByClassName("bug-category");

    // Objects
    var client = bz.createClient({
        url: "https://api-dev.bugzilla.mozilla.org/latest",
        timeout: 30000
    });
    client.searchBugs({
        email1: "jaws@mozilla.com",
        email1_type: "equals",
        email1_assigned_to: 1,
        email1_qa_contact: 1
    }, function (error, bugs) {
        if (error === true) {
            console.log(error);
        }
        else {
            bugs.forEach(function(bug) {
                console.log(bug);
            });
        }
    });

    // Public Functions
    //pub.onUserNameSubmit = function (event) {

    // Private functions
    //function getUserName () {

    // Event handlers
    //pub.formElement.addEventListener('submit', pub.onUserNameSubmit);

    return pub;
}());
