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
    this.attachments = data.attachments;
    this.last_change_time = data.last_change_time;
    this.status = data.status;
    this.summary = data.summary;
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
        description.setAttribute('class', 'bug text-link');
        description.setAttribute('href', 'https://bugzilla.mozilla.org/show_bug.cgi?id='+this.id);
        description.textContent = this.id+' - '+this.summary;

        // Append to the <vbox>
        this.bugList.listElement.appendChild(description);
    }
}
