

let svgMap;

let stateMap = {
    geojson: null
};

Promise.all([
    d3.json('./data/skorea-municipalities-2018-geo.json')])
    .then(([geojson, otherData]) => {
        stateMap.geojson = geojson
        console.log("what:", stateMap)
        initMap();
    })

function initMap() {
    svgMap = d3.select('.sk-map')
        .append("svg")
        .attr("width", width * 1.5)
        .attr("height", height)

    const projection = d3.geoMercator()
        .fitSize([width, height], stateMap.geojson)

    const pathFunction = d3.geoPath(projection)

    const states = svgMap.selectAll("path")
        .data(stateMap.geojson.features)
        .join("path")
        .attr("class", "states")
        .attr("stroke", "black")
        .attr("fill", "transparent")
        .attr("d", pathFunction)

}
