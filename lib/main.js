var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");

var widget = widgets.Widget({
    id: "australis-bugzilla-widget",
    label: "Bugzilla",
    contentURL: "http://www.bugzilla.org/favicon.ico",
    onClick: function () {
        tabs.open("http://www.bugzilla.org/");
    }
});
