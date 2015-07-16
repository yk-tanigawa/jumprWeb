var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');



/* Get User Info*/ 

var authData = jumprDB.getAuth();
if (authData) {
    jumprDB.child("users").child(authData.uid).once("value", function(snapshot) {
        /* get cafe id*/
        
        var store = snapshot.key();
        console.log(store);
        
        var menuDB = jumprDB.child("cafes").child(store).child("menu");
        
        $(document).on("click", "#set", function(){
            function addMenu (n, m) {
                function numTo2digits (n) {
                    if ( n < 10 ) {
                        return '0' + ( n % 10 );
                    }else{
                        return '' + (n % 100);
                    }
                }
                
                var nNode = '#pills' + numTo2digits(n) + '-name';
                var mNode = '#pills' + numTo2digits(n) + '-' + numTo2digits(m) + '-name';
                
                var value = parseFloat($('#pills' + numTo2digits(n) + '-' + numTo2digits(m) + '-price').val());                
                                                
                if (!($(nNode).val() === "")) {
                    if ((!($(mNode).val() === "")) && (!isNaN(value))) {
                        console.log('(n, m) = (' + n + ',' + m + ')');
                        menuDB.child($(nNode).val()).child($(mNode).val()).set(value);
                    }
                }
            }
            
                        
            jumprDB.child("cafes").child(store).set({
                name: $('#name').val(),
                address: {
                    address: $('#address').val(),
                    code: $('#code').val(),
                    country: $('#country').val()
                },
            });
            
            for (i = 1; i <= 3 ; i++) {
                for (j = 1; j <= 5 ; j++) {
                    addMenu(i, j);                   
                }
            }                
        });

        /****************/
        /* logout */
        $(document).on("click touchstart tap", "#logout", function(){
            jumprDB.unauth();
            top.location.href = "./login.html";
        });

        
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
    });
}
    
   