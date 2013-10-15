/**
 * Construct
 */
var Bug = function (data, listElement) {
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

Bug.prototype = {

    /**
     * Display the bug in the UI.
     */
    draw: function () {

        // <li> element
        var listItem = document.createElement('li');
        listItem.className = "bug";

        // <a> element
        var anchor = document.createElement('a');
        anchor.href = this.ref;

        // Bug number <span> element
        var bugNumberSpan = document.createElement('span');
        bugNumberSpan.className = "bug-number";
        var bugNumber = document.createTextNode(this.id);
        bugNumberSpan.appendChild(bugNumber);

        // Bug elements divder string
        var bugDivider = document.createTextNode(' - ');

        // Bug name <span> element
        var bugNameSpan = document.createElement('span');
        bugNameSpan.className = "bug-name";
        var bugName = document.createTextNode(this.summary);
        bugNameSpan.appendChild(bugName);

        // Connect all of our new elements
        anchor.appendChild(bugNumberSpan);
        anchor.appendChild(bugDivider);
        anchor.appendChild(bugNameSpan);
        listItem.appendChild(anchor);

        // Append to the <ul>
        this.listElement.append(listItem);
    }
}

/*
exports.init = function (data) {
    return new Bug (data);
}
*/