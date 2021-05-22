

let svgMap;

let stateMap = {
    geojson: null,
    points: null,
    hover: {
        screenPosition: null, // will be array of [x,y] once mouse is hove#83c5be on something
        mapPosition: null, // will be array of [long, lat] once mouse is hove#83c5be on something
        visible: false,
        name: null
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
        .attr("width", width * 1.5)
        .attr("height", height * 1.5)

    const projection = d3.geoMercator()
        .fitSize([width * 1.5, height * 1.5], stateMap.geojson)

    const pathFunction = d3.geoPath(projection)

    const cityCode = ["11", "21", "22", "23", "24", "29", "25", "26"]
    const provCode = ["31", "32", "33", "34", "35", "36", "37", "38", "39"]
    const states = svgMap.selectAll("path")
        .data(stateMap.geojson.features)
        .join("path")
        .attr("class", "states")
        .attr("stroke", "black")
        .attr("stroke-width", "0.7")
        // .attr("fill", "transparent")
        .attr("d", pathFunction)
        .attr("fill", d => {
            // console.log("Features", d.properties.name_eng)
            if (cityCode.includes(d.properties.code)) return "#94d0cc"
            else if (provCode.includes(d.properties.code)) return "#ffc2b4"
        })
        .on("mouseover", function (event, d) {
            d3.select(this).transition()
                .duration("120")
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .attr("fill", "#590995")

            const { clientX, clientY } = event

            // 2. invert the projection to go from x/y => lat/long
            // ref: https://github.com/d3/d3-geo#projection_invert
            const [long, lat] = projection.invert([clientX, clientY])
            stateMap.hover = {
                screenPosition: [clientX, clientY], // will be array of [x,y] once mouse is hovered on something
                mapPosition: [long, lat], // will be array of [long, lat] once mouse is hovered on something
                visible: true,
                name: d.properties.name_eng
            }

            drawMap()
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("stroke", "black")
                .attr("stroke-width", "0.7")
                .attr("fill", d => {
                    if (cityCode.includes(d.properties.code)) return "#94d0cc"
                    else if (provCode.includes(d.properties.code)) return "#ffc2b4"
                })

            stateMap.hover.visible = false
            drawMap();
        })

    // states.on("mousemove", event =>) {

    // }
    drawMap()


}

function drawMap() {
    // add div to HTML and re-populate content every time `state.hover` updates
    d3.select(".sk-map") // want to add
        .selectAll('div.hover-content')
        .data([stateMap.hover])
        .join("div")
        .attr("class", 'hover-content')
        .classed("visible", d => d.visible)
        .style("position", 'absolute')
        .style("transform", d => {
            // only move if we have a value for screenPosition
            if (d.screenPosition)
                return `translate(${d.screenPosition[0] - 220}px, ${d.screenPosition[1]+500}px)`
        })
        .html(d => {
            return `
            <div>
            Location: ${d.name}
            </div>
            `
        })
}
