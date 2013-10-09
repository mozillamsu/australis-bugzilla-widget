/**
 * Construct
 */
var BugList = function (manager, categoryName, queryParameters, filterFunction) {
    // Bugzilla API client
    this.client = bz.createClient({
        url: "https://api-dev.bugzilla.mozilla.org/latest",
        timeout: 30000
    });

    // Bug Manager
    this.manager = manager;

    // Bug list info
    this.categoryName = categoryName;
    this.queryParameters = queryParameters;
    this.filterFunction = filterFunction;

    // Elements
    this.divElement = jQuery("#"+categoryName);
    this.categoryHead = this.divElement.find(".category-head");
    this.countElement = this.divElement.find(".category-count");
    this.listElement = this.divElement.find(".bug-list");

    // Expand/ collapse state
    this.isExpanded = false;

    // Event handlers
    this.categoryHead.click({self: this}, this.onClick);
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
    },

    /**
     * Open the category's bug list.
     */
    expand: function () {
        this.listElement.show();
        this.isExpanded = true;
    },

    /**
     * Close the category's bug list.
     */
    collapse: function () {
        this.listElement.hide();
        this.isExpanded = false;
    },

    /**
     * Handle a user clicking on this list.
     */
    onClick: function (params) {
        // Get the BugList which fired this event
        var self = params.data.self;

        // Toggle expanded state
        if (self.isExpanded) {
            self.collapse();
        }
        else {
            // Collapse other lists
            for (var i in self.manager.bugLists) {
                var list = self.manager.bugLists[i];

                if (list.isExpanded) {
                    list.collapse();
                }
            }

            // Expand this list
            self.expand();
        }
    }

}

/*
exports.init = function(categoryName, queryParameters) {
    return new BugList (categoryName, queryParameters);
}
*/