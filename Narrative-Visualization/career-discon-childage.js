

let svgAge;


const radAge = Math.min(width, height) / 2.5;
const innerArc = d3.arc()
    .innerRadius(radAge * 0.7)
    .outerRadius(radAge - 1)
const outerArc = d3.arc()
    .innerRadius(radAge * 0.9)
    .outerRadius(radAge * 0.9);

let pieAge = d3.pie()
    .sort(null)
    .value(d => d.Population)
    .padAngle(0.005)

let stateAge = {
    data: null,
    hover: {
        screenPosition: null,
        visible: false,
        reason: null,
        ratio: null
    }

}

d3.csv("./data/09_career_discon_child_age_2020.csv", d3.autoType)
    .then(data => {
        stateAge.data = data
        console.log("arc", data)
        initAge()
    })

function initAge() {

    colorAge = d3.scaleOrdinal()
        .domain(stateAge.data.map(d => d.Population))
        .range(["#5b5b5b", "#8675a9", "#9dad7f", "#f4d160"])
    // .range(["#99bbad", "#8ac4d0", "#ffc93c", "#f4a9a8"])

    svgAge = d3.select(".career-discon-childage")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // totalValues = d3.sum(stateAge.data, d => d.Population)
    // console.log("weird", totalValues)

    arcs = pieAge(stateAge.data)
    console.log("phphpph", stateAge.data)
    console.log("pppppppppppppp", arcs)

    svgAge.selectAll("path")
        .data(arcs)
        .join("path")
        // .attr("transform", `translate(${width / 2}, ${width / 2})`)
        .attr("fill", d => {
            console.log(d.data.Group)
            return colorAge(d.data.Group)
        })
        .attr("d", innerArc)
        .attr("stroke", "#f9ffea")
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("fill", "#ff3434")

            // console.log("stacked", d)
            const { clientX, clientY } = event
            stateAge.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                group: d.data.Group, //?????????????????
                pop: d.data.Population, // ????????????????????????????
            }
            drawAge()
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("fill", d => colorAge(d.data.Population))
            // donutTip.transition()
            //     .duration("50")
            //     .attr("opacity", 0)
            stateAge.hover.visible = false
            drawAge()
        })

    // .append('title')
    // .text(d => `${d.data.Group}: ${d.data.Population.toLocaleString()}`);

    svgAge
        .selectAll("boxes")
        .data(stateAge.data.map(d => d.Group))
        .enter()
        .append("circle")
        .attr("cx", -105)
        .attr("cy", (d, i) => -55 + i * 40)
        .attr("r", 8)
        // .attr("height", 50)
        .attr("fill", (d, i) => colorAge(d))


    svgAge
        .selectAll("labels")
        .data(stateAge.data.map(d => d.Group))
        .enter()
        .append("text")
        .attr("y", (d, i) => -55 + i * 40)
        .attr("x", -90)
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("fill", "black")
        .attr("font-size", 18)
    drawAge()

}

function percent(val) {
    return percentage(val) = `${(100 * val / totalValues).toFixed(2)}%`
}

function drawAge() {

    // console.log("hover", [stateAge.hover])
    d3.select(".career-discon-childage")
        .selectAll("div.hover-content")
        .data([stateAge.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 10}px, ${d.screenPosition[1] - 150}px)`
        })
        .html(d => {
            return `
            <div> Group: ${d.group} </div>
            <div> Ratio: ${d3.format(".1%")(d.pop / 1506000)} </div>
        `
        })

}