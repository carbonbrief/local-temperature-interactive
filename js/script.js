// variables to use throughout
var screenWidth = $(window).width();
var consoleWidth = $("#second-console").width();
var getPaddingRight = (consoleWidth + 90);
var midCoordLat;
var midCoordLong;
var midCoords;

var map = new mapboxgl.Map({
    container: 'map',
    style: {
        "version": 8,
        "sources": {
            "simple-tiles": {
                "type": "raster",
                "tiles": [
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
                ],
                "tileSize": 256,
                attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service'
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "simple-tiles",
            "minzoom": 0,
            "maxzoom": 22
        }]
    },
    // style: 'https://openmaptiles.github.io/positron-gl-style/style-cdn.json',
    center: [0, 18],
    // zoomed in a bit to reduce the initial page load time
    zoom: getMinZoom(screenWidth) + 0.9,
    // set so that can zoom in less far on a mobile, to avoid disorientation
    maxZoom: getMinZoom(screenWidth) + 3.5,
    // set so that can zoom out less far on a desktop, to avoid having to render too many tiles
    minZoom: getMinZoom(screenWidth),
    // remove options to rotate or change the pitch of the map
    pitchWithRotate: false,
    dragRotate: false,
    touchZoomRotate: false
});

// disable map zoom when using scroll
map.scrollZoom.disable();

function getMinZoom () {
    if (screenWidth > 1200) {
        return 1.6
    } else if (1201 > screenWidth && screenWidth > 900) {
        return 1.3
    }  else if (901 > screenWidth && screenWidth > 600) {
        return 1
    }  else {
        return 0.6
    }
}

// Add geocoding control
var geocoder = new MapboxGeocoder({
    accessToken: config.key1
});

// Don't include Geocoder on small screens
if (screenWidth > 980) {
    map.addControl(geocoder, 'top-left');
}

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');

map.on('load', function() {

    map.addSource("tiles", {
        "type": 'geojson',
        "data": './data/tiles.json'
    });

    map.addSource("outlines", {
        "type": 'geojson',
        // version correct to 3dp to reduce filesize
        "data": './data/outlines.json'
    });

    map.addLayer({
        id: 'tile-fills',
        type: 'fill',
        source: "tiles",
        paint: {
            "fill-color": "#f3f3f3",
            'fill-color': {
                property: '26',
                stops: [
                    [0, '#0f1d85'],
                    [0.45, '#4b269f'],
                    [0.9, '#802ba4'],
                    [1.35, '#Aa2d93'],
                    [2, '#Ca4a78'],
                    [2.45, '#E66f5d'],
                    [2.9, '#f79649'],
                    [3.35, '#Fbc53d'],
                    [4, '#F0f73f']
                ]
            },
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.2,
                0.65
            ]
        }
    });

    map.addLayer({
        "id": 'tile-lines',
        "type": 'line',
        "source": "tiles",
        "layout": {},
        "paint": {
            'line-color': '#f3f3f3',
            'line-opacity': {
                "type": "exponential",
                "stops": [
                    [1.5,0],
                    [3,0.15],
                    [5,0.3],
                ]
            },
            'line-width': {
                "type": "exponential",
                "stops": [
                    [1.5,0],
                    [3,0.5],
                    [5,0.7],
                    [7,0.9]
                ]
            }
        }
    });

    map.addLayer({
        "id": "country-outlines",
        "type": 'line',
        "source": "outlines",
        "layout": {},
        "paint": {
            'line-color': '#333333',
            'line-opacity': {
                "type": "exponential",
                "stops": [
                    [1.5,0.5],
                    [3,0.6],
                    [5,0.7],
                ]
            },
            'line-width': {
                "type": "exponential",
                "stops": [
                    [1.5,0.5],
                    [3,1],
                    [5,1.3],
                    [7,1.7]
                ]
            }
        }

    })

    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
            "circle-radius": {
                stops: [[1, 5], [3, 6], [5, 7]]
            },
            "circle-color": "#242a3a",
            "circle-opacity": 0.9
        }
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
    });

    // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
    // makes a selection and add a symbol that matches the result.

    geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);

        // add prompt
        var coordinates = ev.result.geometry.coordinates.slice();

        popup.setLngLat(coordinates)
            .setHTML("<p>Click here!</p>")
            .addTo(map);
            
    });

    // RADIO BUTTON INTERACTIONS

    var radios = document.getElementsByName('rcp-radio');

    for(var i = 0, max = radios.length; i < max; i++) {
        radios[i].onclick = function() {

            var scenario = this.value;

            // update the tile fills
            map.setPaintProperty('tile-fills', 'fill-color', {
                property: scenario,
                stops: [
                    [0, '#0f1d85'],
                    [0.45, '#4b269f'],
                    [0.9, '#802ba4'],
                    [1.35, '#Aa2d93'],
                    [2, '#Ca4a78'],
                    [2.45, '#E66f5d'],
                    [2.9, '#f79649'],
                    [3.35, '#Fbc53d'],
                    [4, '#F0f73f']
                ]
            });
        }
    }
    
    var hoveredTileId = null;

    map.on("mousemove", "tile-fills", function(e) {

        if (e.features.length > 0) {
            if (hoveredTileId) {
                map.setFeatureState({source: 'tiles', id: hoveredTileId}, { hover: false});
            }
            hoveredTileId = e.features[0].id;

            map.setFeatureState({source: 'tiles', id: hoveredTileId}, { hover: true});
        }
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "tile-fills", function() {
        if (hoveredTileId) {
            map.setFeatureState({source: 'tiles', id: hoveredTileId}, { hover: false});
        }
        hoveredStateId =  null;
    });

    map.on("click", "tile-fills", function(e) {

        // BRING IN CONSOLE
        enterSecondConsole();

        // HIGHLIGHT CLICKED FEATURE

        var features = map.queryRenderedFeatures(e.point, { layers: ['tile-fills'] });
        if (!features.length) {
            return;
        }
        if (typeof map.getLayer('selectedTile') !== "undefined" ){         
            map.removeLayer('selectedTile')
            map.removeSource('selectedTile');   
        }
        var feature = features[0];

        map.addSource('selectedTile', {
            "type":"geojson",
            "data": feature.toJSON()
        });
        map.addLayer({
            "id": "selectedTile",
            "type": "line",
            "source": "selectedTile",
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "white",
                "line-opacity": 0.95,
                'line-width': {
                    "type": "exponential",
                    "stops": [
                        [1.5,1.3],
                        [3,2.3],
                        [5,3.3],
                        [7,4.3]
                    ]
                }
            }
        });

        // ADJUST VIEW OF MAP

        var coordinates = e.features[0].geometry.coordinates[0];
        var bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.fitBounds(bounds, {
            padding: {
                top: 20,
                right: getPaddingRight,
                left: 20,
                bottom: 20
            }
        });

        // VARIABLES GRAPH AND TEXT

        // centre coords of selected polygon that will use to obtains CSVs
        // Mapbox adds lots of extra decimals so need to remove
        // adding since goes L to R
        midCoordLong = (coordinates[0][0] + 0.5).toFixed(1);
        // must subtract since goes top to bottom
        midCoordLat = (coordinates[0][1] - 0.5).toFixed(1);

        // UPDATE DOWNLOAD BUTTON
        updateDownload();

        // UPDATE URL

        coords = midCoordLong + "_" + midCoordLat;

        window.location.hash = coords;


    })



});

// place these behaviours in functions since using twice
function updateDownload () {

    // no need to go up a filepath since will be adding this to the homepage
    var fileName = "gridcell_" + midCoordLat + "_" + midCoordLong + ".csv";
    var filePath = "data/charts/" + fileName;

    document.getElementById("download1").setAttribute("download", fileName);
    document.getElementById("download1").setAttribute("href", filePath);

    document.getElementById("download2").setAttribute("download", fileName);
    document.getElementById("download2").setAttribute("href", filePath);
}

function enterSecondConsole () {
    // BRING IN CONSOLE
    $('#second-console').removeClass('console-initial console-close').addClass('console-open');
    $('#arrow-left').removeClass("arrow-showing").addClass("arrow-hidden");
    $('#arrow-right').removeClass("arrow-hidden").addClass("arrow-showing");

    // BRING DOWN KEY
    $('#landing-console').removeClass('console-up').addClass('console-down');
    $('#arrow-down').removeClass("arrow-showing").addClass("arrow-hidden");
    $('#arrow-up').removeClass("arrow-hidden").addClass("arrow-showing");
}

// RESET RADIO ON WINDOW RELOAD

$(document).ready(function () {
    rcps.reset();
})

// REMOVE LOADING MASK AFTER SHORT INTERVAL

setTimeout (function() {
    $('#loading').css('visibility', 'hidden');
}, 8000);

// TOGGLE BUTTON

$("#toggle-across").click(function() {
    if (screenWidth > 800) {
        $("#second-console").toggleClass('console-close console-open');
        $('#arrow-left').toggleClass('arrow-showing arrow-hidden');
        $('#arrow-right').toggleClass('arrow-hidden arrow-showing');
    } else if (screenWidth < 801) {
        $("#second-console").toggleClass('console-close console-open');
        // also use this console to toggle the landing console on a smaller screen
        // since the second arrow is hidden. This means that only one can eb on the screen at once
        $("#landing-console").toggleClass('console-up console-down');
        $('#arrow-left').toggleClass('arrow-showing arrow-hidden');
        $('#arrow-right').toggleClass('arrow-hidden arrow-showing');
    }
    
});

$("#toggle-down").click(function() {
    $("#landing-console").toggleClass('console-up console-down');
    $('#arrow-up').toggleClass('arrow-showing arrow-hidden');
    $('#arrow-down').toggleClass('arrow-hidden arrow-showing');
});

// HOME BUTTON

$("#home-button").click(function() {
    map.flyTo({
        center: [10, 10],
        zoom: 1.5,
        bearing: 0,
        pitch: 0,
        speed: 1,
        animate: true
    });
});

// UPDATE UI TEXT AS CLICK ON MAP

document.getElementById('map').addEventListener("click", function () {

    updateUIText();

})

function updateUIText () {

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

}

// UPDATE LOCATION IF HASH IN URL

if(window.location.hash) {
    // Simulate behaviour of map click
    // Unfortunately map.fire method is deprecated so can't just emulate click

    midCoords = window.location.hash;

    // remove hash symbol from beginning
    midCoords = midCoords.substring(1);

    midCoords = midCoords.split("_");

    midCoordLong = midCoords[0];

    midCoordLat = midCoords[1];

    // ADJUST MAP VIEW
    // use the unary plus operator to convert coords to numbers first
    var sw = new mapboxgl.LngLat((+midCoordLong - 0.5), (+midCoordLat - 0.5));
    var ne = new mapboxgl.LngLat((+midCoordLong + 0.5), (+midCoordLat + 0.5));

    var bounds = new mapboxgl.LngLatBounds(sw, ne);

    map.fitBounds(bounds, {
        padding: {
            top: 20,
            right: getPaddingRight,
            left: 20,
            bottom: 20
        }
    });

    // BRING IN CONSOLE
    enterSecondConsole();

    // UPDATE DOWNLOAD BUTTON
    updateDownload();

    // UPDATE TEXT
    updateUIText();
    


} else {
    // do nothing if no hash appended to url
}


