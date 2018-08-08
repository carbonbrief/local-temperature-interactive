// UPDATE UI TEXT AS CLICK ON MAP

document.getElementById('map').addEventListener("click", function () {

    var coords = midCoordLat + ", " + midCoordLong;

    // create new array from characteristics.js based on click event
    var newArray = characteristics.filter(function(x) {
        return x.place === coords;
    });

    var country = (newArray[0]["country"]); 
    var observed = (newArray[0]["obs"]);
    var rcp26 = (newArray[0]["26"]);
    var rcp85 = (newArray[0]["85"]);

    document.getElementById('country').innerText = country;
    document.getElementById('city').innerText = coords;
    document.getElementById('warming').innerText = observed;
    document.getElementById('future-warming1').innerText = rcp26;
    document.getElementById('future-warming2').innerText = rcp85;

})