/* ********
 * Requires
 * ********/
// SDK
var tabs = require("sdk/tabs");


/**
 * Class which represents a single Bugzilla bug.
 *
 * @param {object} data The bug's data object as handed down from bz.js.
 * @param {XULElement} listElement The listbox element to which this bug will be attached.
 */
exports.Bug = function (bugList, data) {
    // Document
    this.document = null;

    // BugList
    this.bugList = bugList;

    // Extract data
    this.id = data.id;
    this.ref = data.ref;
    this.href = 'https://bugzilla.mozilla.org/show_bug.cgi?id='+this.id;
    this.attachments = data.attachments;
    this.last_change_time = data.last_change_time;
    this.status = data.status;
    this.summary = data.summary;
    this.isNewBug = false;
}

exports.Bug.prototype = {
    /**
     * Sets the document in which this bug appears.
     * 
     * @param {XULDocument} document Document in which this bug appears.
     */
    setDocument: function (document) {
        this.document = document;
    },

    /**
     * Display the bug in the UI.
     */
    draw: function () {
        // <description> element
        var description = this.document.createElement('description');
        var classes = this.isNewBug ? 'bug new-bug' : 'bug';
        description.setAttribute('class', classes);
        description.setAttribute('href', this.href);
        description.textContent = this.id+' - '+this.summary;

        // Set a handler to open the bug page on click
        description.addEventListener('click', this.open.bind(this)); 

        // Append to the <vbox>
        this.bugList.listElement.appendChild(description);
    },

    /**
     * Open the bug's Bugzilla page in a new window.
     */
    open: function (event) {
        // Open the link
        tabs.open(this.href);

        if (this.isNewBug) {
            // Mark as viewed
            this.markAsViewed();

            // Redraw bug list to reflect new status
            this.bugList.draw();
        }

        // Prevent closing the panel
        event.preventDefault();
    },

    /**
     * Marks this bug as viewed.
     *
     * Sets the bug's viewed property and denotes it as viewed in the list and in the preferences file.
     */
    markAsViewed: function () {
        // Mark as viewed
        this.isNewBug = false;

        // Add ID to list of viewed bugs
        this.bugList.markAsViewed(this.id);
    }
}
