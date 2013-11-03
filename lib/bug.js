/**
 * Class which represents a single Bugzilla bug.
 *
 * @param {object} data The bug's data object as handed down from bz.js.
 * @param {XULElement} listElement The listbox element to which this bug will be attached.
 */
exports.Bug = function (data, listElement) {
    // Document
    this.document = null;

    // Extract data
    this.id = data.id;
    this.ref = data.ref;
    this.attachments = data.attachments;
    this.last_change_time = data.last_change_time;
    this.status = data.status;
    this.summary = data.summary;

    // Elements
    this.listElement = listElement;
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

        // <listitem> element
        var listitem = this.document.createElement('listitem');
        listitem.className = "bug";
        listitem.href = 'https://bugzilla.mozilla.org/show_bug.cgi?id='+this.id;
        listitem.value = this.id+' - '+this.summary;
        console.log(listitem);

        // Append to the <listbox>
        this.listElement.appendChild(listitem);
    }
}
