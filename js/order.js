var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');

var debugMode = false;

if (debugMode === false) {
    $("#debugMode").hide();
};

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
        console.log(store);
        var orderDB = jumprDB.child("orders").child(store);
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

        orderDB.on('child_added', function(snapshot, prevChildKey) {
            function getPickUpTimeAndName($order) {
                return $order.find(".timeAndName").text();
            }

            /* Display order info on the dashboard */
            function addOrder(name, timeOfOrder, timeOfPickUp, items, total, orderId) {
                
                function highlightOrder ($item, timeOfPickUp) {
                    function highlight ($item) {
                        $item.children(".timeline-panel").addClass("urgent")
                    }
                    
                    function getHour (string) {
                        return parseInt(string.substring(0,2));
                    }
                    function getMinute (string) {
                        return parseInt(string.substring(3,5));
                    }                    
                    
                    var offset = 5;
                    // preparation time is 5 min.
                    var now = new Date();
                    var pickUp = new Date(now.getYear() + 1900, now.getMonth(), now.getDate(),
                                          getHour(timeOfPickUp), getMinute(timeOfPickUp) - offset);
                    
                    var diff = pickUp - now;
                    if ( diff > 0 ) {
                        setTimeout(function(){ highlight($item); }, pickUp - now);
                    } else {
                        highlight($item);
                    }
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
                $order.find(".total").text("total : " + total);
                $order.find(".orderId").text("Order ID : " + orderId);
                $order.find(".timeOfOrder").text("This oreder was created on " + timeOfOrder);
    
                /* find the best place to display the order */
                while( getPickUpTimeAndName($order) < getPickUpTimeAndName($orderAfter.prev()) ){
                    $orderAfter = $orderAfter.prev();
                }
    
                $orderAfter.before($order);
                
                highlightOrder($order, timeOfPickUp);

                
                /**/
                
                
            }

            function confirmOrder (snapshot, name, timeOfOrder, timeOfPickUp, itemsHtml, total, orderId) {
                var timeAndName = timeOfPickUp + " " + name;
                bootbox.dialog({
                    //size: 'large',
                    closeButton: false,
                    title: timeAndName,
                    message: "<large>" + "New order! <br />" + 
                             itemsHtml + "<br />" +
                            "total : " + total + "</large>",
                    buttons: {
                        reject: {
                            label: "Reject",
                            className: "btn-danger",
                            callback: function() {
                                /* set confirmation flag 1 and send it to Firebase*/
                                snapshot.child("confirmed").ref().set(-1, function(error) {
                                    if (error) {
                                        alert("Data could not be saved." + error);
                                    }
                                });
                            }
                        },
                        confirm: {
                            label: "Confirm",
                            className: "btn-success",
                            callback: function() {
                                /* set confirmation flag 1 and send it to Firebase*/
                                snapshot.child("confirmed").ref().set(1, function(error) {
                                    if (error) {
                                        alert("Data could not be saved." + error);
                                    } else {
                                        addOrder(name, timeOfOrder, timeOfPickUp, itemsHtml, total, orderId);
                                    }
                                });
                            }
                        }
                    }
                });
            }

    
            var newOrder = snapshot.val();
     
            var name = newOrder.name,
                timeOfPickUp = newOrder.timeOfPickUp,
                timeOfOrder = newOrder.timeOfOrder,
                total = parseFloat(newOrder.total + "" ).toFixed(2),
                orderId = snapshot.key();
    
            var itemsObj = snapshot.child("items");
            var itemsHtml = "<ul>";
            itemsObj.forEach(function(childSnapshot) {
                itemsHtml += '<li>' + childSnapshot.key() + " x " + childSnapshot.val() +'</li>';
                //itemsHtml += '<li>' + childSnapshot.val() +'</li>';
            });
            itemsHtml += "</ul>";
                
            if (snapshot.child("confirmed").val() === 1) {
                addOrder(name, timeOfOrder, timeOfPickUp, itemsHtml, total, orderId);
            } else if ( snapshot.child("confirmed").val() === 0 ) {
                confirmOrder(snapshot, name, timeOfOrder, timeOfPickUp, itemsHtml, total, orderId);
            }
    
            $(document).on("click touchstart tap", ".order#" + orderId, function(){
                cafeDB.child("history").push( orderId, function(error){
                    if( error && typeof(console) !== 'undefined' && console.error ) {  
                        console.error(error); 
                    } else {
                        /* copy the order to history DB */
                        historyDB.child(orderId).set( snapshot.val(), function(error) {
                            if( error && typeof(console) !== 'undefined' && console.error ) {  
                                console.error(error); 
                            } else {
                                /* delete item from order DB */
                                snapshot.ref().remove();
                            }
                        });
                    }
                });  
            });
            
        }); 

        orderDB.on('child_removed', function(dataSnapshot) {
            function removeOrder(orderID) {
                $order = $(".orders").children(".order#" + orderID).remove();  
            }
    
            var orderIdToBeDeleted = dataSnapshot.ref().key();
            removeOrder(orderIdToBeDeleted);
        });

        /* push to Server */
        $(document).on("click touchstart tap", "#push", function(){
            var d = new Date();
    
            var name = $(':text[name="nameInput"]').val(),
                timeOfOrder = Date(),
                timeOfPickUp = $(':text[name="pickUpInput"]').val(),
                items = $.parseJSON($(':text[name="itemsInput"]').val());
            
            orderDB.push({
                name: name,
                timeOfOrder: timeOfOrder,
                timeOfPickUp: timeOfPickUp,
                items: items,
                confirmed: 0});
        });

        
        /* logout */
        $(document).on("click touchstart tap", "#logout", function(){
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


