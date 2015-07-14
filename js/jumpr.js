var store = 2;
var orderDBall = new Firebase('https://glowing-torch-883.firebaseio.com/orders');
var orderDB = orderDBall.child(store);

var debugMode = true;

if (debugMode == false) {
    $("#debugMode").hide();
};

/* hide the template of the order */
//$(".template").hide();

function addOrder(firstName, lastName, timeOfOrder, timeOfPickup, items, orderId){
    
    var timeAndName = timeOfPickup + " " + firstName + " " + lastName;
    
    $order = $(".orders").children(".order.template").clone();
    $order.removeClass("template");
    $order.show();
    
    
    $order.attr("id", orderId);
    
    $order.find(".timeAndName").text(timeAndName);
    $order.find(".itemList").append(convertToList(items));
    $order.find(".orderId").text("Order ID : " + orderId);
    $order.find(".timeOfOrder").text("This oreder was created on " + timeOfOrder);
    
    $(".orders").prepend($order);

}

function removeOrder(orderID){
    $order = $(".orders").children(".order#" + orderID).remove();  
}

/* push to Server */
$("#push").click(function(){
    var d = new Date();
    
    var firstName = $(':text[name="firstNameInput"]').val(),
        lastName = $(':text[name="lastNameInput"]').val(),
        timeOfOrder = Date(),
        timeOfPickUp = $(':text[name="pickUpInput"]').val(),
        items = $(':text[name="itemsInput"]').val();
    orderDB.push({firstName: firstName,
                  lastName: lastName,
                  timeOfOrder: timeOfOrder,
                  timeOfPickUp: timeOfPickUp,
                  items: items,
                  confirmed: false,
                  orderID: d.getTime()});
});


orderDB.on('child_added', function(snapshot, prevChildKey) {
    var newOrder = snapshot.val();
    var firstName = newOrder.firstName,
        lastName = newOrder.lastName,
        timeOfPickUp = newOrder.timeOfPickUp,
        timeOfOrder = newOrder.timeOfOrder,
        items = newOrder.items,
        orderId = newOrder.orderID;
    
    /*
     *
      Comfirmation of the order 
                                 */
    
    addOrder(firstName, lastName, timeOfOrder, timeOfPickUp, items, orderId);
}); 

orderDB.on('child_removed', function(dataSnapshot) {
    var orderIdToBeDeleted = dataSnapshot.val().orderID;
    removeOrder(orderIdToBeDeleted);
});

$(document).on("click", ".order", function(){
    //window.alert("deleting the item");
    var orderId = $(this).attr("id");
    removeOrder(orderId);
    //window.alert(orderId + " was removed");
});

function convertToListItem(item){
    return "<li>" + item + "</li>";
}

function convertToList(items){
    var list = "<ul>";
    list += convertToListItem(items);
    list += "</ul>";
    return list;
}


