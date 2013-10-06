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

    // Elements
    this.divElement = jQuery("#"+categoryName);
    this.countElement = this.divElement.find(".category-count");
    this.listElement = this.divElement.find(".bug-list");

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
        this.length = 0;

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
                    self.bugs[ bug.id ] = new Bug(bug, self.listElement);
                    self.length = self.length + 1;
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
        // Write bug list count
        this.countElement.html(this.length);

        // Clear old bug HTML
        this.listElement.empty();

        // Draw Bug items
        for (var bugId in this.bugs) {
            var bug = this.bugs[bugId];
            bug.draw();
        }
    }

}

/*
exports.init = function(categoryName, queryParameters) {
    return new BugList (categoryName, queryParameters);
}
*/