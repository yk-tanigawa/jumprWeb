var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');



/* Get User Info*/ 

var authData = jumprDB.getAuth();
if (!authData) {
    top.location.href = "./login.html";
} else {
    jumprDB.child("users").child(authData.uid).once("value", function(snapshot) {
        /* get cafe id*/
        
        var store = snapshot.child("cafe").val();
        console.log(store);
        $("#label").text("Cafe (current store: " + store + ")")

        $(document).on("click", "#set", function(){
            jumprDB.child("users").child(authData.uid).child("cafe").set($('#cafeNum').val());
            top.location.href = "./order.html";
        });

        /*
        $(document).on("click", "#reset", function(){
            $('#cafeNum').val(store);
        });
        */
        
        /****************/
        
        // Create a callback which logs the current auth state
        function authDataCallback(authData) {
            if (authData) {
                console.log("User " + authData.uid + " is logged in with " + authData.provider);
            } else {
                console.log("User is logged out");
            }
        }
        // Register the callback to be fired every time auth state changes
        jumprDB.onAuth(authDataCallback);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        top.location.href = "./login.html";
    });
}
    
   