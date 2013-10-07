/**
 * Construct
 */
var Bug = function (data, listElement) {
    // Extract data
    this.id = data.id;
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
        this.listElement.append('<li class="bug"> <a href="#"><span class="bug-number">'+this.id+'</span> - <span class="bug-name">'+this.summary+'</span></a> </li>');
    }
}

/*
exports.init = function (data) {
    return new Bug (data);
}
*/