
const size = 20;
const border_padding = 35;
const item_padding = 40;
const rect_padding = 40;
const text_offset = 2;

let svgDisconTrend;
let xDisconTrend;
let yDisconTrend;
let xAxisDisconTrend;
let yAxisDisconTrend;
const colorTrend = d3.scaleOrdinal().range(["#3482aa", "#9656a1", "#f95959", "#3dbdc2", "#C3D973"])
let stateDisconTrend = {
    data: null,
    hover: {
        screenPosition: null,
        ageGroup: null,
        Ratio: null,
        visible: false
    }

}


// Read data 
d3.csv("./data/07_career_discon_age_ratio_2014_2020.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        ageGroup: d.AgeGroup,
        Ratio: +d.Ratio
    }
}).then(data => {
    stateDisconTrend.data = data
    // console.log("loaded data:", stateDisconTrend.data)
    initDisconTrend()
})

// Function initDisconTrend()

function initDisconTrend() {

    // Color scheme
    // const colorDisconTrend = d3.scaleSequentialSqrt()
    // .domain([1, 3])
    // .range(["#7d82b8", "#ffffff"])

    // x, y values 
    xDisconTrend = d3.scaleTime()
        .domain(d3.extent(stateDisconTrend.data, d => d.Year))
        .range([margin.right, width - margin.left])
    yDisconTrend = d3.scaleLinear()
        .domain([0, 45])
        .range([height - margin.bottom, margin.top])

    // xAxis, yAxis 
    xAxisDisconTrend = d3.axisBottom(xDisconTrend).tickFormat(d3.timeFormat("%Y"))

    yAxisDisconTrend = d3.axisLeft(yDisconTrend)

    // Create svg element 
    svgDisconTrend = d3.select(".career-discon-trend")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Draw chart frame
    svgDisconTrend.append("g")
        .attr("class", "xAxisDisconTrend")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisDisconTrend)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${50})`)
        .attr("fill", "#2a2a2a")
        .attr("font-size", "20")

    svgDisconTrend.append("g")
        .attr("class", "yAxisDisconTrend")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisDisconTrend)
        .append("text")
        .text("(%)")
        .attr("transform", `translate(${10}, ${margin.bottom - 30})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#2a2a2a")
        // .selectAll(".tick text")
        .attr("font-size", "20")

    DisconTrend = d3.groups(stateDisconTrend.data, d => d.ageGroup)
    // console.log(nestedDisconTrend)
    svgDisconTrend
        .selectAll("boxes")
        .data(DisconTrend)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 25)
        .attr("x", (d, i) => 563 + 9 + (i * (size + 7 + rect_padding)))
        .attr("width", 20)
        .attr("height", 8)
        .attr("fill", d => colorTrend(d[0]))
    // {
    //     console.log("legend", d[0])
    //     if (d[0] === "S") return "#f95959"
    //     else if (d[0] === "U") return "#ffb037"
    //     else if (d[1] === "t") return "#aacfd0"
    // })
    svgDisconTrend.selectAll("labels")
        .data(['15-54', "15-29", "30-39", "40-49", "50-54"])
        .enter()
        .append("text")
        .attr("y", border_padding - 20)
        .attr("x", (d, i) => 582 + i * (size + 7 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")


    // Group data by Country to draw multi line
    nestedDisconTrend = d3.groups(stateDisconTrend.data, d => d.ageGroup)
    // console.log(nestedDisconTrend)

    // keys = ["15-54", "15-29", "30-39", "40-49", "50-54"]
    // what = nestedDisconTrend.map(d => d[keys])



    // Line function each line -> x(year), y(rate)
    const lineDisconTrend = d3.line()
        .x(d => xDisconTrend(d.Year))
        .y(d => yDisconTrend(d.Ratio))


    // Draw lines and apply color/stroke-width transition
    svgDisconTrend.selectAll("path.line")
        .data(nestedDisconTrend)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", d => {
            if (d[0] === "15-29") return "5"
            else if (d[0] === "30-39") return "5"
            else return "2"
        })
        .attr("fill", "none")
        .attr("stroke", d => colorTrend(d[0]))
        // {
        //     if (d[0] === "15-29") return "#f05454"
        //     else if (d[0] === "30-39") return "#f05454"
        //     else return "#96bb7c"
        // })
        .attr("d", d => {
            return lineDisconTrend(d[1])
        })
    // .on("mousemove", function (event, d) {
    //     d3.select(this).transition()
    //         .duration("80")
    //         .attr("stroke", "#ff005c")
    //         .attr("stroke-width", d => {
    //             if (d[0] === "15-29") return "6"
    //             else if (d[0] === "30-39") return "6"
    //             else return "4"
    //         })
    // })
    // .on("mouseout", function (event, d) {
    //     d3.select(this).transition()
    //         .duration("50")
    //         .attr("stroke", d => colorTrend(d[0]))
    //         // .attr("stroke", d => {
    //         //     if (d[0] === "15-29") return "#f05454"
    //         //     else if (d[0] === "30-39") return "#f05454"
    //         //     else return "#96bb7c"
    //         // })
    //         .attr("stroke-width", d => {
    //             if (d[0] === "15-29") return "4"
    //             else if (d[0] === "30-39") return "4"
    //             else return "2"
    //         })
    //         .attr("stroke", d => colorTrend(d[0]))
    // })

    // svgDisconTrend
    //     .append("rect")
    //     .attr("transform", "translate(808, 55)")
    //     .attr("width", 70)
    //     .attr("height", 110)
    //     .attr("fill", "none")
    //     .attr("stroke-width", "0.5")
    //     .attr("stroke", "black")

    svgDisconTrend.selectAll("circle")
        .data(stateDisconTrend.data)
        .join("circle")
        .attr("cx", d => xDisconTrend(d.Year))
        .attr("cy", d => yDisconTrend(d.Ratio))
        .attr("r", d => {
            if (d.ageGroup === "15-29") return 6
            else if (d.ageGroup === "30-39") return 6
            else return 5
        })
        .attr("fill", d => colorTrend(d.ageGroup))
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("cx", d => xDisconTrend(d.Year))
                .attr("cy", d => yDisconTrend(d.Ratio))
                .attr("stroke", "black")
                .attr("stroke-width", '2')
                .attr("r", "8")
                .attr("fill", "#ff005c")

            const { clientX, clientY } = event
            stateDisconTrend.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                ageGroup: d.ageGroup,
                Ratio: d.Ratio,
            }
            drawDisconTrend()
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("cx", d => xDisconTrend(d.Year))
                .attr("cy", d => yDisconTrend(d.Ratio))
                .attr("stroke", "None")
                .attr("stroke-width", 0)
                .attr("r", d => {
                    if (d.ageGroup === "15-29") return 6
                    else if (d.ageGroup === "30-39") return 6
                    else return 5
                })
                .attr("fill", d => colorTrend(d.ageGroup))
            // stateDisconTrend.hover.visible = false
            stateDisconTrend.hover.visible = false

            drawDisconTrend()
        })
    drawDisconTrend()

}    // Apply chart title 
function drawDisconTrend() {


    d3.select(".career-discon-trend")
        .selectAll("div.hover-content")
        .data([stateDisconTrend.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 20}px, ${d.screenPosition[1] + 700}px)`
        })
        .html(d => {
            return `
            <div> Age Group: ${d.ageGroup} </div>
            <div> Rate: ${d.Ratio}%</div>
            `
        })
    // Apply tooltip box 
}