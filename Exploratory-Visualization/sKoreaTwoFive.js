const width = window.innerWidth * 0.4,
    height = window.innerHeight * 0.5,
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

const guide25 = ["WHO Guideline Level", "USA Guideline Level", "South Korea Guideline Level"]

d3.csv('./data/PM25_byMonth_byCity_201501_202005_annual_2.csv', d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        Province: d.Province,
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
        .range([margin.right, width - margin.left])

    ySKFive = d3.scaleLinear()
        .domain([0, 40])
        // .domain(d3.exTFivet(state.data, d => d.pmtwofive))
        .range([height - margin.bottom, margin.top])

    xAxisSKFive = d3.axisBottom(xSKFive).tickFormat(d3.timeFormat("%Y"))
    yAxisSKFive = d3.axisLeft(ySKFive)

    pmTFive = d3.select(".pm25-line")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    pmTFive.append("g")
        .attr("class", "xAxisSKFive")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisSKFive)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${45})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    pmTFive.append("g")
        .attr("class", "yAxisSKFive")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisSKFive)
        .append("text")
        .text("PM2.5(μg/m3)")
        .attr("transform", `translate(${50}, ${12})`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")



    color = d3.scaleOrdinal(d3.schemePaired)

    nested = d3.groups(state.data, d => d.Province)
    console.log("HAHA25", nested)

    // PM2.5
    const lineFunctionSK = d3.line()
        // .defined(d => !isNaN(d))
        // .curve(d3.curveBasis)
        .x(d => xSKFive(d.Year))
        .y(d => ySKFive(d.pmtwofive))

    pmTFive.selectAll("path.line")
        .data(nested)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("stroke-dasharray", d => {
            if (d[0] === "WHO Guideline Level" || d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level") return "14"
            else return "0,0"
        })
        .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("opacity", d => {
            if (d[0] === "WHO Guideline Level" || d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level") return "0.4"
        })
        .attr("stroke-width", d => {

            if (d[0] === "WHO Guideline Level" || d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level") return "6.5"

            else return "2"
        })
        .attr("stroke", d => {
            // console.log("nested25", d[0])
            if (d[0] === "Seoul" || d[0] === "Busan" || d[0] === "Daegu" || d[0] === "Sejong") return "#4cb3cd"
            else if (d[0] === "Incheon" || d[0] === "Gwangju" || d[0] === "Daejeon" || d[0] === "Ulsan") return "#4cb3cd"
            else if (d[0] === "WHO Guideline Level") return "#f8b500"
            else if (d[0] === "USA Guideline Level") return "#3b5f41"
            else if (d[0] === "South Korea Guideline Level") return "#503bff"
            else return "#f56a79"
        })

        .attr("fill", "none")
        .attr("d", d => {
            // console.log("d", d)
            return lineFunctionSK(d[1])
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("stroke", d => {
                    if (d[0] === "WHO Guideline Level") return "#f8b500"
                    else if (d[0] === "USA Guideline Level") return "#3b5f41"
                    else if (d[0] === "South Korea Guideline Level") return "#503bff"
                    return "#5432d3"
                })
                .attr("opacity", "1")
                .attr("stroke-width", "4")


            const { clientX, clientY } = event // ???
            stateFertil.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                CountryName: d.Country,
                ferRate: d.Rate
            }
            draw();
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .style("stroke-dasharray", d => {
                    if (d[0] === "WHO Guideline Level" || d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level") return "14"
                    else return "0,0"
                })
                .attr("opacity", d => {
                    if (d[0] === "WHO Guideline Level" || d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level") return "0.4"
                    else return "1"
                })
                .attr("stroke-width", d => {

                    if (d[0] === "WHO Guideline Level" || d[0] === "USA Guideline Level" || d[0] === "South Korea Guideline Level") return "6.5"

                    else return "2"
                })
                .attr("stroke", d => {
                    // console.log("nested25", d[0])
                    if (d[0] === "Seoul" || d[0] === "Busan" || d[0] === "Daegu" || d[0] === "Sejong") return "#4cb3cd"
                    else if (d[0] === "Incheon" || d[0] === "Gwangju" || d[0] === "Daejeon" || d[0] === "Ulsan") return "#4cb3cd"
                    else if (d[0] === "WHO Guideline Level") return "#f8b500"
                    else if (d[0] === "USA Guideline Level") return "#3b5f41"
                    else if (d[0] === "South Korea Guideline Level") return "#503bff"
                    else return "#f56a79"
                })
            draw();
            // state.hover.visible = false
        })


    pmTFive
        .selectAll("boxes")
        .data(provList)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 21)
        .attr("x", 180)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", "#f56a79")

    pmTFive.selectAll("labels")
        .data(provList)
        .enter()
        .append("text")
        .attr("y", border_padding - 19)
        .attr("x", 205)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")

    pmTFive
        .selectAll("boxes")
        .data(cityList)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 7)
        .attr("x", 180)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", "#4cb3cd")

    pmTFive.selectAll("labels")
        .data(cityList)
        .enter()
        .append("text")
        .attr("y", border_padding - 5)
        .attr("x", 205)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")


    pmTFive
        .selectAll("boxes")
        .data(guide25)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding + 8)
        .attr("x", (d, i) => 168 + i * (size + 103 + item_padding) + (size / 2) + text_offset)
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", d => {
            if (d === "WHO Guideline Level") return "#f8b500"
            else if (d === "USA Guideline Level") return "#3b5f41"
            else return "#503bff"
        })

    pmTFive.selectAll("labels")
        .data(guide25)
        .enter()
        .append("text")
        .attr("y", border_padding + 11)
        .attr("x", (d, i) => 183 + 10 + i * (size + 103 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")


    draw();
}

function draw() {

}