// first attempt - working, but want to open within the same window

function tweetIt () {

    var phrase = document.getElementById('historic').innerText;

    var tweetUrl = 'https://twitter.com/share?text=' +
      encodeURIComponent(phrase) +
      '.' +
      '&url=' +
      'https://www.carbonbrief.org/';
      
    window.open(tweetUrl);
}

// second attempt

// update when map clicked

$('#map').on('click', function(ev) {
    ev.preventDefault();
    // Remove existing iframe
    $('#tweetBtn iframe').remove();
    // Generate new markup
    var tweetBtn = $('<a></a>')
        .addClass('twitter-share-button')
        .attr('href', 'http://twitter.com/share')
        .attr('data-url', 'http://test.com')
        .attr('data-via', 'CarbonBrief')
        .attr('data-text', $('#historic').text());
    $('#tweetBtn').append(tweetBtn);
    twttr.widgets.load();
    // twttr.widgets.onload(changeColor);

    // function changeColor () {
    //     $('.btn').css("background-color", "#333333");
    //     console.log("change color");
    // }
});
