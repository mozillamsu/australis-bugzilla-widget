/* ****
 * User
 * ****/
var user_name = document.getElementById("user-name");
var save_button = document.getElementById("save");

save_button.addEventListener('click', function (event) {
    user_name.value = "Saved";
});


/* ***************
 * Signal Handling
 * ***************/
self.port.on("show", function onShow() {
    user_name.focus();
});
