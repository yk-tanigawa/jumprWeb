var store = 2;
var orderDBall = new Firebase('https://glowing-torch-883.firebaseio.com/orders');
var orderDB = orderDBall.child(store);

var debugMode = true;

if (debugMode == false) {
    $("#debugMode").hide();
};

/* push to Server */
$("#push").click(function(){
    /*
    var firstName = $("#firstNameInput").val(), 
        lastName = $("#LastNameInput").val(),
        store = $("storeInput").val(),
        timeOfPickUp = $("pickUpInput").val(),
        items = $("itemsInput").val(),
        timeOfOrder = "12:00";
        */
    var firstName = "Yosuke",
        lastName = "TANIGAWA",
        timeOfOrder = "12:55",
        timeOfPickUp = "13:00",
        items = "{croissant: 1, coffee: 1}";
        //items = '{"croissant" : 1.6,"pain au chocolat" : 1.4}';
    orderDB.push({firstName: firstName, lastName: lastName, timeOfOrder: timeOfOrder, timeOfPickUp: timeOfPickUp, orderList: items});
});


orderDB.on('child_added', function(snapshot) {
    var newOrder = snapshot.val();
    var name = newOrder.firstName + " " + newOrder.lastName,
        timeOfPickUp = newOrder.timeOfPickUp,
        timeOfOrder = newOrder.timeOfOrder,
        orderList = newOrder.orderList;
    var timeAndName = timeOfPickUp + ' ' + name;
    window.alert(timeAndName);
    
}); 

$(".timeline-badge").click(function(){
    $(this).parents(".order").remove();    
    window.alert("removed");
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


$("#add").click(function(){
    
    $order = $(".orders").children(".order.template").clone();
    
    var firstName = "Yosuke",
        lastName = "TANIGAWA",
        timeOfOrder = "12:55",
        timeOfPickUp = "14:00",
        items = "croissant: 1",
        orderId = 5;
    var timeAndName = timeOfPickUp + " " + firstName + " " + lastName;
    
    $order.attr('id', orderId);
    $order.find(".timeAndName").text(timeAndName);
    $order.find(".itemList").append(convertToList(items));
    $order.find(".orderId").text("Order ID : " + orderId);
    $order.find(".timeOfOrder").text("This oreder was created on " + timeOfOrder);
    
    $(".orders").prepend($order);
    
    //$order = $(".order.template").clone();
    //$order.remove();
    /*
    $order.removeClass("template");
    $order.show();
    
    var firstName = "Yosuke",
        lastName = "TANIGAWA",
        timeOfOrder = "12:55",
        timeOfPickUp = "13:00",
        items = "{croissant: 1, coffee: 1}";
*/
/*
    $order.attr('id', entry);
    $entry.children(".text").html(entry + " Priority(" + priority + ")");
    $entry.data('priority', priority);
    $entry.data('name', entry);
    */

});
