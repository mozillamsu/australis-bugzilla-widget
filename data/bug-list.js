/**
 * Construct
 */
var BugList = function (categoryName, queryParameters, filterFunction) {
    // Bugzilla API client
    this.client = bz.createClient({
        url: "https://api-dev.bugzilla.mozilla.org/latest",
        timeout: 30000
    });

    // Bug list info
    this.categoryName = categoryName;
    this.queryParameters = queryParameters;
    this.filterFunction = filterFunction;

    // Get some data!
    this.update();
}

BugList.prototype = {

    /**
     * Refresh the bug list's data.
     */
    update: function () {
        // Clear the bug list
        this.bugs = {};

        // Get new bugs and redraw
        this.queryBugs(this);
    },

    /**
     * Get the bugs from the server.
     */
    queryBugs: function (self) {
        // Grab bugs from the API
        this.client.searchBugs(this.queryParameters, function (error, bugs) {
            if (error == true) {
                // Vomit
                console.log(error);
            }
            else {
                // Add bugs to the list
                bugs.forEach(function(bug) {
                    self.bugs[ bug.id ] = bug;
                });

                // Update UI with the new bug list
                self.draw();
            }
        });
    },

    /**
     * Display the bugs in the UI.
     */
    draw: function () {
        console.log(this.bugs);
    }

}

/*
exports.init = function(categoryName, queryParameters) {
    return new BugList (categoryName, queryParameters);
}
*/