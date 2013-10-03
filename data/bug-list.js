var BugList = function (categoryName, queryParameters) {
    this.client = bz.createClient({
        url: "https://api-dev.bugzilla.mozilla.org/latest",
        timeout: 30000
    });
    this.categoryName = categoryName;
    this.queryParameters = queryParameters;
    this.queryBugs();
}

BugList.prototype = {

    queryBugs: function () {
        this.client.searchBugs(this.queryParameters, function (error, bugs) {
            if (error == true) {
                console.log(error);
            }
            else {
                console.log("Received "+bugs.length+" bugs.");
                bugs.forEach(function(bug) {
                    console.log(bug);
                });
            }
        });
    }

}

/*
exports.init = function(categoryName, queryParameters) {
    return new BugList (categoryName, queryParameters);
}
*/