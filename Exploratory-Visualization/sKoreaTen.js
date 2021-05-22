const size = 20;
const border_padding = 35;
const item_padding = 40;
const rect_padding = 40;
const text_offset = 2;
let pmTen;
let xSKTen;
let ySKTen;
let xAxisSKTen;
let yAxisSKTen;

// const parseTime = d3.timeParse("%m");
let stateTen = {
    data: null
};


d3.csv('./data/PM10_byMonth_byCity_201101_202005_annual_2.csv', d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        Province: d.Province,
        // Month: new Date(2010, +d.Month - 1, 1),
        pmTen: +d['PM10']
    }
})
    .then(data => {
        console.log("what is this", data);
        stateTen.data = data;
        initTen();
    })

const guide = ["WHO Guideline Level", "USA/South Korea Guideline Level"]
const cityList = ["Special City (Capital City) or Metropolitan City"]
const provList = ["Province or Self-Governing Province"]
function initTen() {

    xSKTen = d3.scaleTime()
        .domain(d3.extent(stateTen.data, d => d.Year))
        .range([margin.right, width - margin.left])

    ySKTen = d3.scaleLinear()
        .domain([0, 65])
        // .domain(d3.extent(state.data, d => d.pmTen))
        .range([height - margin.bottom, margin.top])

    xAxisSKTen = d3.axisBottom(xSKTen).tickFormat(d3.timeFormat("%Y"))
    yAxisSKTen = d3.axisLeft(ySKTen)

    pmTen = d3.select(".pm10-line")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    pmTen.append("g")
        .attr("class", "xAxisSKTen")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisSKTen)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${45})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    pmTen.append("g")
        .attr("class", "yAxisSKTen")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisSKTen)
        .append("text")
        .text("PM10(μg/m3)")
        .attr("transform", `translate(${50}, ${12})`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")



    colorTen = d3.scaleOrdinal(d3.schemePaired)

    nestedTen = d3.groups(stateTen.data, d => d.Province)
    console.log("HAHA", nestedTen.key)

    // PM2.5
    const lineTen = d3.line()
        // .defined(d => !isNaN(d))
        // .curve(d3.curveBasis)
        .x(d => xSKTen(d.Year))
        .y(d => ySKTen(d.pmTen))

    pmTen.selectAll("path.line")
        .data(nestedTen)
        .join("path")
        .attr("class", "line")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("stroke-dasharray", d => {
            if (d[0] === "WHO Guideline Level" || d[0] === "USA/South Korea Guideline Level") return "14"
            else return "0,0"
        })
        .style("mix-blend-mode", "multiply")

        .attr("opacity", d => {
            if (d[0] === "WHO Guideline Level" || d[0] === "USA/South Korea Guideline Level") return "0.4"
            else return "1"
        })
        .attr("stroke-width", d => {
            // console.log("nested25", d[0])
            if (d[0] === "WHO Guideline Level" || d[0] === "USA/South Korea Guideline Level") return "6.5"
            else return "2"
        })
        .attr("stroke", d => {
            // console.log("nested25", d[0])
            if (d[0] === "Seoul" || d[0] === "Busan" || d[0] === "Daegu" || d[0] === "Sejong") return "#4cb3cd"
            else if (d[0] === "Incheon" || d[0] === "Gwangju" || d[0] === "Daejeon" || d[0] === "Ulsan") return "#4cb3cd"
            else if (d[0] === "WHO Guideline Level") return "#f8b500"
            else if (d[0] === "USA/South Korea Guideline Level") return "#3b5f41"
            else return "#f56a79"
        })
        .attr("fill", "none")
        .attr("d", d => {
            // console.log("d", d)
            return lineTen(d[1])
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("stroke", d => {
                    if (d[0] === "WHO Guideline Level") return "#f8b500"
                    else if (d[0] === "USA/South Korea Guideline Level") return "#3b5f41"
                    else return "#5432d3"
                })
                .attr("opacity", "1")
                .attr("stroke-width", "4")
            draw();
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .style("stroke-dasharray", d => {
                    if (d[0] === "WHO Guideline Level" || d[0] === "USA/South Korea Guideline Level") return "14"
                    else return "0,0"
                })
                .attr("stroke", "darkblue")
                .attr("opacity", d => {
                    if (d[0] === "WHO Guideline Level" || d[0] === "USA/South Korea Guideline Level") return "0.4"
                    else return "1"
                })
                .attr("stroke-width", d => {
                    // console.log("nested25", d[0])
                    if (d[0] === "WHO Guideline Level" || d[0] === "USA/South Korea Guideline Level") return "6.5"
                    else return "2"
                })
                .attr("stroke", d => {
                    // console.log("nested25", d[0])
                    if (d[0] === "Seoul" || d[0] === "Busan" || d[0] === "Daegu" || d[0] === "Sejong") return "#4cb3cd"
                    else if (d[0] === "Incheon" || d[0] === "Gwangju" || d[0] === "Daejeon" || d[0] === "Ulsan") return "#4cb3cd"
                    else if (d[0] === "WHO Guideline Level") return "#f8b500"
                    else if (d[0] === "USA/South Korea Guideline Level") return "#3b5f41"
                    else return "#f56a79"
                })
            drawTen();
            // state.hover.visible = false
        })

    // provGroup = d3.groups(stateTen.data, d => d.Province)

    // console.log("provGroup", provGroup)
    pmTen
        .selectAll("boxes")
        .data(provList)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 21)
        .attr("x", 200)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", "#f56a79")

    pmTen.selectAll("labels")
        .data(provList)
        .enter()
        .append("text")
        .attr("y", border_padding - 19)
        .attr("x", 225)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")

    pmTen
        .selectAll("boxes")
        .data(cityList)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 7)
        .attr("x", 200)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", "#4cb3cd")

    pmTen.selectAll("labels")
        .data(cityList)
        .enter()
        .append("text")
        .attr("y", border_padding - 5)
        .attr("x", 225)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")


    pmTen
        .selectAll("boxes")
        .data(guide)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding + 8)
        .attr("x", (d, i) => 188 + i * (size + 120 + item_padding) + (size / 2) + text_offset)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", d => {
            if (d === "WHO Guideline Level") return "#f8b500"
            else return "#3b5f41"
        })

    pmTen.selectAll("labels")
        .data(guide)
        .enter()
        .append("text")
        .attr("y", border_padding + 11)
        .attr("x", (d, i) => 203 + 10 + i * (size + 120 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")




    drawTen();
}

function drawTen() {

}