/* ********
 * Requires
 * ********/
var panels = require("sdk/panel");
var widgets = require("sdk/widget");
var data = require("sdk/self").data;


/* **************
 * Bug List Panel
 * **************/
// Panel
var bug_list_panel = panels.Panel({
    width: 200,
    height: 400,
    contentURL: data.url("bug-list.html"),
    contentScriptFile: data.url("bug-list.js")
});

// Show handler
bug_list_panel.on("show", function () {
    bug_list_panel.port.emit("show");
});


/* ******
 * Widget
 * ******/
// Widget
var widget = widgets.Widget({
    id: "australis-bugzilla-widget",
    label: "Bugzilla",
    contentURL: "http://www.bugzilla.org/favicon.ico",
    panel: bug_list_panel
});
