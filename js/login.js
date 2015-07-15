var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');

$(document).on("click", "#login", function(){
    
    jumprDB.authWithPassword({
        email    : $('#txtEmail').val(),
        password : $('#txtPass').val()
    }, function(error, authData) {
    if (error) {
        $("#alertTitle").text("Login Failed!");
        switch (error.code) {
            case "INVALID_EMAIL":
                console.log("The specified user account email is invalid.");
                $("#alertDetail").text("The specified user account email is invalid.");
                break;
            case "INVALID_PASSWORD":
                console.log("The specified user account password is incorrect.");
                $('#alertDetail').text("The specified user account password is incorrect.");
                break;
            case "INVALID_USER":
                console.log("The specified user account does not exist.");
                $('#alertDetail').text("The specified user account does not exist.");
                break;
            default:
                console.log("Error logging user in:", error);
                $('#alertDetail').text("Error logging user in:", error);
        }
    } else {
        console.log("Authenticated successfully with payload:", authData);
        $("#alertTitle").text("Login Success!");
        $('#alertDetail').text("uid: " + authData.uid);
        top.location.href = "./order.html";
    }
    });
});

$(document).on("click", "#register", function(){
    jumprDB.createUser({
        email    : $('#txtEmail').val(),
        password : $('#txtPass').val()
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
        }
    });
});



