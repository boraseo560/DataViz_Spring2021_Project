
let xHouse0;
let xHouse1;
let yHouse;
let xAxisHouse;
let yAxisHouse;
let svgHouse;
let stateHouse = {
    data: null,
    hover: {
        screenPosition: null,
        category: null,
        visible: false,
        time: null

    }
}


Object.assign(d3.csv("./data/06_income_type_housework_time.csv", d3.autoType), { yHouse: "Minutes" })
    .then(data => {
        stateHouse.data = data
        console.log("what", stateHouse.data)
        groupKey = stateHouse.data.columns[0]
        console.log("groupKey", groupKey)
        keys = data.columns.slice(1)
        console.log("Keys", keys)

        initHouse()

    })

function initHouse() {
    xHouse0 = d3.scaleBand()
        .domain(stateHouse.data.map(d => d[groupKey]))
        .range([margin.left, width - margin.right])
        .padding(0.5)

    xHouse1 = d3.scaleBand()
        .domain(keys)
        .range([0, xHouse0.bandwidth()])
        .padding(.1)

    yHouse = d3.scaleLinear()
        .domain([0, 360])
        .range([height - margin.bottom, margin.top])

    colors = d3.scaleOrdinal()
        .range(["#ffcd38", "#663f3f"])


    svgHouse = d3.select(".house-work")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xAxisHouse = d3.axisBottom(xHouse0)
    yAxisHouse = d3.axisLeft(yHouse)

    svgHouse.append("g")
        .call(xAxisHouse)
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .append("text")
        .text("Income Source Type")
        .attr("transform", `translate(${width / 2}, ${50})`)
        .attr("fill", "#2a2a2a")
        .attr("font-size", "20")

    // xAxisHouse = g => g
    //     .attr("transform", `translate(0,${height - margin.bottom})`)
    //     .call(d3.axisBottom(xHouse0).tickSize(3))
    //     .selectAll(".tick text")
    //     .attr("font-size", "12")
    // .call(g => g.select(".domain").remove())

    svgHouse.append("g")
        .call(yAxisHouse)
        .attr("transform", `translate(${margin.left}, ${0})`)
        .append("text")
        .text("Minutes")
        .attr("transform", `translate(${35}, ${margin.bottom - 30})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#2a2a2a")
        // .selectAll(".tick text")
        .attr("font-size", "20")
    // yAxisHouse = g => g
    //     .attr("transform", `translate(${margin.left},0)`)
    //     .call(d3.axisLeft(yHouse))
    // .call(g => g.select(".domain").remove())
    // .selectAll(".tick text")
    // .attr("font-size", "12")
    // .call(g => g.select(".tick:last-of-type text").clone()
    //     .attr("x", 3)
    //     .attr("text-anchor", "start")
    //     .attr("font-weight", "bold")
    //     .text("What is going on"))

    const houseWork = svgHouse.append("g")
        .selectAll("g")
        .data(stateHouse.data)
        .join("g")
        .attr("transform", d => `translate(${xHouse0(d[groupKey])},0)`)
        .selectAll("rect")
        .data(d => keys.map(key => ({ key, value: d[key] })))
        // .call(log, d[key])
        .join("rect")
        .attr("x", d => xHouse1(d.key))
        .attr("y", d => yHouse(d.value))
        .attr("width", xHouse1.bandwidth())
        .attr("height", d => yHouse(0) - yHouse(d.value))
        .attr("fill", d => {
            // console.log("check", d.key)
            return colors(d.key)
        })
    houseWork
        .on('mouseover', function (event, d) {
            d3.select(this)
                .transition("50")
                // .attr('opacity', "0.6")
                .attr("fill", "#ff3434")
            const { clientX, clientY } = event
            stateHouse.hover = {
                category: d.key,
                time: d.value,
                screenPosition: [clientX, clientY],
                visible: true
            }

            drawHouse();
        })
        .on('mouseout', function (event, d) {
            d3.select(this)
                .transition("50")
                // .attr('opacity', "1")
                .attr("fill", d => {
                    // console.log("house-work-color", d)
                    return colors(d.key)
                })
            stateHouse.hover.visible = false
            drawHouse();

        })
    svgHouse
        .selectAll("boxes")
        .data(["Men", "Women"])
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", border_padding - 29)
        .attr("x", (d, i) => 710 + (i * (size + rect_padding)))
        .attr("width", 20)
        .attr("height", 8)
        .attr("fill", d => colors(d[0]))
    // {
    //     console.log("legend", d[0])
    //     if (d[0] === "S") return "#f95959"
    //     else if (d[0] === "U") return "#ffb037"
    //     else if (d[1] === "t") return "#aacfd0"
    // })
    svgHouse.selectAll("labels")
        .data(["Men", "Women"])
        .enter()
        .append("text")
        .attr("y", border_padding - 24)
        .attr("x", (d, i) => 710 + 10 + i * (size + item_padding) + (size / 2) + text_offset)
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")
    drawHouse();
}

function drawHouse() {
    d3.select(".house-work")
        .selectAll('div.hover-content')
        .data([stateHouse.hover])
        .join("div")
        .attr("class", 'hover-content')
        .classed("visible", d => d.visible)
        .style("position", 'absolute')
        .style("transform", d => {
            // only move if we have a value for screenPosition
            if (d.screenPosition)
                return `translate(${d.screenPosition[0]}px, ${d.screenPosition[1] - 150}px)`
        })
        .html(d => {
            return `
      <div> Group: ${d.category} </div>
      <div> Time: ${d.time}mins </div>
      `})



}