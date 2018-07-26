function tweetIt () {

    var phrase = document.getElementById('historic').innerText;

    var tweetUrl = 'https://twitter.com/share?text=' +
      encodeURIComponent(phrase) +
      '.' +
      '&url=' +
      'https://www.carbonbrief.org/';
      
    window.open(tweetUrl);
}