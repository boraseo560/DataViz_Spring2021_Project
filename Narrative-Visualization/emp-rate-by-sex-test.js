
let xTest;
let yTest;
let svgTest;
let xAxisTest;
let yAxisTest;

let stateTest = {
    data: null
}

csv = d3.csv("./data/emp_rate_by_sex_reorg.csv", d3.autoType)

// x, y values 
xTest = d3.scaleTime()
    .domain(d3.extent(stateTest.data, d => d.Year))
    .range([margin.right, width - margin.left])
yTest = d3.scaleLinear()
    .domain([40, 100])
    .range([height - margin.bottom, margin.top])

// xAxis, yAxis 
xAxisTest = d3.axisBottom(xTest)
    .tickFormat(d3.timeFormat("%Y"))

yAxisTest = d3.axisLeft(yTest)

// Create svg element 
svgTest = d3.select(".emp-rate-by-sex")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

// Draw chart frame
svgTest.append("g")
    .attr("class", "xAxisTest")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxisTest)
    .append("text")
    .text("Year")
    .attr("transform", `translate(${width / 2}, ${40})`)
    .attr("fill", "black")
    .attr("font-size", "20")

svgTest.append("g")
    .attr("class", "yAxisTest")
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxisTest)
    .append("text")
    .text("Employment Rate")
    .attr("transform", `translate(${- 30}, ${height / 2})rotate(-90)`)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "20")

drawTest()

// Apply chart title 


function drawTest() {
    // Group data by Country to draw multi line
    nestedEmpRate = d3.groups(stateTest.data, d => d.Group)
    console.log(nestedEmpRate[0])

    // Line function each line -> x(year), y(rate)
    const lineEmpRate = d3.line()
        .x(d => xTest(d.Year))
        .y(d => yTest(d.empRate))

    // Draw lines and apply color/stroke-width transition
    svgTest.selectAll("path.line")
        .data(nestedEmpRate)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", "1.5")
        .attr("fill", "none")
        .attr("stroke", d => {
            if (d[0].match(/Women/)) return "#009688"
            else return "#FFB300"
        })
        .attr("d", d => {
            return lineEmpRate(d[1])
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("10")
                .attr("stroke", "#FF5F07")
                .attr("stroke-width", "4")
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("30")
                .attr("stroke", d => {
                    if (d[0].match(/Women/)) return "#009688"
                    else return "#FFB300"
                })
                .attr("stroke-width", "1.5")
        })


    // Apply tooltip box 
}