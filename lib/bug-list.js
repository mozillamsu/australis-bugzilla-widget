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

    // Bugs
    this.bugs = [];

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
     * Sets the email of the user whose bugs are listed.
     *
     * @param {string} userEmail Email of the user whose bugs are listed.
     */
    setUserEmail: function (userEmail) {
        // Replace username in query parameters
        var params = this.queryParameters;
        if ('value0-0-0' in params) {
            params['value0-0-0'] = userEmail; // Set email1
        }
        if ('email1' in params) {
            params['email1'] = userEmail; // Set email1
        }
        if ('value0-0-1' in params) {
            params['value0-0-1'] = userEmail; // Set email2
        }

        // Get bugs for new user
        this.update();
    },

    /**
     * Refresh the bug list's data.
     */
    update: function () {
        // Grab bugs from the API
        this.bz.searchBugs(this.queryParameters, this.onBugsReceived.bind(this));
    },

    /**
     * Sets the bugs returned from the query.
     * 
     * @param  {error} error Any errors that come down from the server.
     * @param  {array} bugs Array of Bugzilla API bug objects.
     */
    onBugsReceived: function (error, bugs) {
        if (error == true) {
            // Vomit
            console.log(error);
        }
        else {
            // Clear old bugs
            this.bugs.length = 0;

            // Set the new bugs
            for (var i = 0; i < bugs.length; i++) {
                var bug = bugs[i];

                // Create a new Bug object and append it to the array
                this.bugs.push(new Bug(this, bug));

                // Set the new bug's document
                this.bugs[this.bugs.length-1].setDocument(this.document);
            }
        }

        // Update UI
        this.draw();
    },

    /**
     * Display the bugs in the UI.
     */
    draw: function () {
        // Write bug list count
        this.countElement.value = this.bugs.length;

        // Clear old bug HTML
        this.clearBugElements();

        // Draw Bug items
        this.bugs.forEach(function (bug, index, bugs) {
            bug.draw();
        });

        // Preserve expand/collapse state
        //
        // When we hide the view and re-open it, onViewShowing fires BugManager.draw().
        // This nukes all XUL and re-draws, starting with bug-list.xul.
        // Lists are collapsed by default, so a list with isExpanded == true will still render collapsed.
        if (this.isExpanded) {
            this.expand();
        }
    },

    /**
     * Clears the bug elements from the list element.
     *
     * Used to remove old data when redrawing the UI.
     */
    clearBugElements: function () {
        while (this.listElement.hasChildNodes()) {
            this.listElement.removeChild(this.listElement.firstChild);
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
     *
     * @param {event} event Event object sent from DOM.
     */
    onClick: function (event) {
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

        event.preventDefault();
    }

}
