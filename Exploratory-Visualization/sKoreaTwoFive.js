const width = window.innerWidth * 0.5,
    height = window.innerHeight * 0.6,
    margin = { top: 20, bottom: 50, left: 60, right: 60 },
    radius = 3;

let pmTFive;
let xSKFive;
let ySKFive;
let xAxisSKFive;
let yAxisSKFive;

// const parseTime = d3.timeParse("%m");
let state = {
    data: null
};


d3.csv('./data/PM25_byMonth_byCity_201501_202005_annual.csv', d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        City: d.City,
        // Month: new Date(2010, +d.Month - 1, 1),
        pmtwofive: +d.pmtwofive
    }
})
    .then(data => {
        console.log("what is this", data);
        state.data = data;
        init();
    })

function init() {

    xSKFive = d3.scaleTime()
        .domain(d3.extent(state.data, d => d.Year))
        .range([margin.right, (width * 0.8) - margin.left])

    ySKFive = d3.scaleLinear()
        .domain(d3.extent(state.data, d => d.pmtwofive))
        .range([height * 0.8 - margin.bottom, margin.top])

    xAxisSKFive = d3.axisBottom(xSKFive).tickFormat(d3.timeFormat("%Y"))
    yAxisSKFive = d3.axisLeft(ySKFive)

    pmTFive = d3.select(".pm25-line")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xAxisSKFiveGroup = pmTFive.append("g")
        .attr("class", "xAxisSKFive")
        .attr("transform", `translate(${0}, ${(height * 0.8) - margin.bottom})`)
        .call(xAxisSKFive)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${(width * 0.8) / 2}, ${40})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    yAxisSKFiveGroup = pmTFive.append("g")
        .attr("class", "yAxisSKFive")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisSKFive)
        .append("text")
        .text("PM2.5")
        .attr("transform", `translate(${- 25}, ${(height * 0.8) / 2})rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")
    draw();
}

function draw() {

    color = d3.scaleOrdinal(d3.schemePaired)

    nested = d3.groups(state.data, d => d.City)
    console.log("HAHA", nested.key)

    // PM2.5
    const lineFunctionSK = d3.line()
        // .defined(d => !isNaN(d))
        // .curve(d3.curveBasis)
        .x(d => xSKFive(d.Year))
        .y(d => ySKFive(d.pmtwofive))

    const mouseFive = pmTFive.selectAll("path.line")
        .data(nested)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        // .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", "1")
        .attr("stroke", "darkblue")
        .attr("fill", "none")
        .attr("d", d => {
            console.log("d", d)
            return lineFunctionSK(d[1])
        })

    mouseFive
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
        })



}