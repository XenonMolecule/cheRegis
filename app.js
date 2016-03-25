// js main
var x = document.getElementById("myFile");
var myFirebaseRef = new Firebase("https://chehacksregis.firebaseio.com/");
var requiredTextIDs = ["#first","#last","#email","#number","#zip","#school"];
var requiredSelectorIDs = ["#grade","#teeSize","#firstHackathon"];
var inputEmpty = $("<h5><font color='red' id='warning'>&nbsp&nbspSome Required Fields Are Empty</font></h5>");
var file = new FileReader();
var fileData;
var hasResume = false;
var fileState = 0;
var resumeLoading = $("<h5><font color='red' id='warning' class = 'loading'>Attempting to load your resume still... Please wait, and you will be redirected</font><h5>");

$("#submit").on("click",function(){
    updateFirebase();
});

//background
$(".bg").interactive_bg({
   strength: 25,
   scale: 1.05,
   animationSpeed: "100ms",
   contain: true,
   wrapContent: false
 });
//check if all the required info is supplied

function check(){
    var amtFilled = 0;
    for(var i=0; i<requiredTextIDs.length;i++){
        if(checkText(requiredTextIDs[i])){
            amtFilled++;
        } else {
            console.log("Required Field: "+requiredTextIDs[i]+" is empty");
            $(requiredTextIDs[i]).addClass("unselected");
        }
    }
    for(var i=0; i<requiredSelectorIDs.length;i++){
        if(checkSelection(requiredSelectorIDs[i])){
            amtFilled++;
        } else {
            console.log("Required Selection: "+requiredSelectorIDs[i]+" is unselected");
            $(requiredSelectorIDs[i]).addClass("unselected");
        }
    }
    if(amtFilled===(requiredTextIDs.length+requiredSelectorIDs.length)){
        return true;
    } else {
        return false;
    }
}

function checkText(id){
    if($(id).val()!=""){
        return true;
    } else {
        return false;
    }
}

function checkSelection(id){
    if($(id).val()!="select"){
        return true;
    } else {
        return false;
    }
}

//send answers to firebase
function updateFirebase(){
    if(check()){
        goToNextPage();
    } else {
        $("#required").after(inputEmpty);
        $('html, body').animate({
            scrollTop: $("#warning").offset().top
        }, 1000);
    }
}

file.onload = (function(event){
    fileData = file.result;
    console.log("loaded");
    hasResume = true;
    fileState = 2;
});

$("#optionalResume").on("change", function (){
    var input = document.getElementById('optionalResume');
    fileState = 1;
    if(input.files[0]){
        console.log("successful upload");
        file.readAsDataURL(input.files[0]);
    }
    console.log("new file");
});

function goToNextPage(){
    if(fileState!=1){
        console.log("sending to firebase...");
        var firstName = $("#first").val();
        var lastName = $("#last").val();
        var email =  $("#email").val();
        var number = $("#number").val();
        var zip = $("#zip").val();
        var school = $("#school").val();
        var dietRestrict = $("#dietRestrict").val();
        var grade = $("#grade").val();
        var teeSize = $("#teeSize").val();
        var firstHackathon = $("#firstHackathon").val();
        var gender = $("#gender").val();
        var workshops = $("#workshops").val();
        var reasonToCome = $("#reasonToCome").val();
        var name = (firstName+"_"+lastName);
        var personalRef =  new Firebase("https://chehacksregis.firebaseio.com/peopleRegistered/"+name+"/");
        if(hasResume){
            fileData = file.result;
        }
        personalRef.update({
            "email":email,
            "phoneNumber":number,
            "zipCode":zip,
            "school":school,
            "dietaryRestrictions":dietRestrict,
            "grade":grade,
            "tShirtSize":teeSize,
            "firstHackathon":firstHackathon,
            "gender":gender,
            "workshopRequests":workshops,
            "reasonToCome":reasonToCome,
            "dateRegistered": new Date(),
            "resume":fileData
        });
        finalSending(personalRef);
        $('html, body').animate({
            scrollTop: $(".loading").offset().top
        }, 1000);
    } else{
        setTimeout(goToNextPage,1000);
        $("#required").after(resumeLoading);
        
    }
}

function finalSending(ref){
    if(fileState===2){
        if(firebaseDone(ref)){
            document.location = "tabs/thanks/thanks.html";
        } else {
            setTimeout(finalSending,100,ref);
            $("#required").after(inputEmpty);
        }
    } else {
        document.location = "tabs/thanks/thanks.html";
    }
}

function firebaseDone(ref){
    var data;
    var ref2 = new Firebase("https://chehacksregis.firebaseio.com/peopleRegistered/"+name+"/resume/")
    ref2.on("value", function(snapshot) {
        data = snapshot.val();
        console.log(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    if(data===fileData||data===null){
        return true;
    } else {
        return false;
    }
}