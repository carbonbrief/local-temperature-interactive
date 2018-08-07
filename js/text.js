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

console.log(characteristics[0]);

document.getElementById('map').addEventListener("click", function () {

    console.log(midCoordLong);
    console.log(midCoordLat);

})