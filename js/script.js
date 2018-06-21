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
    center: [0, 10],
    maxZoom: 12
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

var hoveredStateId = null;

map.on('load', function() {

    map.addSource("tiles", {
        "type": 'geojson',
        "data": './data/tiles.geojson'
    });

    map.addLayer({
        "id": 'tile-fills',
        "type": 'fill',
        "source": "tiles",
        "layout": {},
        "paint": {
            "fill-color": "#f3f3f3",
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.1,
                0.5
            ]
        }
        // filter: [ 'all',
        //     [ '==', 'id', 'NONE' ] // start with a filter that doesn't select anything
        // ]
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

    map.on('mousemove', function (e) {

        // var features = map.queryRenderedFeatures(e.point);

        // console.log(e.point, features)

        // var ids = features.map(function (feat) { return feat.properties.id })

        // map.setFilter('tiles', [ 'all',
        //     [ 'in', 'id' ].concat(ids)
        // ])

        // query the map for the under the mouse
        // map.featuresAt(e.point, { radius: 5, includeGeometry: true }, function (err, features) {
        //     if (err) throw err
        //     console.log(e.point, features)
        //     var ids = features.map(function (feat) { return feat.properties.id })

        //     // set the filter on the hover style layer to only select the features
        //     // currently under the mouse
            
        // })

        // When the user moves their mouse over the states-fill layer, we'll update the 
        // feature state for the feature under the mouse.
        map.on("mousemove", "tile-fills", function(e) {
            if (e.features.length > 0) {
                if (hoveredStateId) {
                    map.setFeatureState({source: 'tiles', id: hoveredStateId}, { hover: false});
                }
                hoveredStateId = e.features[0].properties.id;
                map.setFeatureState({source: 'tiles', id : hoveredStateId}, { hover: true});
                console.log(hoveredStateId);
            }
        });

        // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
        map.on("mouseleave", "tile-fills", function() {
            if (hoveredStateId) {
                map.setFeatureState({source: 'tiles', id: hoveredStateId}, { hover: false});
            }
            console.log(hoveredStateId);
            hoveredStateId =  null;
        });

    });

    // map.on('mouseenter', 'tiles', function(e) {
    //     map.setPaintProperty('tiles', {
    //         'fill-opacity': 0.8
    //     });
    // })

    // polygonLayer.on('mouseover', function (this) {
    //     this.setStyle({
    //         fillOpacity: 0,
    //         color: 'black'
    //         });
    // });



});
