var bugManager = (function () {
    var pub = {};
    this.username = "jaws@mozilla.com";

    // Elements
    var bugCategoryElements = document.getElementsByClassName("bug-category");

    // Objects
    pub.bugLists = {
        toReview: new BugList("to-review", {
            'field0-0-0': 'flag.requestee',
            'type0-0-0': 'contains',
            'value0-0-0': this.username,
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            include_fields: 'id,summary,status,resolution,last_change_time,attachments'
        }),
        toCheckIn: new BugList("to-check-in", {
            'field0-0-0': 'attachment.attacher',
            'type0-0-0': 'equals',
            'value0-0-0': this.username,
            'field0-1-0': 'whiteboard',
            'type0-1-0': 'not_contains',
            'value0-1-0': 'fixed',
            'field0-2-0': 'flagtypes.name',
            'type0-2-0': 'substring',
            'value0-2-0': 'review+',
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            include_fields: 'id,summary,status,resolution,last_change_time,attachments'
        }),
        toNag: new BugList("to-nag", {
            'field0-0-0': 'flag.setter',
            'type0-0-0': 'equals',
            'value0-0-0': this.username,
            'field0-0-1': 'attachment.attacher',
            'type0-0-1': 'equals',
            'value0-0-1': this.username,
            'field0-1-0': 'flagtypes.name',
            'type0-1-0': 'contains',
            'value0-1-0': '?',
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            include_fields: 'id,summary,status,resolution,last_change_time,flags,attachments'
        }),
        toRespond: new BugList("to-respond", {
            'field0-0-0': 'flag.requestee',
            'type0-0-0': 'equals',
            'value0-0-0': this.username,
            include_fields: 'id,summary,status,resolution,last_change_time,flags'
        }),
        toFix: new BugList("to-fix", {
            email1: this.username,
            email1_type: "equals",
            email1_assigned_to: 1,
            'field0-1-0': 'whiteboard',
            'type0-1-0': 'not_contains',
            'value0-1-0': 'fixed',
            order: "changeddate DESC",
            status: ['NEW','UNCONFIRMED','REOPENED', 'ASSIGNED'],
            include_fields: 'id,summary,status,resolution,last_change_time,attachments,depends_on'
        })
    };

    return pub;
}());
