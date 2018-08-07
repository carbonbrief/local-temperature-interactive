// var city = {
//     // create array from the data that Zeke sends?
//     // or save as JSON?
//     // saving it as a json triples the file size, so will see whether can use this 
//     // jquery library to read the CSV
//     1: "Lat: 89.5, Long: 150.5, over the ocean"
// }

// document.getElementById('city').innerText = city

// couldn't get to work
// var textCsv = "../data/characteristics.csv";

// var characteristics = $.csv.toObjects(textCsv);

// console.log(characteristics[0]);

document.getElementById('map').addEventListener("click", function () {

    var coords = midCoordLat + ", " + midCoordLong;

    // create new array from characteristics.js based on click event
    var newArray = characteristics.filter(function(x) {
        return x.place === coords;
    });

    // console.log(newArray);
    // console.log(newArray[0]);

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