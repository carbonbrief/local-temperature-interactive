// first attempt - leaving for now as may want to use some of this

// function tweetIt () {

//     var phrase = document.getElementById('historic').innerText;

//     var tweetUrl = 'https://twitter.com/share?text=' +
//       encodeURIComponent(phrase) +
//       '.' +
//       '&url=' +
//       'https://www.carbonbrief.org/';
      
//     window.open(tweetUrl);
// }

// third attempt

// Remove existing iframe
$('#tweet iframe').remove();

// Problem is that these variables aren't updating every time you click

var credit = "%20—%20via%20@CarbonBrief";
var cityName = document.getElementById('city').innerText;

// For first custom button

var baseTweet = "https://twitter.com/intent/tweet?url=http%3A%2F%2Fexample.com&text=";
var newText = document.getElementById('historic').innerText;
var encoded = encodeURI(newText);
var customTweet = baseTweet += encoded;
$('#custom > a').attr('href', customTweet);

// For second custom button
// Fancier version with credit and updating city name
// can decide later which I prefer

var baseTweet2 = "https://twitter.com/intent/tweet?url=http%3A%2F%2Fexample.com&text=";
var newText2 = document.getElementById('future').innerText;
// remove full-stop from tweet text and beginning of text
newText2 = newText2.slice(2, -1);
// add city to beginning
newText2 = cityName + newText2;
var encoded2 = encodeURI(newText2);
// console.log(encoded2);
var customTweet2 = baseTweet2 += encoded2 += credit;
$('#custom2 > a').attr('href', customTweet2);

// now link to click function so that variables update

$("#custom").on("click", function() {

    // Remove existing iframe
    $('#tweet iframe').remove();

    // NOT YET INCORPORATED
    cityName = document.getElementById('city').innerText;

    // For first custom button
    baseTweet = "https://twitter.com/intent/tweet?url=http%3A%2F%2Fexample.com&text=";
    newText = document.getElementById('historic').innerText;
    encoded = encodeURI(newText);
    customTweet = baseTweet += encoded;
    $('#custom > a').attr('href', customTweet);

})

$("#custom2").on("click", function() {

    // Remove existing iframe
    $('#tweet iframe').remove();

    cityName = document.getElementById('city').innerText;

    baseTweet2 = "https://twitter.com/intent/tweet?url=http%3A%2F%2Fexample.com&text=";
    newText2 = document.getElementById('future').innerText;
    // remove full-stop from tweet text and beginning of text
    newText2 = newText2.slice(2, -1);
    // add city to beginning
    newText2 = cityName + newText2;
    encoded2 = encodeURI(newText2);
    // console.log(encoded2);
    customTweet2 = baseTweet2 += encoded2 += credit;
    $('#custom2 > a').attr('href', customTweet2);

})