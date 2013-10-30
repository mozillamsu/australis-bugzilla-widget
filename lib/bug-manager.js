exports.BugManager = function (user) {
    // User
    this.user = user;

    // Bug Lists
    this.bugLists = {
        toReview: new BugList(this, "to-review", {
            'field0-0-0': 'flag.requestee',
            'type0-0-0': 'contains',
            'value0-0-0': this.user.name,
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            //include_fields: 'id,summary,status,resolution,last_change_time,attachments'
        }),
        toCheckIn: new BugList(this, "to-check-in", {
            'field0-0-0': 'attachment.attacher',
            'type0-0-0': 'equals',
            'value0-0-0': this.user.name,
            'field0-1-0': 'whiteboard',
            'type0-1-0': 'not_contains',
            'value0-1-0': 'fixed',
            'field0-2-0': 'flagtypes.name',
            'type0-2-0': 'substring',
            'value0-2-0': 'review+',
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            include_fields: 'id,summary,status,resolution,last_change_time,ref,attachments'
        }),
        toNag: new BugList(this, "to-nag", {
            'field0-0-0': 'flag.setter',
            'type0-0-0': 'equals',
            'value0-0-0': this.user.name,
            'field0-0-1': 'attachment.attacher',
            'type0-0-1': 'equals',
            'value0-0-1': this.user.name,
            'field0-1-0': 'flagtypes.name',
            'type0-1-0': 'contains',
            'value0-1-0': '?',
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            include_fields: 'id,summary,status,resolution,last_change_time,ref,flags,attachments'
        }),
        toRespond: new BugList(this, "to-respond", {
            'field0-0-0': 'flag.requestee',
            'type0-0-0': 'equals',
            'value0-0-0': this.user.name,
            include_fields: 'id,summary,status,resolution,last_change_time,ref,flags'
        }),
        toFix: new BugList(this, "to-fix", {
            email1: this.user.name,
            email1_type: "equals",
            email1_assigned_to: 1,
            'field0-1-0': 'whiteboard',
            'type0-1-0': 'not_contains',
            'value0-1-0': 'fixed',
            order: "changeddate DESC",
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            include_fields: 'id,summary,status,resolution,last_change_time,ref,attachments,depends_on'
        })
    };

    // Elements
    var bugCategoryElements = document.getElementsByClassName("bug-category");


    // Collapse bug lists by default
    for (var list in this.bugLists) {
        this.bugLists[list].collapse();
    }
}

exports.BugManager.prototype = {
    update: function () {
        for (var i in this.bugLists) {
            // Get the bug list
            var bugList = this.bugLists[i];

            // Update user name
            var params = bugList.queryParameters;
            if ('value0-0-0' in params) {
                params['value0-0-0'] = this.user.name; // Set email1
            }
            if ('email1' in params) {
                params['email1'] = this.user.name; // Set email1
            }
            if ('value0-0-1' in params) {
                params['value0-0-1'] = this.user.name; // Set email2
            }

            // Update bugs
            bugList.update();
        }
    }
}
