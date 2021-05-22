
let xEmpRate;
let yEmpRate;
let svgEmpRate;
let xAxisEmpRate;
let yAxisEmpRate;

let stateEmpRate = {
    data: null,
    hover: {

        screenPosition: null,
        visible: false,
        group: null,
        rate: null

    }
}

const colorList = d3.scaleOrdinal().range(["#99a8b2", "#8ad7c1", "#efb08c", "#fed96b"])
const colorList2 = d3.scaleOrdinal().range(["#4a772f", "#8f5b4a", "#0278ae", "#f16821"])

const colorEmp = d3.scaleOrdinal().range(["#99a8b2", "#8ad7c1", "#efb08c", "#fed96b", "#4a772f", "#8f5b4a", "#0278ae", "#f16821"])
empList = ['Men 20-29', 'Men 30-39', 'Men 40-49', 'Men 20-60+']
empList2 = ['Women 20-29', 'Women 30-39', 'Women 40-49', 'Women 20-60+']

// Get year only 
const formatTimeAgain = d3.timeFormat("%Y")

d3.csv("./data/03_emp_rate_by_sex_2008_2020.csv", d => {
    return {
        Year: new Date(+d.Year, 0, 1),
        Group: d.Group,
        empRate: d.Emprate
    }
}).then(data => {
    stateEmpRate.data = data
    initEmpRate()

})

function initEmpRate() {
    // Color scheme
    // const colorEmpRate = d3.scaleSequentialSqrt()
    // .domain([1, 3])
    // .range(["#7d82b8", "#ffffff"])

    // x, y values 
    xEmpRate = d3.scaleTime()
        .domain(d3.extent(stateEmpRate.data, d => d.Year))
        .range([margin.right, width - margin.left])
    yEmpRate = d3.scaleLinear()
        .domain([40, 100])
        .range([height - margin.bottom, margin.top])

    // xAxis, yAxis 
    xAxisEmpRate = d3.axisBottom(xEmpRate)
        .tickFormat(d3.timeFormat("%Y"))

    yAxisEmpRate = d3.axisLeft(yEmpRate)

    // Create svg element 
    svgEmpRate = d3.select(".emp-rate-by-sex")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // Draw chart frame
    svgEmpRate.append("g")
        .attr("class", "xAxisEmpRate")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisEmpRate)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${50})`)
        .attr("fill", "#2a2a2a")
        .attr("font-size", "20")

    svgEmpRate.append("g")
        .attr("class", "yAxisEmpRate")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisEmpRate)
        .append("text")
        .text("(%)")
        .attr("transform", `translate(${10}, ${margin.bottom - 30})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#2a2a2a")
        // .selectAll(".tick text")
        .attr("font-size", "20")

    EmpRate = d3.groups(stateEmpRate.data, d => d.Group)

    // console.log(nestedEmpRate)



    svgEmpRate
        .selectAll("boxes")
        .data(empList)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 6)
        .attr("x", (d, i) => 426 + 2 + (i * (size + 58 + rect_padding)))
        .attr("width", 20)
        .attr("height", 8)
        .attr("fill", d => colorList(d))

    svgEmpRate.selectAll("labels")
        .data(empList)
        .enter()
        .append("text")
        .attr("y", border_padding)
        .attr("x", (d, i) => 426 + 14 + i * (size + 58 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")

    svgEmpRate
        .selectAll("boxes")
        .data(empList2)
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding + 15)
        .attr("x", (d, i) => 426 + 2 + (i * (size + 58 + rect_padding)))
        .attr("width", 20)
        .attr("height", 8)
        .attr("fill", d => colorList2(d))

    svgEmpRate.selectAll("labels")
        .data(empList2)
        .enter()
        .append("text")
        .attr("y", border_padding + 20)
        .attr("x", (d, i) => 426 + 14 + i * (size + 58 + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))

        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")

    // Group data by Country to draw multi line
    nestedEmpRate = d3.groups(stateEmpRate.data, d => d.Group)
    // console.log("cheeeeeck", nestedEmpRate.map((d, i) => d[i][0] == e.key))

    // Line function each line -> x(year), y(rate)
    const lineEmpRate = d3.line()
        .x(d => xEmpRate(d.Year))
        .y(d => yEmpRate(d.empRate))


    // Draw lines and apply color/stroke-width transition
    svgEmpRate.selectAll("path.line")
        .data(nestedEmpRate)
        .join("path")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("class", "line")
        .attr("stroke-width", d => {
            if (d[0].match(/Wo/)) return "2.5"
            else return "2"
        })
        .attr("fill", "none")
        .attr("stroke", d => colorEmp(d[0]))
        // {
        //     if (d[0].match(/Women/)) return "#009688"
        //     else return "#FFB300"
        // })
        .attr("d", d => {
            return lineEmpRate(d[1])
        })
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("10")
                .attr("stroke", "#ff4646")
                .attr("stroke-width", "4")
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("30")
                .attr("stroke", d => colorEmp(d[0]))
                // {
                //     if (d[0].match(/Women/)) return "#009688"
                //     else return "#FFB300"
                // })
                .attr("stroke-width", d => {
                    if (d[0].match(/Wo/)) return "2.5"
                    else return "2"
                })
        })

    svgEmpRate.selectAll("circle")
        .data(stateEmpRate.data)
        .join("circle")
        .attr("cx", d => xEmpRate(d.Year))
        .attr("cy", d => yEmpRate(d.empRate))
        .attr("r", d => {
            if (d.Group.match(/Wo/)) return "4.2"
            else return "4"
        })
        // {
        //     const hahaList = ["2009", "2013", "2019"]
        //     // console.log(d.timeFormat("%Y")(d.Year))
        //     if (d.Country === "New Zealand" && d3.timeFormat("%Y")(d.Year) === "2014") return "7"
        //     else if ((d.Country === "UK") && hahaList.includes(d3.timeFormat("%Y")(d.Year))) return "7"
        //     else return "4"
        // })
        .attr("fill", d => colorEmp(d.Group))
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("80")
                .attr("cx", d => xEmpRate(d.Year))
                .attr("cy", d => yEmpRate(d.empRate))
                .attr("stroke", "black")
                .attr("stroke-width", '2')
                .attr("r", "8")
                .attr("fill", "#ff4646")

            const { clientX, clientY } = event // ???
            stateEmpRate.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                group: d.Group,
                rate: d.empRate
            }
            drawEmpRate()
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("cx", d => xEmpRate(d.Year))
                .attr("cy", d => yEmpRate(d.empRate))
                .attr("stroke", "None")
                .attr("stroke-width", 0)
                .attr("r", d => {
                    if (d.Group.match(/Wo/)) return "4.2"
                    else return "4"
                })
                .attr("fill", d => colorEmp(d.Group))

            stateEmpRate.hover.visible = false

            drawEmpRate()
        })
    drawEmpRate()
}



function drawEmpRate() {
    d3.select(".emp-rate-by-sex")
        .selectAll("div.hover-content")
        .data([stateEmpRate.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 20}px, ${d.screenPosition[1]}px)`
        })
        .html(d => {
            return `
    <div> Group: ${d.group} </div>
    <div> Rate: ${d.rate}%</div>
    `
        })
}