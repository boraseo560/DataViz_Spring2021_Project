

let svgMap;

let stateMap = {
    geojson: null,
    points: null,
    hover: {
        screenPosition: null, // will be array of [x,y] once mouse is hove#83c5be on something
        mapPosition: null, // will be array of [long, lat] once mouse is hove#83c5be on something
        visible: false
    }
}

Promise.all([
    d3.json('./data/skorea-provinces-2018-geo.json')])
    .then(([geojson, otherData]) => {
        stateMap.geojson = geojson
        // console.log("what:", stateMap.geojson)
        initMap();
    })


function initMap() {
    svgMap = d3.select('.sk-map')
        .append("svg")
        .attr("width", width * 1.2)
        .attr("height", height * 1.2)

    const projection = d3.geoMercator()
        .fitSize([width * 1.2, height * 1.2], stateMap.geojson)

    const pathFunction = d3.geoPath(projection)

    const states = svgMap.selectAll("path")
        .data(stateMap.geojson.features)
        .join("path")
        .attr("class", "states")
        .attr("stroke", "black")
        .attr("stroke-width", "0.7")
        // .attr("fill", "transparent")
        .attr("d", pathFunction)
        .attr("fill", d => {
            if (d.properties.code === "11") return "#83c5be"
            else if (d.properties.code === "21") return "#83c5be"
            else if (d.properties.code === "22") return "#83c5be"
            else if (d.properties.code === "23") return "#83c5be"
            else if (d.properties.code === "24") return "#83c5be"
            else if (d.properties.code === "29") return "#83c5be"
            else if (d.properties.code === "25") return "#83c5be"
            else if (d.properties.code === "26") return "#83c5be"

            else return "transparent";


            // states.on("mousemove", event =>) {

            // }
            drawMap()


        })
}
function drawMap() {

}
