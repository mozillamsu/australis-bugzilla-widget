/* ********
 * Requires
 * ********/
// Chrome privileges
const { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');

// Services
Cu.import('resource://gre/modules/Services.jsm');
var ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);

// Customizable UI
const { CustomizableUI } = Cu.import('resource:///modules/CustomizableUI.jsm');

// XUL Manager
var widget = require('./xul-manager/widget').Widget;

// SDK
var sdkWidget = require('sdk/widget').Widget;
var sdkWindowUtils = require('sdk/window/utils');
var sdkUnload = require('sdk/system/unload');
var self = require('sdk/self');


/* ********************
 * Register Chrome URLs
 * ********************/
// Register chrome URL dynamically
var resProt = ios.getProtocolHandler('resource').QueryInterface(Ci.nsIResProtocolHandler);

// Get Chrome directory filepath
let chromeDir = self.data.url('chrome');
let uri = ios.newURI(chromeDir, null, null);
let filePath = resProt.resolveURI(uri);

// Get the directory
let localFile = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
localFile.initWithPath(filePath.substr(7));

// Register
Cm.addBootstrappedManifestLocation(localFile);


/* *************
 * Create Widget
 * *************/
const config = {
    ID: 'australis-bugzilla-widget',
    LABEL: 'Bugzilla',
    TOOLTIP: 'Bugzilla',
    TYPE: 'view',
    VIEW_ID: 'PanelUI-australis-bugzilla-widget',
    DEFAULT_AREA: CustomizableUI.AREA_PANEL,
    REMOVABLE: true,
    XUL_FILE: 'bug-list.xul',
    ICON_URL: 'http://www.bugzilla.org/favicon.ico'
};


function addonUnload(eventArgs) {
    CustomizableUI.destroyWidget(config.ID);
    fooWidget.addonUnload(eventArgs);
}

function initWidget() {
    fooWidget = new widget(config);
    sdkUnload.when(addonUnload);
    CustomizableUI.createWidget(fooWidget.UXWidget);
}

initWidget();
