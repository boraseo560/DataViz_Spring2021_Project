const width = window.innerWidth * 0.5,
    height = window.innerHeight * 0.6,
    margin = { top: 30, bottom: 50, left: 60, right: 60 },
    radius = 3;

let svgFertil;
let xFertil;
let yFertil;
let xAxisFertil;
let yAxisFertil;

let stateFertil = {
    data: null,
    hover: {
        screenPosition: null,
        CountryName: null,
        ferRate: null,
        visible: false
    }
}

// Read data 
d3.csv("./data/01_oecd_fertil_rate.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        Country: d.Country,
        Rate: +d.Rate
    }
}).then(data => {
    stateFertil.data = data
    // console.log("loaded data:", stateFertil.data)
    initFertil()
})

// Function initFertil()

function initFertil() {

    // x, y values 
    xFertil = d3.scaleTime()
        .domain(d3.extent(stateFertil.data, d => d.Year))
        .range([margin.right, width - margin.left])
    yFertil = d3.scaleLinear()
        .domain(d3.extent(stateFertil.data, d => d.Rate))
        .range([height - margin.bottom, margin.top])

    // xAxis, yAxis 
    xAxisFertil = d3.axisBottom(xFertil)
        .tickFormat(d3.timeFormat("%Y"))

    yAxisFertil = d3.axisLeft(yFertil)

    // Create svg element 
    svgFertil = d3.select(".fer-rate")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Draw chart frame
    svgFertil.append("g")
        .attr("class", "xAxisFertil")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisFertil)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${50})`)
        .attr("fill", "#2a2a2a")
        .attr("font-size", "20")


    svgFertil.append("g")
        .attr("class", "yAxisFertil")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisFertil)
        .append("text")
        .text("Rate")
        .attr("transform", `translate(${18}, ${margin.bottom - 30})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#2a2a2a")
        // .selectAll(".tick text")
        .attr("font-size", "20")

    // Group data by Country to draw multi line
    nestedFertil = d3.groups(stateFertil.data, d => d.Country)
    console.log(nestedFertil)

    // Line function each line -> x(year), y(rate)
    const lineFertil = d3.line()
        .x(d => xFertil(d.Year))
        .y(d => yFertil(d.Rate))

    // Draw lines and apply color/stroke-width transition
    svgFertil.selectAll("path.line")
        .data(nestedFertil)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", d => {
            if (d[0] === "South Korea") return "3"
            else if (d[0] === "USA") return "3"
            else if (d[0] === "OECD Average") return "3"
            else return "2"
        })
        .attr("fill", "none")
        .attr("stroke", d => {
            if (d[0] === "South Korea") return "#f95959"
            else if (d[0] === "USA") return "#6930c3"
            else if (d[0] === "OECD Average") return "#0b5269"
            else return "#aacfd0"
        })
        .attr("d", d => {
            return lineFertil(d[1])
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("stroke", "#ff4646")
                .attr("stroke-width", "6")
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("stroke-width", d => {
                    if (d[0] === "South Korea") return "3"
                    // #ff7b54
                    else if (d[0] === "USA") return "3"
                    else if (d[0] === "OECD Average") return "3"
                    else return "2"
                })
                .attr("stroke", d => {
                    if (d[0] === "South Korea") return "#f95959"
                    else if (d[0] === "USA") return "#6930c3"
                    else if (d[0] === "OECD Average") return "#0b5269"
                    else return "#aacfd0"
                })
        })
    // svgFertil
    //     .append("rect")
    //     .attr("transform", "translate(740, 63)")
    //     .attr("width", 160)
    //     .attr("height", 90)
    //     .attr("fill", "none")
    //     .attr("stroke-width", "0.5")
    //     .attr("stroke", "black")
    svgFertil
        .selectAll("boxes")
        .data(["South Korea", "USA", "OECD Average", "Other Countries"])
        .enter()
        .append("rect")
        // .join("rect")
        .attr("x", 768)
        .attr("y", (d, i) => 55 + (i * (15 + 5)))
        .attr("width", 20)
        .attr("height", 8)
        .attr("fill", d => {
            console.log("legend", d[0])
            if (d[0] === "S") return "#f95959"
            else if (d[0] === "U") return "#6930c3"
            else if (d[1] === "E") return "#0b5269"
            else if (d[1] === "t") return "#7eca9c"
        })
    svgFertil.selectAll("labels")
        .data(["South Korea", "USA", "OECD Average", "Other Countries"])
        .enter()
        .append("text")
        .attr("x", 795)
        .attr("y", (d, i) => 60 + (i * (15 + 5)))
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")

    svgFertil.selectAll("circle")
        .data(stateFertil.data)
        .join("circle")
        .attr("cx", d => xFertil(d.Year))
        .attr("cy", d => yFertil(d.Rate))
        .attr("r", 4)
        // {
        //     const hahaList = ["2009", "2013", "2019"]
        //     // console.log(d.timeFormat("%Y")(d.Year))
        //     if (d.Country === "New Zealand" && d3.timeFormat("%Y")(d.Year) === "2014") return "7"
        //     else if ((d.Country === "UK") && hahaList.includes(d3.timeFormat("%Y")(d.Year))) return "7"
        //     else return "4"
        // })
        .attr("fill", d => {
            if (d.Country === "South Korea") return "#f95959"
            else if (d.Country === "USA") return "#6930c3"
            else if (d.Country === "OECD Average") return "#0b5269"
            else return "#7eca9c"
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("cx", d => xFertil(d.Year))
                .attr("cy", d => yFertil(d.Rate))
                .attr("stroke", "black")
                .attr("stroke-width", '2')
                .attr("r", "8")
                .attr("fill", "#ff4646")

            const { clientX, clientY } = event // ???
            stateFertil.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                CountryName: d.Country,
                ferRate: d.Rate
            }
            drawFertil()
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("cx", d => xFertil(d.Year))
                .attr("cy", d => yFertil(d.Rate))
                .attr("stroke", "None")
                .attr("stroke-width", 0)
                .attr("r", 4)
                .attr("fill", d => {
                    if (d.Country === "South Korea") return "#f95959"
                    else if (d.Country === "USA") return "#6930c3"
                    else if (d.Country === "OECD Average") return "#0b5269"
                    else return "#7eca9c"
                })
            stateFertil.hover.visible = false

            drawFertil()
        })
    drawFertil()
}

// overlay div 

function drawFertil() {
    // console.log("hover", [stateFertil.hover])
    // Apply tooltip box 
    d3.select(".fer-rate")
        .selectAll("div.hover-content")
        .data([stateFertil.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 20}px, ${d.screenPosition[1] - 240}px)`
        })
        .html(d => {
            return `
            <div> Country: ${d.CountryName} </div>
            <div> Fertility Rate: ${d.ferRate} </div>
            `
        })
}