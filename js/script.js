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
            'fill-opacity': 0.1
        },
        // 'fill-outline': '#f3f3f3',
        // 'fill-outline-opacity': 0.5

    });
});
