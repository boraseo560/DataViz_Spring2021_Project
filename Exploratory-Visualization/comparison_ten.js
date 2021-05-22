
let svgTen;
let xTen;
let yTen;
let xAxisTen;
let yAxisTen;

const colorCompTen = d3.scaleOrdinal().range(["#ff6f3c", "#fbc687", "#17b978", "#7d5a5a", "#c3aed6", "#f8b500", "#3b5f41"])

let stateCompTen = {
    data: null
}

// color = d3.schemeSet3;

d3.csv("./data/PM10_Major_cities_2011-2019.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        City: d.City,
        pmTen: +d.PMTen,
    }
}).then(data => {
    stateCompTen.data = data
    console.log("loaded data:", stateCompTen.data)
    initCompTen()
})

function initCompTen() {

    xTen = d3.scaleTime()
        .domain(d3.extent(stateCompTen.data, d => d.Year))
        .range([margin.right, width - margin.left])

    yTen = d3.scaleLinear()
        .domain([15, 50])
        .range([height - margin.bottom, margin.top])



    xAxisTen = d3.axisBottom(xTen).tickFormat(d3.timeFormat("%Y"))
    yAxisTen = d3.axisLeft(yTen)

    // PM2.5
    svgTen = d3.select(".comparison-10")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xTenGroup = svgTen.append("g")
        .attr("class", "xAxisTen")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisTen)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${45})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    yTenGroup = svgTen.append("g")
        .attr("class", "yAxisTen")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisTen)
        .append("text")
        .text("PM10(μg/m3)")
        .attr("transform", `translate(${50}, ${12})`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")




    nestedDataTen = d3.groups(stateCompTen.data, d => d.City)
    console.log(nestedDataTen)

    // PM2.5
    const lineCompTen = d3.line()
        // .defined(d => !isNaN(d))
        // .curve(d3.curveBasis)
        .x(d => xTen(d.Year))
        .y(d => yTen(d.pmTen))

    svgTen.selectAll("path.line")
        .data(nestedDataTen)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr("stroke-dasharray", d => {
            if (d[0] === "USA/South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "14"
            return "0,0"
        })
        .attr("class", "line")
        .attr("opacity", d => {
            if (d[0] === "USA/South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "0.3"
            else return "1"
        })
        .attr("stroke-width", d => {
            if (d[0] === "USA/South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "6.5"
            else return "2"
        })        // .attr("stroke", (d, i) => {
        //     return d.color = color(i)
        // })
        .attr("stroke", d => colorCompTen(d[0]))
        .attr("fill", "none")
        .attr("d", d => {
            // console.log("d", d)
            return lineCompTen(d[1])
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("stroke", d => {
                    if (d[0] === "USA/South Korea Guideline Level") return "#3b5f41"
                    else if (d[0] === "WHO Guideline Level") return "#f8b500"
                    else return "#5432d3"
                })
                .attr("opacity", "1")
                .attr("stroke-width", "4")
            drawCompTen();
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("stroke-dasharray", d => {
                    if (d[0] === "USA/South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "14"
                    return "0,0"
                })
                .attr("stroke", d => colorCompTen(d[0]))
                .attr("opacity", d => {
                    if (d[0] === "USA/South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "0.3"
                    else return "1"
                })
                .attr("stroke-width", d => {
                    if (d[0] === "USA/South Korea Guideline Level" || d[0] === "WHO Guideline Level") return "6.5"
                    else return "2"
                })        // .attr("stroke", (d, i) => {
            drawCompTen();
            // state.hover.visible = false
        })

    svgTen
        .selectAll("boxes")
        .data(nestedDataTen)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("x", border_padding + 40)
        .attr("y", (d, i) => 109 + 10 + i * (size - 44 + item_padding) + (size / 2) + text_offset)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", d => colorCompTen(d[0]))
    // const ci = ["S.Korea(Seoul)", "USA(LA)", "Japan(Tokyo)", "France(Paris)", "UK(London)"]
    svgTen.selectAll("labels")
        .data(nestedDataTen)
        .enter()
        .append("text")
        .attr("x", border_padding + 68)
        .attr("y", (d, i) => 112 + 10 + i * (size - 44 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d)
        .text(d => d[0])
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "13")



    drawCompTen();
}

function drawCompTen() {


}