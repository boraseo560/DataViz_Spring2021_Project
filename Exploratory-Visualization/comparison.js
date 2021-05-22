


let svgTwoFive;
let xTwoFive;
let yTwoFive;
let xAxisTwoFive;
let yAxisTwoFive;

let stateComp = {
    data: null
}
const colorCompFive = d3.scaleOrdinal().range(["#ff6f3c", "#fbc687", "#17b978", "#7d5a5a", "#c3aed6", "#f8b500", "#3b5f41", "#503bff"])
// .range(["#f8b500", "#fbc687", "#17b978", "#7d5a5a", "#c3aed6", "#ff6f3c", "#3b5f41"])

// color = d3.schemeSet3;

d3.csv("./data/PM25_Major_cities_2011-2019.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        City: d.City,
        pmTwoFive: +d.PMTwoFive,
    }
}).then(data => {
    stateComp.data = data
    console.log("loaded data:", stateComp.data)
    initComp()
})

function initComp() {

    xTwoFive = d3.scaleTime()
        .domain(d3.extent(stateComp.data, d => d.Year))
        .range([margin.right, width - margin.left])

    yTwoFive = d3.scaleLinear()
        .domain([6, 28])
        .range([height - margin.bottom, margin.top])



    xAxisTwoFive = d3.axisBottom(xTwoFive).tickFormat(d3.timeFormat("%Y"))
    yAxisTwoFive = d3.axisLeft(yTwoFive)

    // PM2.5
    svgTwoFive = d3.select(".comparison-25")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svgTwoFive.append("g")
        .attr("class", "xAxisTwoFive")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisTwoFive)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${45})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    svgTwoFive.append("g")
        .attr("class", "yAxisTwoFive")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisTwoFive)
        .append("text")
        .text("PM2.5(μg/m3)")
        .attr("transform", `translate(${50}, ${12})`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")




    nestedData = d3.groups(stateComp.data, d => d.City)
    console.log("ceeeeee", nestedData)

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
        .style("mix-blend-mode", "multiply")
        .attr("stroke-dasharray", d => {
            if (d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "14"
            return "0,0"
        })
        .attr("class", "line")
        .attr("opacity", d => {
            if (d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "0.3"
            else return "1"
        })
        .attr("stroke-width", d => {
            if (d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "6.5"
            else return "2"
        })
        // .attr("stroke", (d, i) => {
        //     return d.color = color(i)
        // })
        .attr("stroke", d => colorCompFive(d[0]))
        .attr("fill", "none")
        .attr("d", d => {
            console.log("d", d)
            return lineFunction(d[1])
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("stroke", d => {
                    if (d[0] === "USA Guideline Level") return "#3b5f41"
                    else if (d[0] === "South Korea Guideline Level") return "#503bff"
                    else if (d[0] === "WHO Guideline Level") return "#f8b500"
                    return "#5432d3"
                })
                .attr("opacity", "1")
                .attr("stroke-width", "4")
            drawComp();
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("stroke", d => colorCompFive(d[0]))
                .attr("stroke-dasharray", d => {
                    if (d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "14"
                    return "0,0"
                })
                .attr("opacity", d => {
                    if (d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "0.3"
                    else return "1"
                })
                .attr("stroke-width", d => {
                    if (d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "6.5"
                    else return "2"
                })
            drawComp();
            // state.hover.visible = false
        })

    svgTwoFive
        .selectAll("boxes")
        .data(nestedData)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("x", border_padding + 40)
        .attr("y", (d, i) => 10 + 10 + i * (size - 44 + item_padding) + (size / 2) + text_offset)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", d => colorCompFive(d[0]))
    // const ci = ["S.Korea(Seoul)", "USA(LA)", "Japan(Tokyo)", "France(Paris)", "UK(London)"]
    svgTwoFive.selectAll("labels")
        .data(nestedData)
        .enter()
        .append("text")
        .attr("x", border_padding + 68)
        .attr("y", (d, i) => 13 + 10 + i * (size - 44 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d)
        .text(d => d[0])
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "13")




    drawComp();
}

function drawComp() {


}