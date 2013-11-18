#Australis Bugzilla Widget#
The Australis Bugzilla Widget add-on provides a dashboard for a user's Bugzilla bugs.


##Installation##
1. Download the add-on's XPI file from https://github.com/mozillamsu/australis-bugzilla-widget/releases/download/Beta/australis-bugzilla-widget.xpi
2. Open Firefox's Add-ons Manager.
3. Click on the "Tools for All Add-ons" button. It looks like three sliders.
4. Click "Install Add-on From File...".
5. Select the add-on's XPI file from your downloads folder.

##Usage##
Users may enter their Bugzilla user name in the username text box and press enter. The add-on will fetch all of the given user's bugs from the Bugzilla server. Bugs are automatically updated every 15 minutes. Bugs are divided into five categories:

* To Review: Bugs that have an attachment for which the user is flagged as a reviewer.
* To Check In: Bugs for which the user has submitted a patch that has been reviewed and approved.
* To Nag: Bugs for which the user has submitted a patch and requested it be reviewed, but the reviewer has not responded.
* To Respond: Bugs that the user has been requested to respond to.
* To Fix: Bugs which the user has been assigned that do not yet have patches.

Users see the number of bugs in each category to the left of the category's name. To show a category's bugs, users click on the category.

Each bug displays the bug's ID and its summary. Bugs with a yellow background are new bugs which the user has not opened. Users may click on a bug to open its full report on the Bugzilla server.
