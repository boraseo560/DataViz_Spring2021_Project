
let pmTen;
let xSKTen;
let ySKTen;
let xAxisSKTen;
let yAxisSKTen;

// const parseTime = d3.timeParse("%m");
let stateTen = {
    data: [],
    selection: "All"
};


d3.csv('./data/PM10_byMonth_byCity_201101_202005_3.csv', d => {
    return {
        Year: +d.Year,
        City: d.City,
        Month: new Date(2010, +d.Month - 1, 1),
        pmTen: +d.PMTen
    }
})
    .then(data => {
        console.log(data);
        stateTen.data = data;
        initTen();
    })

function initTen() {

    xSKTen = d3.scaleTime()
        .domain(d3.extent(stateTen.data, d => d.Month))
        .range([margin.right, (width * 0.7) - margin.left])

    ySKTen = d3.scaleLinear()
        .domain(d3.extent(stateTen.data, d => d.pmTen))
        .range([height * 0.8 - margin.bottom, margin.top])

    xAxisSKTen = d3.axisBottom(xSKTen).tickFormat(d3.timeFormat("%b"))
    yAxisSKTen = d3.axisLeft(ySKTen)

    pmTen = d3.select(".pm10-line")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xAxisSKTenGroup = pmTen.append("g")
        .attr("class", "xAxisSKTen")
        .attr("transform", `translate(${0}, ${(height * 0.8) - margin.bottom})`)
        .call(xAxisSKTen)
        .append("text")
        .text("Month")
        .attr("transform", `translate(${(width * 0.7) / 2}, ${40})`)

    yAxisSKTenGroup = pmTen.append("g")
        .attr("class", "yAxisSKTen")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisSKTen)
    drawTen()
}

function drawTen() {
    pmTen.selectAll(".line")

}