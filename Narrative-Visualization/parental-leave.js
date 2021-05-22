
let xLeave;
let yLeave;
let svgLeave;
let xAxisLeave;
let yAxisLeave;

let stateLeave = {
    data: null,
    hover: {
        screenPosition: null,
        visible: false,
        category: null,
        time: null
    }
}

// Get year only 
const formatTimeE = d3.timeFormat("%Y")

d3.csv("./data/04_parental_leave.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        Total: +d.Total,
        Father: +d.Father,
        Mother: +d.Mother,
        Ratio: +d['Ratio(M/Total)']
    }
}).then(data => {
    stateLeave.data = data
    console.log("Leave", data)
    initLeave()
})

function initLeave() {
    xLeave = d3.scaleBand()
        // .domain(["2010", "2014", "2017", "2018", "2019"])
        .domain(stateLeave.data.map(d => formatTimeE(d.Year)))
        .range([margin.left, width - margin.right])
        .padding(.2)

    const maxValue = d3.max(stateLeave.data, d => d.Father + d.Mother + 10000)
    yLeave = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height - margin.bottom, margin.top])


    xAxisLeave = d3.axisBottom(xLeave).tickSizeOuter(0)
    yAxisLeave = d3.axisLeft(yLeave)

    svgLeave = d3.select(".parental-leave")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svgLeave.append("g")
        .attr("class", "xAxisLeave")
        .attr("transform", `translate(${10}, ${height - margin.bottom})`)
        .call(xAxisLeave)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${50})`)
        .attr("fill", "#2a2a2a")
        .attr("font-size", "20")
    // .selectAll(".tick text")
    // .attr("font-size", "15")

    svgLeave.append("g")
        .call(yAxisLeave)
        .attr("class", "yAxisLeave")
        .attr("transform", `translate(${margin.left + 10}, ${0})`)
        .append("text")
        .text("Population")
        .attr("transform", `translate(${45}, ${margin.bottom - 30})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#2a2a2a")
        // .selectAll(".tick text")
        .attr("font-size", "20")

    const keysLeave = ["Father", "Mother"]
    stack = d3.stack().keys(keysLeave)
    stackLeave = stack(stateLeave.data)
    // .map(d => (d.forEach(v => v.key = d.key), d))
    // console.log("hehe", stackLeave)

    const colorLeave = d3.scaleOrdinal().range(["#d3e785", "#0f5e7f"]).domain(keysLeave)

    const groups = svgLeave.append("g")
        .selectAll("g")
        .data(stackLeave)
        .join("g")
        .attr("fill", d => {
            // console.log("???", d.key)
            return colorLeave(d.key)
        })
        .selectAll("rect")
        .data(d => {
            // console.log("see d", d)
            const withKey = d.map(e => { e.key == d.key; return e })
            // console.log("withKey", withKey)
            return withKey
        })
        .join("rect")
        // .enter().append("rect")
        .attr("x", d => xLeave(formatTimeE(d.data.Year)) + xLeave.bandwidth() / 4 + 10)
        .attr("y", d => yLeave(d[1]))
        .attr("height", d => yLeave(d[0]) - yLeave(d[1]))
        .attr("width", xLeave.bandwidth() / 2)

    groups.on('mouseover', function (event, d) {
        d3.select(this)
            .transition("50")
            .attr("fill", "#ff4646")
        const stacKey = this.parentElement.__data__.key
        const stackValue = this.parentElement.__data__.map((e, i) => { return e[i] })
        // console.log("this", this)
        // console.log("stacked", d[1])
        const what = (d[1] - d[0])
        // console.log("what check", typeof (what))
        const { clientX, clientY } = event
        stateLeave.hover = {
            screenPosition: [clientX, clientY],
            visible: true,
            category: stacKey,
            ratio: what
        }
        drawLeave()
    })
    groups.on('mouseout', function (event, d) {
        d3.select(this)
            .transition("50")
            .attr("fill", (d, i) => {
                // console.log("d[0]???", d[0])
                // console.log("hahahahaha", stackLeave[0][2][1])

                if (d[0] === 0) return "#d3e785"
                else return "#0f5e7f"
            })
        stateLeave.hover.visible = false
        drawLeave()

    })

    svgLeave
        .selectAll("boxes")
        .data(keysLeave)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 29)
        .attr("x", (d, i) => 709 + (i * (size + 12 + rect_padding)))
        .attr("width", 20)
        .attr("height", 8)
        .attr("fill", d => colorLeave(d[0]))
    // {
    //     console.log("legend", d[0])
    //     if (d[0] === "S") return "#f95959"
    //     else if (d[0] === "U") return "#ffb037"
    //     else if (d[1] === "t") return "#aacfd0"
    // })   
    svgLeave.selectAll("labels")
        .data(["Father", "Mother"])
        .enter()
        .append("text")
        .attr("y", border_padding - 24)
        .attr("x", (d, i) => 710 + 10 + i * (size + 12 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")

    drawLeave()
}


function drawLeave() {

    // console.log("hover", [stateLeave.hover])
    d3.select(".parental-leave")
        .selectAll("div.hover-content")
        .data([stateLeave.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 10}px, ${d.screenPosition[1] - 40}px)`
        })
        .html(d => {
            return `
            <div> Group: ${d.category} </div>
            <div> Population: ${d3.format(",")(d.ratio)} </div>
        `
        })

}