


let svgTwoFive;
let svgTen;
let xTwoFive;
let xTen;
let yTwoFive;
let yTen;
let xAxisTwoFive;
let xAxisTen;
let yAxisTwoFive;
let yAxisTen;

let stateComp = {
    data: null
}

// color = d3.schemeSet3;

d3.csv("./data/PM1025_Major_cities_2011-2019.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        City: d.City,
        pmTwoFive: +d.PMTwoFive,
        pmTen: +d.PMTen
    }
}).then(data => {
    stateComp.data = data
    console.log("loaded data:", stateComp.data)
    initComp()
})

function initComp() {

    xTen = xTwoFive = d3.scaleTime()
        .domain(d3.extent(stateComp.data, d => d.Year))
        .range([margin.right, (width * 0.8) - margin.left])

    yTwoFive = d3.scaleLinear()
        .domain(d3.extent(stateComp.data, d => d.pmTwoFive))
        .range([(height * 0.8) - margin.bottom, margin.top])

    yTen = d3.scaleLinear()
        .domain(d3.extent(stateComp.data, d => d.pmTen))
        .range([(height * 0.8) - margin.bottom, margin.top])

    xAxisTwoFive = d3.axisBottom(xTwoFive).tickFormat(d3.timeFormat("%Y"))
    xAxisTen = d3.axisBottom(xTen).tickFormat(d3.timeFormat("%Y"))
    yAxisTwoFive = d3.axisLeft(yTwoFive)
    yAxisTen = d3.axisLeft(yTen)

    // PM2.5
    svgTwoFive = d3.select(".comparison-25")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xTwoFiveGroup = svgTwoFive.append("g")
        .attr("class", "xAxisTwoFive")
        .attr("transform", `translate(${0}, ${(height * 0.8) - margin.bottom})`)
        .call(xAxisTwoFive)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${(width * 0.8) / 2}, ${40})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    yTwoFiveGroup = svgTwoFive.append("g")
        .attr("class", "yAxisTwoFive")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisTwoFive)
        .append("text")
        .text("PM2.5")
        .attr("transform", `translate(${- 25}, ${(height * 0.8) / 2})rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")

    // PM10 
    svgTen = d3.select(".comparison-10")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xTenGroup = svgTen.append("g")
        .attr("class", "xAxisTen")
        .attr("transform", `translate(${0}, ${(height * 0.8) - margin.bottom})`)
        .call(xAxisTen)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${(width * 0.8) / 2}, ${40})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    yTenGroup = svgTen.append("g")
        .attr("class", "yAxisTen")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisTen)
        .append("text")
        .text("PM10")
        .attr("transform", `translate(${- 25}, ${(height * 0.8) / 2})rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")

    drawComp();
}

function drawComp() {
    nestedData = d3.groups(stateComp.data, d => d.City)
    console.log(nestedData)

    // PM2.5
    const lineFunction = d3.line()
        // .defined(d => !isNaN(d))
        // .curve(d3.curveBasis)
        .x(d => xTwoFive(d.Year))
        .y(d => yTwoFive(d.pmTwoFive))

    svgTwoFive.selectAll("path.line")
        .data(nestedData)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        // .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", "2")
        .attr("stroke", (d, i) => {
            return d.color = color(i)
        })
        .attr("fill", "none")
        .attr("d", d => {
            console.log("d", d)
            return lineFunction(d[1])
        });

    // PM10         
    const lineFunctionTen = d3.line()
        .x(d => xTen(d.Year))
        .y(d => yTen(d.pmTen))

    svgTen.selectAll("path.line")
        .data(nestedData)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("class", "line")
        .attr("stroke-width", "2")
        .attr("stroke", (d, i) => {
            return d.color = color(i)
        })
        .attr("fill", "none")
        .attr("d", d => {
            console.log("d", d)
            return lineFunctionTen(d[1])
        });

}