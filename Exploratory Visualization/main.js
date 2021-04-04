const width = window.innerWidth * 0.7,
    height = window.innerHeight * 0.7,
    margin = { top: 20, bottom: 50, left: 60, right: 60 },
    radius = 3;

let svg;
let xScale;
let yScale;
let xAxis;
let yAxis;

// const parseTime = d3.timeParse("%m");
let state = {
    date: [],
    selection: "All"
};

d3.csv('./data/PM25_byMonth_byCity_201501_202005_3.csv', d => {
    return {
        Year: +d.Year,
        City: d.City,
        Month: +d.Month,
        pmtwofive: +d.pmtwofive
    }
})
    .then(data => {
        console.log(data);
        state.data = data;
        init();
    })

function init() {

    xScale = d3.scaleTime()
        .domain(d3.extent(state.data, d => d.Month))
        .range([margin.right, width - margin.left])

    yScale = d3.scaleLinear()
        .domain(d3.extent(state.data, d => d.pmtwofive))
        .range([height - margin.bottom, margin.top])

    xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d"))
    yAxis = d3.axisLeft(yScale)

    svg = d3.select(".pm25-line")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xAxisGroup = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxis)
        .append("text")
        .text("Month")
        .attr("transform", `translate(${width / 2}, ${40})`)

    yAxisGroup = svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxis)
}

function draw() {
    svg.selectAll(".line")

}