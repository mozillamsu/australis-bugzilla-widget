/* ********
 * Requires
 * ********/
// Chrome
let {Cc, Ci, Cu, Cr, Cm} = require("chrome");


// Bugzilla client
// var bz_api = require("./bz.js/bz.js");
// var bz_client = bz_api.createClient();

/* ***********
 * Panel Setup
 * ***********/

// Get the window
Cu.import("resource://gre/modules/Services.jsm"); // The Services module
var allWindows = Services.wm.getEnumerator(null); // Use the window mediator object to get all windows in the browser
var browserWindow, // Firefox's top-level "window"
    thisWindow; // Iterated window
while (allWindows.hasMoreElements()) {
    thisWindow = allWindows.getNext();
    if (typeof(thisWindow.location.href) !== 'undefined' && thisWindow.location.href === 'chrome://browser/content/browser.xul') {
        browserWindow = thisWindow;
        break;
    }
}

// Put our extension's XUL in the main panel
if (typeof(browserWindow) !== 'undefined') {
    // Create a panel view
    let panelview = browserWindow.document.createElement("panelview");
        panelview.id = "testId";
        panelview.className = "testClass";
        panelview.innerHTML = "<p>XUL goes here</p>";

    // Inject our panel view into the multiView panel
    let multiview = browserWindow.document.getElementById("PanelUI-multiView");
        multiview.appendChild(panelview);
    console.log(multiview);
}
