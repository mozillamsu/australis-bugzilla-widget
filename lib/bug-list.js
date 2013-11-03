/* ********
 * Requires
 * ********/
let BugzillaApi = require('./bz.js/bz');
let Bug = require('./bug').Bug;

/**
 * Class to manage a list of bugs.
 *
 * @constructor
 */
exports.BugList = function (manager, categoryName, queryParameters, filterFunction) {
    // Document
    this.document = manager.document;

    // Bugzilla API client
    this.bz = BugzillaApi.createClient({
        url: "https://api-dev.bugzilla.mozilla.org/latest",
        timeout: 30000
    });

    // Bug Manager
    this.manager = manager;

    // Bug list info
    this.categoryName = categoryName;
    this.queryParameters = queryParameters;
    this.filterFunction = filterFunction;


    // Expand/ collapse state
    this.isExpanded = false;

}

exports.BugList.prototype = {
    /**
     * Sets the document, points element references to it, and wires event handlers up to it.
     * 
     * @param {XULDocument} document Document in which this bug list appears.
     */
    setDocument: function (document) {
        // Document
        this.document = document;

        // Elements
        this.boxElement = this.document.getElementById(this.categoryName);
        this.categoryHeadElement = this.boxElement.getElementsByClassName('category-head')[0];
        this.countElement = this.boxElement.getElementsByClassName('category-count')[0];
        this.listElement = this.boxElement.getElementsByClassName('bug-list')[0];

        // Event handlers
        this.categoryHeadElement.addEventListener('click', this.onClick.bind(this), false);
    },

    /**
     * Sets the name of the user whose bugs are listed.
     *
     * @param {} userName [description]
     */
    setUserName: function (userName) {
        // Replace username in query parameters
        var params = this.queryParameters;
        if ('value0-0-0' in params) {
            params['value0-0-0'] = userName; // Set email1
        }
        if ('email1' in params) {
            params['email1'] = userName; // Set email1
        }
        if ('value0-0-1' in params) {
            params['value0-0-1'] = userName; // Set email2
        }

        // Get bugs for new user
        this.update();
    },

    /**
     * Refresh the bug list's data.
     */
    update: function () {
        // Hide the list
        this.collapse();

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
        this.bz.searchBugs(this.queryParameters, function (error, bugs) {
            if (error == true) {
                // Vomit
                console.log(error);
            }
            else {
                // Add bugs to the list
                bugs.forEach(function(bug) {
                    // Create bug
                    self.bugs[ bug.id ] = new Bug(bug, self.listElement);
                    self.bugs[ bug.id ].setDocument(self.document);

                    // Increment length
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
        this.countElement.value = this.length;

        // Clear old bug HTML
        this.listElement.innerHTML = "";

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
        this.listElement.style.display = 'block';
        this.isExpanded = true;
    },

    /**
     * Close the category's bug list.
     */
    collapse: function () {
        this.listElement.style.display = 'none';
        this.isExpanded = false;
    },

    /**
     * Handle a user clicking on this list.
     */
    onClick: function (params) {
        // Toggle expanded state
        if (this.isExpanded) {
            this.collapse();
        }
        else {
            // Collapse other lists
            for (var i in this.manager.bugLists) {
                var list = this.manager.bugLists[i];

                if (list.isExpanded) {
                    list.collapse();
                }
            }

            // Expand this list
            this.expand();
        }
    }

}
