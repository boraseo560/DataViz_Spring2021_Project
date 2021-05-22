let xEmpChild;
let yEmpChild;
let svgEmpChild;
let xAxisEmpChild;
let yAxisEmpChild;

let stateEmpChild = {
    data: null
}

d3.csv("./data/emp_rate_by_child_age_2016_2020_org_.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        Group: d['FM_ChildAge'],
        Rate: d.Rate
    }
}).then(data => {
    stateEmpChild.data = data
    initEmpChild()
})

function initEmpChild() {
    // Color scheme
    // const colorFertil = d3.scaleSequentialSqrt()
    // .domain([1, 3])
    // .range(["#7d82b8", "#ffffff"])

    // x, y values 
    xEmpChild = d3.scaleTime()
        .domain(d3.extent(stateEmpChild.data, d => d.Year))
        .range([margin.right, width - margin.left])
    yEmpChild = d3.scaleLinear()
        .domain([40, 100])
        .range([height - margin.bottom, margin.top])

    // xAxis, yAxis 
    xAxisEmpChild = d3.axisBottom(xEmpChild)
        .tickFormat(d3.timeFormat("%Y"))

    yAxisEmpChild = d3.axisLeft(yEmpChild).ticks("6", "f")

    // Create svg element 
    svgEmpChild = d3.select(".emp-rate-child-age")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Draw chart frame
    svgEmpChild.append("g")
        .attr("class", "xAxisEmpChild")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisEmpChild)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${40})`)
        .attr("fill", "black")
        .attr("font-size", "20")

    svgEmpChild.append("g")
        .attr("class", "yAxisEmpChild")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisEmpChild)
        .append("text")
        .text("Employment Rate")
        .attr("transform", `translate(${- 30}, ${height / 2})rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "20")

    drawEmpChild()

    // Apply chart title 
}

function drawEmpChild() {
    // Group data by Country to draw multi line
    nestedEmpChild = d3.groups(stateEmpChild.data, d => d.Group)
    console.log(nestedEmpChild[0])

    // Line function each line -> x(year), y(rate)
    const lineEmpRate = d3.line()
        .x(d => xEmpChild(d.Year))
        .y(d => yEmpChild(d.Rate))

    // Draw lines and apply color/stroke-width transition
    svgEmpChild.selectAll("path.line")
        .data(nestedEmpChild)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", "1.5")
        .attr("fill", "none")
        .attr("stroke", d => {
            if (d[0].match(/Father/)) return "#FFB300"
            else return "#009688"
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
                    if (d[0].match(/Father/)) return "#FFB300"
                    else return "#009688"
                })
                .attr("stroke-width", "1.5")
        })


    // Apply tooltip box 
}