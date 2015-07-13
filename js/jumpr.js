var store = 2;
var orderDBall = new Firebase('https://glowing-torch-883.firebaseio.com/orders');
var orderDB = orderDBall.child(store);

$("#submit").click(function(){
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
    var name = newOrder.firstName + " " + newOrder.lastName;
    window.alert(name);
    
}); 