var jumprDB = new Firebase('https://glowing-torch-883.firebaseio.com');

/* hide the template of the order */
$(".template").hide();


/* Get User Info*/ 
var authData = jumprDB.getAuth();
if (!authData) {
    top.location.href = "./login.html";
} else {
    var time = new Array(24);
    for(i = 0; i < time.length; i++){
        time[i] = 0;
    }    
    
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
            
            
            function addStatistics (orderID) {
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
                    
                    if(snap.exists()){
                        var newOrder = snap.val();
                        var name = newOrder.name,
                            timeOfPickUp = newOrder.timeOfPickUp,
                            timeOfOrder = newOrder.timeOfOrder,
                            orderId = snap.key();
                        
                        time[parseInt(timeOfPickUp)]++;
                        

                        //addOrder(name, timeOfOrder, timeOfPickUp, "", orderId);
                    }
                });
            }
            
            
            
            var i = 0;
            snapshot.forEach(function(childSnapshot) {
                addStatistics(childSnapshot.val());
                i++;
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
    
    console.log(JSON.parse(JSON.stringify(time)));
}


function plot() {


    var plotdata = [
        { hour: '00:00 - 00:59', transaction: -1 },
        { hour: '01:00 - 01:59', transaction: -1 },
        { hour: '02:00 - 02:59', transaction: -1 },
        { hour: '03:00 - 03:59', transaction: -1 },
        { hour: '04:00 - 04:59', transaction: -1 },
        { hour: '05:00 - 05:59', transaction: -1 },
        { hour: '06:00 - 06:59', transaction: -1 },
        { hour: '07:00 - 07:59', transaction: -1 },
        { hour: '08:00 - 08:59', transaction: -1 },
        { hour: '09:00 - 09:59', transaction: -1 },
        { hour: '10:00 - 10:59', transaction: -1 },
        { hour: '11:00 - 11:59', transaction: -1 },
        { hour: '12:00 - 12:59', transaction: -1 },
        { hour: '13:00 - 13:59', transaction: -1 },
        { hour: '14:00 - 14:59', transaction: -1 },
        { hour: '15:00 - 15:59', transaction: -1 },
        { hour: '16:00 - 16:59', transaction: -1 },
        { hour: '17:00 - 17:59', transaction: -1 },
        { hour: '18:00 - 18:59', transaction: -1 },
        { hour: '19:00 - 19:59', transaction: -1 },
        { hour: '20:00 - 20:59', transaction: -1 },
        { hour: '21:00 - 21:59', transaction: -1 },
        { hour: '22:00 - 22:59', transaction: -1 },
        { hour: '23:00 - 23:59', transaction: -1 },
    ];

    for(i = 0; i < time.length; i++){
        plotdata[i].transaction = time[i];
    }    



    new Morris.Bar({
        // ID of the element in which to draw the chart.
        element: 'time-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: plotdata,
        // The name of the data record attribute that contains x-values.
        xkey: 'hour',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['transaction'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['transaction']
    });


}

setTimeout(function(){ plot(); }, 3000);
/*
$(document).on("click", ".order", function(){
    //window.alert("deleting the item");
    var orderId = $(this).attr("id");
    removeOrder(orderId);
    //window.alert(orderId + " was removed");
});
*/


