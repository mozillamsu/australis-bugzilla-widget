/**
 * Construct
 */
var Bug = function (data) {
    // Extract data
    this.id = data.id;
    this.attachments = data.attachments;
    this.last_change_time = data.last_change_time;
    this.status = data.status;
    this.summary = data.summary;
}

Bug.prototype = {

    /**
     * Display the bug in the UI.
     */
    draw: function () {
        console.log(this);
    }
}

/*
exports.init = function (data) {
    return new Bug (data);
}
*/