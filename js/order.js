var store = 1;

var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');
var orderDB = jumprDB.child("orders").child(store);
var cafeDB =  jumprDB.child("cafes").child(store);



/*
var authData = jumprDB.getAuth();

if (authData) {
    cafeDB.child("name").once("value", function(snapshot) {
        $("#storeName").text(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    
    
    var store = jumprDB.child("users").child(authData.uid).child("cafe").val();
    console.log("cafe num: " + store);
}

*/
/*
function initialize(authData) {
    if (authData) {
        store = jumprDB.child("users").child(authData.uid).child("cafe").val();
        console.log(store);
        //var orderDB = jumprDB.child("orders").child(store);
        //var cafeDB =  jumprDB.child("cafes").child(store);
    }
}
*/

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

var debugMode = true;

if (debugMode == false) {
    $("#debugMode").hide();
};

/* hide the template of the order */
$(".template").hide();



orderDB.on('child_added', function(snapshot, prevChildKey) {
    function getPickUpTimeAndName($order) {
        return $order.find(".timeAndName").text();
    }

    function addOrder(firstName, lastName, timeOfOrder, timeOfPickUp, items, orderId) {
    var timeAndName = timeOfPickUp + " " + firstName + " " + lastName;
    
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
    
    
    while( getPickUpTimeAndName($order) < getPickUpTimeAndName($orderAfter.prev()) ){
        $orderAfter = $orderAfter.prev();
    }
    
    $orderAfter.before($order);
}

    function confirmOrder (snapshot, firstName, lastName, timeOfOrder, timeOfPickUp, itemsHtml, orderId) {
        var timeAndName = timeOfPickUp + " " + firstName + " " + lastName;
        bootbox.dialog({
        //size: 'large',
        closeButton: false,
        title: timeAndName,
        message: "<large>" + "New order! <br>" + itemsHtml + "</large>",
        buttons: {
            reject: {
                label: "Reject",
                className: "btn-danger",
                callback: function() {
                    /* set confirmation flag 1 and send it to Firebase*/
                    snapshot.child("confirmed").ref().set("-1", function(error) {
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
                    snapshot.child("confirmed").ref().set("1", function(error) {
                        if (error) {
                            alert("Data could not be saved." + error);
                        } else {
                            addOrder(firstName, lastName, timeOfOrder, timeOfPickUp, itemsHtml, orderId);
                        }
                    });
                }
            }
        }
    });
    }

    
    var newOrder = snapshot.val();
    
    var firstName = newOrder.firstName,
        lastName = newOrder.lastName,
        timeOfPickUp = newOrder.timeOfPickUp,
        timeOfOrder = newOrder.timeOfOrder,
        orderId = snapshot.key();
    
    var itemsObj = snapshot.child("items");
    
    var itemsHtml = "<ul>";
    itemsObj.forEach(function(childSnapshot) {
        itemsHtml += '<li>' + childSnapshot.key() + " " + childSnapshot.val() +'</li>';
    });
    itemsHtml += "</ul>";

    
    if (snapshot.child("confirmed").val() === "1") {
        addOrder(firstName, lastName, timeOfOrder, timeOfPickUp, itemsHtml, orderId);
    } else if ( snapshot.child("confirmed").val() === "0" ) {
        confirmOrder(snapshot, firstName, lastName, timeOfOrder, timeOfPickUp, itemsHtml, orderId);
    }
    
    $(document).on("click", ".order#" + orderId, function(){
        snapshot.ref().remove();
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
$(document).on("click", "#push", function(){
    var d = new Date();
    
    var firstName = $(':text[name="firstNameInput"]').val(),
        lastName = $(':text[name="lastNameInput"]').val(),
        timeOfOrder = Date(),
        timeOfPickUp = $(':text[name="pickUpInput"]').val(),
        items = $.parseJSON($(':text[name="itemsInput"]').val());
    orderDB.push({firstName: firstName,
                  lastName: lastName,
                  timeOfOrder: timeOfOrder,
                  timeOfPickUp: timeOfPickUp,
                  items: items,
                  confirmed: "0"});
});

/* logout */
$(document).on("click", "#logout", function(){
    jumprDB.unauth();
    top.location.href = "./login.html";
});
    

/*
$(document).on("click", ".order", function(){
    //window.alert("deleting the item");
    var orderId = $(this).attr("id");
    removeOrder(orderId);
    //window.alert(orderId + " was removed");
});
*/


