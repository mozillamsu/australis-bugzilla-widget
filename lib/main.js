var AustralisWidget = require("./xul-manager/australis-widget.js").AustralisWidget;
var BugzillaWidget = require("./bugzilla-widget").BugzillaWidget;

var bugzillaWidget = new BugzillaWidget();
var australisWidget = new AustralisWidget(bugzillaWidget);
