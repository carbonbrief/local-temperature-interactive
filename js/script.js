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
    center: [0, 10],
    maxZoom: 6
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {

    map.addSource("tiles", {
        "type": 'geojson',
        "data": './data/tiles-merge.geojson'
    });

    map.addLayer({
        id: 'tile-fills',
        type: 'fill',
        source: "tiles",
        paint: {
            "fill-color": "#f3f3f3",
            'fill-color': {
                property: 'rcp26',
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
                0.05,
                0.7
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
                    [3,0.2],
                    [5,0.4],
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

    // SCENARIO SLIDER INTERACTIONS

    var getScenario = {
        "1": "rcp26",
        "2": "rcp45",
        "3": "rcp60",
        "4": "rcp85"
    }

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {

        var value = parseInt(e.target.value);

        var scenario = getScenario[value];

        // update the tile fills
        map.setPaintProperty('tile-fills', 'fill-color', {
            property: scenario,
            type: 'exponential',
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
        

        // update text in the UI
        document.getElementById('scenario').innerText = scenario;

        updateTotal();

    });


    var hoveredTileId = null;

    map.on("mousemove", "tile-fills", function(e) {

        if (e.features.length > 0) {
            if (hoveredTileId) {
                map.setFeatureState({source: 'tiles', id: hoveredTileId}, { hover: false});
            }
            hoveredTileId = e.features[0].id;

            // console.log(e.features[0]);
            // console.log(hoveredTileId);

            map.setFeatureState({source: 'tiles', id: hoveredTileId}, { hover: true});
        }
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "tile-fills", function() {
        if (hoveredTileId) {
            map.setFeatureState({source: 'tiles', id: hoveredTileId}, { hover: false});
        }
        hoveredStateId =  null;
        // console.log("leave");
    });

});

