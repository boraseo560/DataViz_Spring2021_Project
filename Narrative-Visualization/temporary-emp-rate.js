let xTemp;
let yTemp;
let svgTemp;
let xAxisTemp;
let yAxisTemp;

let stateTemp = {
    data: null,
    hover: {
        screenPosition: null,
        visible: false,
        Group: null,
        Rate: null
    }
}


d3.csv("./data/05_temporary_work_by_sex_2010_2020.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        Group: d.Sex,
        tempRate: d.Rate
    }
}).then(data => {
    stateTemp.data = data
    console.log("stateTemp.data", stateTemp.data)
    initTemp()
})

// Create svg element 
svgTemp = d3.select(".temporary-emp-rate")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

const colorTemp = d3.scaleOrdinal().range(["#FFB300", "#009688"])

// const tooltip = d3.select('.new');
// const tooltipLine = svgTemp.append('line');

function initTemp() {
    // Color scheme
    // const colorFertil = d3.scaleSequentialSqrt()
    // .domain([1, 3])
    // .range(["#7d82b8", "#ffffff"])

    // x, y values 
    xTemp = d3.scaleTime()
        .domain(d3.extent(stateTemp.data, d => d.Year))
        .range([margin.right, width - margin.left])
    yTemp = d3.scaleLinear()
        .domain([20, 60])
        .range([height - margin.bottom, margin.top])

    // xAxis, yAxis 
    xAxisTemp = d3.axisBottom(xTemp)
        .tickFormat(d3.timeFormat("%Y"))

    yAxisTemp = d3.axisLeft(yTemp)



    // Draw svgTemp frame
    svgTemp.append("g")
        .attr("class", "xAxisTemp")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisTemp)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${50})`)
        .attr("fill", "#2a2a2a")
        .attr("font-size", "20")

    svgTemp.append("g")
        .attr("class", "yAxisTemp")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisTemp)
        .append("text")
        .text("(%)")
        .attr("transform", `translate(${10}, ${margin.bottom - 30})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#2a2a2a")
        // .selectAll(".tick text")
        .attr("font-size", "20")



    svgTemp
        .selectAll("boxes")
        .data(["Men", "Women"])
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 24)
        .attr("x", (d, i) => 698 + 10 + (i * (size + rect_padding)))
        .attr("width", 20)
        .attr("height", 8)
        .attr("fill", d => colorTemp(d[0]))

    // {
    //     console.log("legend", d[0])
    //     if (d[0] === "S") return "#f95959"
    //     else if (d[0] === "U") return "#ffb037"
    //     else if (d[1] === "t") return "#aacfd0"
    // })
    svgTemp.selectAll("labels")
        .data(["Men", "Women"])
        .enter()
        .append("text")
        .attr("y", border_padding - 19)
        .attr("x", (d, i) => 710 + 10 + i * (size + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")


    // Apply svgTemp title 
    // Group data by Country to draw multi line
    nestedTemp = d3.groups(stateTemp.data, d => d.Group)
    console.log("temprate", nestedTemp)

    twoTemp = d3.groups(stateTemp.data, d => d.Year)
    console.log("temprate two", twoTemp)

    // something = stateTemp.data.map()

    // Line function each line -> x(year), y(rate)
    const lineTemp = d3.line()
        .x(d => xTemp(d.Year))
        .y(d => yTemp(d.tempRate))

    // Draw lines and apply color/stroke-width transition
    svgTemp.selectAll("path.line")
        .data(nestedTemp)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr("class", "line")
        .attr("stroke-width", "1.5")
        .attr("fill", "none")
        .attr("stroke", d => {
            if (d[0] === "Men") return "#FFB300"
            else return "#009688"
        })
        .attr("d", d => {
            return lineTemp(d[1])
        })
    // .on("mousemove", function (event, d) {
    //     d3.select(this).transition()
    //         .duration("50")
    //         .attr("stroke", "#ff4646")
    //         .attr("stroke-width", "6")

    // })
    // .on("mouseout", function (event, d) {
    //     d3.select(this).transition()
    //         .duration("50")
    //         .attr("stroke", d => {
    //             if (d[0] === "Men") return "#FFB300"
    //             else return "#009688"
    //         })
    //         .attr("stroke-width", "1.5")
    // })


    svgTemp.selectAll("circle")
        .data(stateTemp.data)
        .join("circle")
        .attr("cx", d => xTemp(d.Year))
        .attr("cy", d => yTemp(d.tempRate))
        .attr("r", "5")
        .attr("fill", d => colorTemp(d.Group))
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("cx", d => xTemp(d.Year))
                .attr("cy", d => yTemp(d.tempRate))
                .attr("stroke", "black")
                .attr("stroke-width", '2')
                .attr("r", "8")
                .attr("fill", "#ff4646")

            const { clientX, clientY } = event
            stateTemp.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                Group: d.Group,
                Rate: d.tempRate
            }
            drawTemp()
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("cx", d => xTemp(d.Year))
                .attr("cy", d => yTemp(d.tempRate))
                .attr("stroke", "None")
                .attr("stroke-width", 0)
                .attr("r", "5")
                .attr("fill", d => colorTemp(d.Group))

            stateTemp.hover.visible = false
            drawTemp()
        })
    drawTemp()
}

function drawTemp() {
    console.log("hover", [stateTemp.hover])
    d3.select(".temporary-emp-rate")
        .selectAll("div.hover-content")
        .data([stateTemp.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 20}px, ${d.screenPosition[1] + 1000}px)`
        })
        .html(d => {
            return `
            <div> Group: ${d.Group} </div>
            <div> Rate: ${d.Rate}%</div>
            `
        })
    // tipBox = svgTemp.append('rect')
    //     .attr('width', width)
    //     .attr('height', height)
    //     .attr('opacity', 0)
    //     .on('mousemove', drawTooltip)
    //     .on('mouseout', removeTooltip);

}

// function removeTooltip() {
//     if (tooltip) tooltip.style('display', 'none');
//     if (tooltipLine) tooltipLine.attr('stroke', 'none');
// }

// function drawTooltip() {
//     const year = Math.floor((xTemp.invert(d3.pointer(event)[0])) / 11) * 11;
//     // console.log("what is year", year)
//     something =
//         stateTemp.data.sort((a, b) => {
//             if (h => d3.timeFormat("%Y")(h.Year) == year) return b.tempRate - a.tempRate
//         })

//     tooltipLine.attr('stroke', 'black')
//         .attr('x1', xTemp(year))
//         .attr('x2', xTemp(year))
//         .attr('y1', 0)
//         .attr('y2', height - margin.bottom);

//     tooltip.html(year)
//         .style('display', 'block')
//         .style('left', event.clientX + 30)
//         .style('top', event.clientY - 30)
//         .selectAll()
//         .data(stateTemp.data).enter()
//         .append('div')
//         .style('color', d => {
//             // console.log("d.YEAR", d)
//             return colorTemp(d.Group)
//         })
//         .html(d => d.Group + ': ' + d.tempRate);
// 