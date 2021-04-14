


let compSvg;
let xComp;
let yComp;
let xAxisComp;
let yAxisComp;

let stateComp = {
    data: null
}

d3.csv("./data/PM1025_Major_cities_2011-2019.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        City: d.City,
        pmTwoFive: +d.PMTwoFive
    }
}).then(data => {
    stateComp.data = data
    console.log("loaded data:", stateComp.data)
    initComp()
})

function initComp() {

    xComp = d3.scaleTime()
        .domain(d3.extent(stateComp.data, d => d.Year))
        .range([margin.right, width - margin.left])

    yComp = d3.scaleLinear()
        .domain(d3.extent(stateComp.data, d => d.pmTwoFive))
        .range([height - margin.bottom, margin.top])

    xAxisComp = d3.axisBottom(xComp).tickFormat(d3.timeFormat("%Y"))
    yAxisComp = d3.axisLeft(yComp)

    compSvg = d3.select(".comparison")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xAxisGroupComp = compSvg.append("g")
        .attr("class", "xAxisComp")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisComp)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${40})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    yAxisGroupComp = compSvg.append("g")
        .attr("class", "yAxisComp")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisComp)
        .append("text")
        .text("PM2.5")
        .attr("transform", `translate(${-25}, ${height / 2})rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")

    drawComp();
}

function drawComp() {
    nestedData = d3.group(stateComp.data, d => d.City) // ???? 
    console.log(nestedData)

    const lineFunction = d3.line()
        // .defined(d => !isNaN(d))
        // .curve(d3.curveBasis)
        .x(d => xComp(d.Year))
        .y(d => yComp(d.pmTwoFive))

    compSvg.selectAll("path.line")
        .data([stateComp.data])
        .join("path")
        // .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", "2")
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("d", lineFunction);
}