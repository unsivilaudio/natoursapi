const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
    'pk.eyJ1IjoidW5zaXZpbCIsImEiOiJja2UzNGs5bDQwZmp3MnRtYXFpMHRiaWpzIn0.LuwfMa5qKtr0SUKi7OAalg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/unsivil/ckfsov7e006tg19nzjj1zkokz',
    scrollZoom: false,
    // center: [],
    // zoom: 10,
    // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    bounds.extend(loc.coordinates);

    new mapboxgl.Popup({
        offset: 30,
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
    },
});
