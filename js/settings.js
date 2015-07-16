var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');

/* Get User Info*/ 

var authData = jumprDB.getAuth();
if (!authData) {
    top.location.href = "./login.html";
} else {
    jumprDB.child("users").child(authData.uid).once("value", function(snapshot) {
        /* get cafe id*/
        
        var store = snapshot.key();
        console.log(store);
        
        var menuDB = jumprDB.child("cafes").child(store).child("menu");
        
        function numTo2digits (n) {
            if ( n < 10 ) {
                return '0' + ( n % 10 );
            }else{
                return '' + (n % 100);
            }
        }
        function nName(n) {
            return nNode = '#pills' + numTo2digits(n) + '-name';
        }
        function mName(n, m) {
            return mNode = '#pills' + numTo2digits(n) + '-' + numTo2digits(m) + '-name';
        }
        function mVal(n, m) {
            return mNode = '#pills' + numTo2digits(n) + '-' + numTo2digits(m) + '-price';
        }
        
        jumprDB.child("cafes").child(store).once("value", function(shot) {
            if( shot.exists() ) {
                if( shot.child("name").exists() ){
                    $('#name').val(shot.child("name").val());
                }
                if( shot.child("address").exists() ){
                    if( shot.child("address").child("address_1").exists() ){
                        $('#address').val(shot.child("address").child("address_1").val());
                    }
                    if( shot.child("address").child("code").exists() ){
                        $('#code').val(shot.child("address").child("code").val());
                    }
                    if( shot.child("address").child("address_1").exists() ){
                        $('#country').val(shot.child("address").child("country").val());
                    }
                }
                                
                if( shot.child("menu").exists() && shot.child("menu").hasChildren()){
                    var n = 1;
                    shot.child("menu").forEach(function(childSnapshot) {
                        if( n <= 3 ) {
                            $(nName(n)).val(childSnapshot.key());
                            var m = 1;
                            childSnapshot.forEach(function(grandChildSnapshot) {
                                if( m <= 5 ) {
                                    $(mName(n, m)).val(grandChildSnapshot.key());
                                    $(mVal(n, m)).val(grandChildSnapshot.val());
                                    m++;
                                }
                            });
                            n++;
                        }
                    });
                }
                
            }
                
              
        
            $(document).on("click", "#set", function(){
                function addMenu (n, m) {                
                    var nNode = nName(n), mNode = mName(n, m);
                    var value = parseFloat($('#pills' + numTo2digits(n) + '-' + numTo2digits(m) + '-price').val());                
                
                    if (!($(nNode).val() === "" || $(mNode).val() === "" || isNaN(value))) {                                
                        menuDB.child($(nNode).val()).child($(mNode).val()).set(value, function(error){
                            if( error && typeof(console) !== 'undefined' && console.error ) {  
                                console.error(error); 
                            } else {
                                console.log('(n, m) = (' + n + ',' + m + ') success!'); 
                            }
                        });                    
                    }
                }
            
                                                
                jumprDB.child("cafes").child(store).set({
                    name: $('#name').val(),
                    address: {
                        address_1: $('#address').val(),
                        code: $('#code').val(),
                        country: $('#country').val()
                    },
                }, function(error){
                    if( error && typeof(console) !== 'undefined' && console.error ) {  
                        console.error(error); 
                    } else {
                        console.log("cafe info stored");
                        for (i = 1; i <= 3 ; i++) {
                            for (j = 1; j <= 5 ; j++) {
                                addMenu(i, j);                   
                            }
                        }
                        
                    }
                });                                    
            });
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
        top.location.href = "./login.html";
    });
}
    
   