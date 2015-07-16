var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');

/* hide the template of the order */
$(".template").hide();

/* Get User Info*/ 

var authData = jumprDB.getAuth();
if (!authData) {
    top.location.href = "./login.html";
} else {
    jumprDB.child("users").child(authData.uid).once("value", function(snapshot) {
        /* get cafe id*/
        
        var store = snapshot.child("cafe").val();
        var cafeDB =  jumprDB.child("cafes").child(store);
        var historyDB = jumprDB.child("history");
        
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

        cafeDB.child("name").once("value", function(snapshot) {
            $("#storeName").text(snapshot.val());
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        cafeDB.child("history").once("value", function(snapshot) {
            function addOrderById (orderID) {
                historyDB.child(orderID).once("value", function(snap) {                    
                    /* Display order info on the dashboard */
                    function addOrder(name, timeOfOrder, timeOfPickUp, items, orderId) {
                        function getPickUpTimeAndName($order) {
                            return $order.find(".timeAndName").text();
                        }
                
                        var timeAndName = timeOfPickUp + " " + name;
    
                        $orders = $(".orders")
                        $orderBottom = $orders.children(".order.template");
                        $orderAfter = $orderBottom;
    
                        $order = $orders.children(".order.template").clone();
                        $order.removeClass("template");
                        $order.show();
    
                        $order.attr("id", orderId);
    
                        $order.find(".timeAndName").text(timeAndName);
                        $order.find(".itemList").append(items);
                        $order.find(".orderId").text("Order ID : " + orderId);
                        $order.find(".timeOfOrder").text("This oreder was created on " + timeOfOrder);
    
                        /* find the best place to display the order */
                        while( getPickUpTimeAndName($order) < getPickUpTimeAndName($orderAfter.prev()) ){
                            $orderAfter = $orderAfter.prev();
                        }
    
                        $orderAfter.before($order);
                    }
                    
                    var newOrder = snap.val();
                    var name = newOrder.name,
                        timeOfPickUp = newOrder.timeOfPickUp,
                        timeOfOrder = newOrder.timeOfOrder,
                        orderId = snap.key();
    
                    var itemsObj = snap.child("items");
                    var itemsHtml = "<ul>";
                    itemsObj.forEach(function(childSnapshot) {
                        itemsHtml += '<li>' + childSnapshot.key() + " " + childSnapshot.val() +'</li>';
                    });
                    itemsHtml += "</ul>";

                    addOrder(name, timeOfOrder, timeOfPickUp, itemsHtml, orderId);
                });
            }
            
            
            snapshot.forEach(function(childSnapshot) {
                addOrderById(childSnapshot.val());
            });
        });
                
        /* logout */
        $(document).on("click", "#logout", function(){
            jumprDB.unauth();
            top.location.href = "./login.html";
        });
        
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        top.location.href = "./login.html";
    });
}
    
   

/*
$(document).on("click", ".order", function(){
    //window.alert("deleting the item");
    var orderId = $(this).attr("id");
    removeOrder(orderId);
    //window.alert(orderId + " was removed");
});
*/


