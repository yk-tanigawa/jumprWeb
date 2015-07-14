var store = 2;
var orderDBall = new Firebase('https://glowing-torch-883.firebaseio.com/orders');
var orderDB = orderDBall.child(store);

var debugMode = true;

if (debugMode == false) {
    $("#debugMode").hide();
};

/* hide the template of the order */
//$(".template").hide();

function getPickUpTime($order) {
}

function addOrder(firstName, lastName, timeOfOrder, timeOfPickup, items, orderId) {
    
    var timeAndName = timeOfPickup + " " + firstName + " " + lastName;
    
    $order = $(".orders").children(".order.template").clone();
    $order.removeClass("template");
    $order.show();
    
    
    $order.attr("id", orderId);
    
    $order.find(".timeAndName").text(timeAndName);
    $order.find(".itemList").append(items);
    $order.find(".orderId").text("Order ID : " + orderId);
    $order.find(".timeOfOrder").text("This oreder was created on " + timeOfOrder);
    
    $(".orders").append($order);

}

function removeOrder(orderID) {
    $order = $(".orders").children(".order#" + orderID).remove();  
}

/* push to Server */
$("#push").click(function() {
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
                  confirmed: false});
});


orderDB.on('child_added', function(snapshot, prevChildKey) {
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
        
    /*
      Comfirmation of the order 
                                 */
    
    
    addOrder(firstName, lastName, timeOfOrder, timeOfPickUp, itemsHtml, orderId);

    $(document).on("click", ".order#" + orderId, function(){
        snapshot.ref().remove();
    });
}); 

orderDB.on('child_removed', function(dataSnapshot) {
    var orderIdToBeDeleted = dataSnapshot.ref().key();
    removeOrder(orderIdToBeDeleted);
});


if("12:00" > "11:00"){
    window.alert("hey!");
}


/*
$(document).on("click", ".order", function(){
    //window.alert("deleting the item");
    var orderId = $(this).attr("id");
    removeOrder(orderId);
    //window.alert(orderId + " was removed");
});
*/


