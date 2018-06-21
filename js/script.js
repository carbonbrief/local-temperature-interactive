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

map.on('load', function() {

    map.addLayer({
        id: 'tiles',
        type: 'fill',
        source: {
            type: 'geojson',
            data: './data/tiles.geojson'
        },
        paint: {
            'fill-color': "#f3f3f3",
            'fill-opacity': 0.5
        },
        filter: [ 'all',
            [ '==', 'GEOID10', 'NONE' ] // start with a filter that doesn't select anything
        ]
    });

    map.addLayer({
        id: 'outline',
        type: 'line',
        source: {
            type: 'geojson',
            data: './data/tiles.geojson'
        },
        paint: {
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

    // map.on('mousemove', function (e) {

    //     // query the map for the under the mouse
    //     map.featuresAt(e.point, { radius: 5, includeGeometry: true }, function (err, features) {
    //         if (err) throw err
    //         console.log(e.point, features)
    //         var ids = features.map(function (feat) { return feat.properties.GEOID10 })

    //         // set the filter on the hover style layer to only select the features
    //         // currently under the mouse
    //         map.setFilter('states-hover', [ 'all',
    //         [ 'in', 'GEOID10' ].concat(ids)
    //         ])
    //     })

    // });

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
