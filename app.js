// js main
var x = document.getElementById("myFile");
var myFirebaseRef = new Firebase("https://chehacksregis.firebaseio.com/");

function uploadFile() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "file");
    document.body.appendChild(x);
}