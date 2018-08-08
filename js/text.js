// UPDATE UI TEXT AS CLICK ON MAP

document.getElementById('map').addEventListener("click", function () {

    var coords = midCoordLat + "," + midCoordLong;

    // create new array from characteristics.js based on click event
    var newArray = characteristics.filter(function(x) {
        return x.geo === coords;
    });

    var country = (newArray[0]["adm"]); 
    var observed = (newArray[0]["obs"]);
    var rcp26 = (newArray[0]["26"]);
    var rcp85 = (newArray[0]["85"]);
    var city = (newArray[0]["city"]);

    document.getElementById('country').innerText = country;
    document.getElementById('city').innerText = city;
    document.getElementById('warming').innerText = observed;
    document.getElementById('future-warming1').innerText = rcp26;
    document.getElementById('future-warming2').innerText = rcp85;

})