/* ********
 * Requires
 * ********/
let Timer = require('sdk/timers');
let BugList = require('./bug-list').BugList;


/**
 * A class which manages a user and their lists of bugs.
 *
 * @constructor
 */
exports.BugManager = function () {
    // DOM
    this.window = null;
    this.document = null;

    // User
    this.user = null;

    // Bug Lists
    this.bugLists = {};

    // Timer
    this.timerActive = false;
    this.interval = null;
}

exports.BugManager.prototype = {
    /**
     * Sets the document in which the bug lists appear.
     *
     * @param {XULDocument} document The document in which the bug lists appear.
     */
    setDocument: function (document) {
        // Set document
        this.document = document;

        // Set window
        this.window = this.document.defaultView;

        // Set bug lists' documents
        for (var i in this.bugLists) {
            // Get the bug list
            var bugList = this.bugLists[i];

            // Update document
            bugList.setDocument(document);
        }
    },

    /**
     * Sets the user whose bugs are to be managed.
     * 
     * @param {User} user The user whose bugs are to be managed.
     */
    setUser: function (user) {
        // User
        this.user = user;

        // Bug Lists
        this.bugLists = {
            toReview: new BugList(this, "to-review", {
                'field0-0-0': 'flag.requestee',
                'type0-0-0': 'contains',
                'value0-0-0': this.user.email,
                status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
                include_fields: 'id,summary,status,resolution,last_change_time,attachments'
            },
            function (bug) {
                // only add attachments with this user as requestee
                if (!bug.attachments) {
                    return;
                }

                /* group attachments together for this bug */
                var atts = [];
                bug.attachments.forEach(function(att) {

                    // Require flags
                    if (att.is_obsolete || !att.flags) {
                       return;
                    }

                    // At least one flag has the user as a requestee and status "?"
                    att.flags.some(function(flag) {
                        if (flag.requestee && flag.requestee.name == this.user.name && flag.status == "?") {

                            // Add attachment to the array
                            att.bug = bug;
                            att.type = flag.name;
                            att.time = att.last_change_time;
                            atts.push(att);
                            return true;
                        }
                        return false;
                    }.bind(this));
                 }.bind(this));

                // Are there attachments for which we're the requestee?
                if (atts.length) {
                    return true;
                }
                return false;
            }.bind(this)),
            toCheckIn: new BugList(this, "to-check-in", {
                'field0-0-0': 'attachment.attacher',
                'type0-0-0': 'equals',
                'value0-0-0': this.user.email,
                'field0-1-0': 'whiteboard',
                'type0-1-0': 'not_contains',
                'value0-1-0': 'fixed',
                'field0-2-0': 'flagtypes.name',
                'type0-2-0': 'substring',
                'value0-2-0': 'review+',
                status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
                include_fields: 'id,summary,status,resolution,last_change_time,ref,attachments'
            },
            function (bug) {

                /**
                 * Determines whether an attachment is ready to be checked in.
                 * 
                 * @param  {object} att A Bugzilla bug attachment object.
                 * @return {boolean} Whether the attachment is ready to land.
                 */
                var readyToLand = function (att) {
                    if (att.is_obsolete || !att.is_patch || !att.flags || att.attacher.name != this.user.name) {
                       return false;
                    }

                    // Do we have at least one review+?
                    var ready = att.flags.filter(function(flag) {
                       return (flag.name == "review" && flag.status == "+");
                    }).length > 0;

                    if (!ready)
                        return false;

                    // Don't add patches that have pending requests, have review-, or have checkin+.
                    for (var i = 0; i < att.flags.length; ++i) {
                        var flag = att.flags[i];
                        if (flag.status == "?" && flag.name != "checkin"|| flag.name == "review" && flag.status == "-"|| flag.name == "checkin" && flag.status == "+") {
                            return false;
                        }
                    }

                    return ready;
                }.bind(this);

                // Count the number of attachments which are ready to land
                var readyAttachments = [];
                bug.attachments.forEach(function (att) {

                    if (!readyToLand(att)) {
                        return;
                    }

                    att.bug = bug;
                    readyAttachments.push(att);
                });

                // If there are attachments which are ready to land, include
                if (readyAttachments.length) {
                    return true;
                }

                return false;
            }.bind(this)),
            toNag: new BugList(this, "to-nag", {
                'field0-0-0': 'flag.setter',
                'type0-0-0': 'equals',
                'value0-0-0': this.user.email,
                'field0-0-1': 'attachment.attacher',
                'type0-0-1': 'equals',
                'value0-0-1': this.user.email,
                'field0-1-0': 'flagtypes.name',
                'type0-1-0': 'contains',
                'value0-1-0': '?',
                status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
                include_fields: 'id,summary,status,resolution,last_change_time,ref,flags,attachments'
            },
            function (bug) {
                var atts = [];
                var flags = [];

                // Did we give somebody a bug?
                if (bug.flags) {
                    bug.flags.forEach(function(flag) {
                        if (flag.status == "?" && flag.setter && flag.setter.name == this.user.name && (!flag.requestee || flag.requestee.name != this.user.name) && flag.name != "in-testsuite") {
                            flags.push(flag);
                        }
                    }.bind(this));
                }

                // Are there attachments we set?
                if (bug.attachments) {
                    bug.attachments.forEach(function(att) {
                        if (att.is_obsolete || !att.flags) {
                            return;
                        }

                        att.flags.some(function(flag) {
                            if (flag.status == "?" && flag.setter.name == this.user.name) {
                                att.bug = bug;
                                atts.push(att);
                                return true;
                            }
                            return false;
                        }.bind(this))
                    }.bind(this));
                }

                // Did we give somebody work?
                if (atts.length || flags.length) {
                    return true;
                }
                return false;
            }.bind(this)),
            toRespond: new BugList(this, "to-respond", {
                'field0-0-0': 'flag.requestee',
                'type0-0-0': 'equals',
                'value0-0-0': this.user.email,
                include_fields: 'id,summary,status,resolution,last_change_time,ref,flags'
            },
            function (bug) {
                if (!bug.flags) {
                    return false;
                }

                // Are we the requestee?
                var flags = [];
                bug.flags.forEach(function (flag) {
                    if (flag.requestee && flag.requestee.name == this.user.name)
                    {
                        flags.push({
                            name: flag.name,
                            flag: flag,
                            bug: bug,
                            time: bug.last_change_time
                        });
                    }
                }.bind(this));

                return (flags.length > 0);
            }.bind(this)),
            toFix: new BugList(this, "to-fix", {
                email1: this.user.email,
                email1_type: "equals",
                email1_assigned_to: 1,
                'field0-1-0': 'whiteboard',
                'type0-1-0': 'not_contains',
                'value0-1-0': 'fixed',
                order: "changeddate DESC",
                status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
                include_fields: 'id,summary,status,resolution,last_change_time,ref,attachments,depends_on'
            },
            function (bug) {
                if (!bug.attachments) {
                    return true;
                }

                // Is there a patch which should be reviewed?
                var patchForReview = bug.attachments.some(function(att) {
                    // Must be current and have a patch
                    if (att.is_obsolete || !att.is_patch || !att.flags) {
                       return false;
                    }

                    // Review flag is set on this patch 
                    var reviewFlag = att.flags.some(function(flag) {
                       return flag.name == "review" && (flag.status == "?" || flag.status == "+");
                    }.bind(this));

                    return reviewFlag;
                }.bind(this));

                return !patchForReview;
            }.bind(this))
        };
    },

    /**
     * Updates the bug lists' data.
     */
    update: function () {
        // Update bug lists
        for (var i in this.bugLists) {
            // Get the bug list
            var bugList = this.bugLists[i];

            // Update user name
            bugList.setUserEmail(this.user.email);
        }
    },

    /**
     * Restarts the timer.
     *
     * Used when a new user is set.
     */
    resetTimer: function () {
        this.stopTimer();
        this.startTimer();
    },

    /**
     * Starts the update timer.
     */
    startTimer: function () {
        // Set timed update on interval
        this.interval = Timer.setInterval(this.update.bind(this), 30000);

        // Flag timer as active
        this.timerActive = true;
    },

    /**
     * Stops the update timer.
     */
    stopTimer: function () {
        // If there's no timer, return
        if (!this.timerActive) {
            return;
        }

        // Clear the interval
        Timer.clearInterval(this.interval);
    },

    /**
     * Draws the dynamic elements of the panel.
     */
    draw: function () {
        // Redraw all buglists in the panel
        for (var i in this.bugLists) {
            // Get the bug list
            var bugList = this.bugLists[i];

            // Draw the bug list
            bugList.draw();
        }
    }

}
