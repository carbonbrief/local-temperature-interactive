var credit = "%20—%20via%20@CarbonBrief";
var cityName;
var baseTweet;
var newText;
var encoded;
var customTweet;
var baseTweet2;
var newText2;
var encoded2;
var customTweet2;

// link to click function

$("#custom").on("click", function() {

    // Remove existing iframe
    $('#tweet iframe').remove();

    cityName = document.getElementById('city').innerText;

    baseTweet = "https://twitter.com/intent/tweet?url=http%3A%2F%2Fexample.com&text=";
    newText = document.getElementById('historic').innerText;
    // remove full-stop from tweet text and beginning of text
    newText = newText.slice(11, -1);
    newText = cityName + newText;
    encoded = encodeURI(newText);
    customTweet = baseTweet += encoded += credit;
    $('#custom > a').attr('href', customTweet);

})

$("#custom2").on("click", function() {

    $('#tweet iframe').remove();

    cityName = document.getElementById('city').innerText;

    baseTweet2 = "https://twitter.com/intent/tweet?url=http%3A%2F%2Fexample.com&text=";
    newText2 = document.getElementById('future').innerText;
    // remove full-stop from tweet text and beginning of text
    newText2 = newText2.slice(2, -1);
    newText2 = cityName + newText2;
    encoded2 = encodeURI(newText2);
    customTweet2 = baseTweet2 += encoded2 += credit;
    $('#custom2 > a').attr('href', customTweet2);

})