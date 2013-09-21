/* ****
 * User
 * ****/
var user = (function () {
    var pub = {};

    var formNameElement = document.getElementById("user-name");
    pub.formElement = document.getElementById("user-input");

    pub.onUserNameSubmit = function () {
        var userName = getUserName();
        var userNameFound = queryUserName(userName);
        if (userNameFound) {
            setUserName(userName);
        } else {
            rejectUserName();
        }
    };

    function getUserName () {
        return "Super Awesome User Name!";
    };

    function queryUserName (userName) {
        return true;
    };

    function setUserName (userName) {
        console.log("setUserName "+userName);
    };

    function rejectUserName () {
        console.log("rejectUserName");
    };

    return pub;
}());


/* ********
 * Bug List
 * ********/
/*
var bugList = (function () {
    var pub = {};

    pub.BugList(element) {
    }

    function getUserBugs () {
    }

    return pub;
}());
*/


/* ***************
 * Event Handling
 * ***************/
self.port.on("show", function onShow() {
});

user.formElement.addEventListener('submit', user.onUserNameSubmit);
