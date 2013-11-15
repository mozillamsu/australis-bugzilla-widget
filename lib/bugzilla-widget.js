/* ********
 * Requires
 * ********/
// Chrome
var ChromeConstants = require("./xul-manager/chrome-constants.js").ChromeConstants;

// SDK
let Preferences = require('sdk/preferences/service');
var data = require("sdk/self").data;

// Bugzilla libraries
var User = require('./user').User;
var BugManager = require("./bug-manager").BugManager;

function BugzillaWidget () {
    // DOM objects
    let document = null;
    let view = null;

    // Bugzilla objects
    let user = new User();
    let bugManager = new BugManager();
    bugManager.setUser(user);
    user.setManager(bugManager);

    // Read preferences
    if (Preferences.isSet('australis-bugzilla-widget.user.name') && Preferences.isSet('australis-bugzilla-widget.user.email')) {
        user.setUserName(Preferences.get('australis-bugzilla-widget.user.name'));
        user.setUserEmail(Preferences.get('australis-bugzilla-widget.user.email'));
    }
 

    /**
     * Constructs all UI elements and appends them to the view.
     */
    function injectUI () {
        // Load the main XUL file
        var xul = data.load('bug-list.xul');

        // Write to view
        view.innerHTML = xul;

        // Set document
        user.setDocument(document);
        bugManager.setDocument(document);

        // Draw
        user.draw();
        bugManager.draw();
    }

    return {
        CONFIG: {
            id: "australis-bugzilla-widget",
            type: "view",
            viewId: "australis-bugzilla-widget-view",
            removable: true,
            defaultArea: ChromeConstants.AREA_PANEL()
        },

        /**
         * Widget creation event handler.
         *
         * Inserts the widget's button in a given node.
         *
         * @param  {XMLElement} node XML node to which the button will be attached.
         */
        widgetCreated: function(node) {
            // Get the document
            let doc = node.ownerDocument;

            // Create the button's image
            let img = doc.createElement("image");
            img.setAttribute("class", "toolbarbutton-icon");
            img.id = "australis-bugzilla-widget-icon";
            img.setAttribute("src", data.url('favicon.ico.png'));
            img.setAttribute("width", "16px");
            img.setAttribute("height", "16px");

            // Create the button's label
            let lbl = doc.createElement("label");
            lbl.setAttribute("class", "toolbarbutton-text toolbarbutton-label");
            lbl.setAttribute("flex", "1");
            lbl.setAttribute("value", "Bugzilla");
            lbl.id = "australis-bugzilla-widget-label";

            // Attach the button elements to the node
            node.appendChild(img);
            node.appendChild(lbl);
        },

        /**
         * Widget showing event handler.
         *
         * Inserts the widget's panel elements into the active window.
         *
         * @param  {XMLDocument} doc The document into which the widget is to be inserted.
         * @param  {XULElement} theView The widget panelview to be inserted into the active window.
         */
        viewShowing: function (doc, theView) {
            // Get the document
            document = doc;

            // Load our stylesheet
            var css = data.url('styles.css'); // Resource URL to our stylesheet
            let xmlPI = document.createProcessingInstruction('xml-stylesheet', 'href="'+css+'" type="text/css"'); // Create an XML processing instruction for a stylesheet
            document.insertBefore(xmlPI, document.firstElementChild);

            // Set the view
            view = theView;

            // Write our UI to the panelview
            injectUI();
        }
    };
}

exports.BugzillaWidget = BugzillaWidget;
