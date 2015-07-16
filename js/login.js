var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');

// Create a callback which logs the current auth state
function authDataCallback(authData) {
    
    
    
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
        function saveUserData(authD) {
            // find a suitable name based on the meta info given by each provider
            function getName(authdata) {
                switch(authdata.provider) {
                    case 'password':
                        return authdata.password.email.replace(/@.*/, '');
                    case 'twitter':
                        return authdata.twitter.displayName;
                    case 'facebook':
                        return authdata.facebook.displayName;
                }
            }
        
        console.log(authD.uid);
        console.log(authData.uid); 
        console.log(authData.provider); 
        console.log(getName(authData)); 
            
        jumprDB.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: getName(authData),
            cafe: authData.uid
        }, function(error){
            if( error && typeof(console) !== 'undefined' && console.error ) {  
                console.error(error); 
            } else {
                top.location.href = "./settings.html";
            }
        });
    }
    
    jumprDB.createUser({
        email    : $('#txtEmail').val(),
        password : $('#txtPass').val(),
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
            $("#alertTitle").text("Error creating user:");
            $("#alertDetail").text("Please fill the email & password.");
        } else {
            console.log("Successfully created user account with uid:", userData.uid);            
                        
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
                    saveUserData(userData);
                    $("#alertTitle").text("Login Success!");
                    $('#alertDetail').text("uid: " + authData.uid);                    
                }
            });

            
            //$("#alertTitle").text("Successfully created user account");
            //$("#alertDetail").text("Please click the login button");   
        }
    });
});
    
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
        console.log("User is logged out");
    }
}

// Register the callback to be fired every time auth state changes
jumprDB.onAuth(authDataCallback);


