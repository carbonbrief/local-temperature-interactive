// inspired by http://jsfiddle.net/simonsarris/Msdkv/ and http://jsfiddle.net/AbdiasSoftware/YVEhE/8/

var canvas = document.getElementById('canvas-id');
var ctx = canvas.getContext('2d');
var canvasWidth = 100;
var canvasHeight = 100;
//var loading = true;

ctx.translate(10,10); // to move circle from canvas edges

ctx.save();

function rotate () {

    // Clear the canvas
    ctx.restore();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
    // Move registration point to the center of the canvas
    ctx.translate(canvasWidth/2, canvasWidth/2);
        
    // Rotate 2 degrees
    ctx.rotate(Math.PI / 90);
        
    // Move registration point back to the top left corner of canvas
    ctx.translate(-canvasWidth/2, -canvasWidth/2);

    var firstPart = ctx.createLinearGradient(0,0,0,100);
    firstPart.addColorStop(0, '#F0f73f');
    firstPart.addColorStop(0.25, '#Fbc53d');
    firstPart.addColorStop(0.5, '#f79649');
    firstPart.addColorStop(0.75, '#E66f5d');
    firstPart.addColorStop(1, '#Ca4a78');

    var secondPart = ctx.createLinearGradient(0,0,0,100);
    secondPart.addColorStop(1, '#Ca4a78');
    secondPart.addColorStop(0.75, '#Aa2d93');
    secondPart.addColorStop(0.5, '#802ba4');
    secondPart.addColorStop(0.25, '#4b269f');
    secondPart.addColorStop(0, '#0f1d85');


    var width = 7;
    ctx.lineWidth = width;

    // First we make a clipping region for the left half
    ctx.save();
    ctx.beginPath();
    ctx.rect(-width, -width, 50+width, 100 + width*2);
    ctx.clip();

    // Then we draw the left half
    ctx.strokeStyle = firstPart;
    ctx.beginPath();
    ctx.arc(50,50,50,0,Math.PI*2, false);
    ctx.stroke();

    ctx.restore(); // restore clipping region to default

    // Then we make a clipping region for the right half
    ctx.save();
    ctx.beginPath();
    ctx.rect(50, -width, 50+width, 100 + width*2);
    ctx.clip();

    // Then we draw the right half
    ctx.strokeStyle = secondPart;
    ctx.beginPath();
    ctx.arc(50,50,50,0,Math.PI*2, false);
    ctx.stroke();

    ctx.restore(); // restore clipping region to default
}


setInterval(rotate, 20);


// removing loading mask after a short interval
// timed to synchronise with the autoplay of the slider

setTimeout (function() {
    $('#loading').css('visibility', 'hidden');
}, 3500);