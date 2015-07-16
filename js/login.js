var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');

var aData = jumprDB.getAuth();
if (aData) {
    top.location.href = "./order.html";
}else{
    function authDataCallback(auth) {
        if (auth) {
            console.log("User " + auth.uid + " is logged in with " + auth.provider);
        } else {
            console.log("User is logged out");
        }
    }
    jumprDB.onAuth(authDataCallback);
    
    
    function loginErrorDisplay (error) {
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
    }
    
    $(document).on("click", "#login", function(){
        $("#alertTitle").text("Logging in");
        $('#alertDetail').text("Please wait");
        
        jumprDB.authWithPassword({
            email    : $('#txtEmail').val(),
            password : $('#txtPass').val()
        }, function(error, authData) {
            if (error) {
                loginErrorDisplay(error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $("#alertTitle").text("Login Success!");
                $('#alertDetail').text("uid: " + authData.uid);
                top.location.href = "./order.html";
            }
        });
    });
    
    $(document).on("click", "#register", function(){
        
        $("#alertTitle").text("Registering user");
        $('#alertDetail').text("Please wait");

        function getName(a) {
            switch(a.provider) {
                case 'password':
                    return a.password.email.replace(/@.*/, '');
                case 'twitter':
                    return a.twitter.displayName;
                case 'facebook':
                    return a.facebook.displayName;
            }
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
                
                $("#alertTitle").text("Successfully created user account");
                $('#alertDetail').text("Trying to log in. Please wait");
                        
                jumprDB.authWithPassword({
                    email    : $('#txtEmail').val(),
                    password : $('#txtPass').val()
                }, function(error, authData) {
                    if (error) {
                        loginErrorDisplay(error);
                    } else {
                                                                        
                        $("#alertTitle").text("Login Success!");
                        $('#alertDetail').text("Redirecting. Please wait.");
                        
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
                });

            }
        });
    });
}

