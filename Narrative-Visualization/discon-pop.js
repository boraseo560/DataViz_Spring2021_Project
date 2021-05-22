
let xPop0;
let xPop1;
let yPop;
let xAxisPop;
let yAxisPop;
let svgPop;
let statePop = {
    data: null,
    hover: {
        screenPosition: null,
        wied: null,
        total: null,
        visible: false
    }
}


Object.assign(d3.csv("./data/11_career_discon_total_population.csv", d3.autoType), { yPop: "Minutes" })
    .then(data => {
        statePop.data = data
        console.log("what", statePop.data)
        groupKey = statePop.data.columns[0]
        console.log("groupKey", groupKey)
        keys = data.columns.slice(1)
        console.log("Keys", keys)

        initPop()

    })

function initPop() {
    xPop0 = d3.scaleBand()
        .domain(statePop.data.map(d => d[groupKey]))
        .range([margin.left, width - margin.right])
        .padding(0.5)

    xPop1 = d3.scaleBand()
        .domain(keys)
        .range([0, xPop0.bandwidth()])
        .padding(.1)

    yPop = d3.scaleLinear()
        .domain([1000000, 11000000])
        .range([height - margin.bottom, margin.top])

    colorsd = d3.scaleOrdinal()
        .range(["#8fc0a9", "#422b72"])


    svgPop = d3.select(".discon-pop")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xAxisPop = d3.axisBottom(xPop0)
    yAxisPop = d3.axisLeft(yPop).tickFormat(d3.format(",.2s"))

    svgPop.append("g")
        .call(xAxisPop)
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${50})`)
        .attr("fill", "#2a2a2a")
        .attr("font-size", "20")

    svgPop.append("g")
        .call(yAxisPop)
        .attr("transform", `translate(${margin.left}, ${0})`)
        .append("text")
        .text("Population")
        .attr("transform", `translate(${45}, ${margin.bottom - 30})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#2a2a2a")
        // .selectAll(".tick text")
        .attr("font-size", "20")

    const toolPop = svgPop.append("g")
        .selectAll("g")
        .data(statePop.data)
        .join("g")
        .attr("transform", d => {
            // console.log("d[groupKey]", d[groupKey])
            return `translate(${xPop0(d[groupKey])}, ${-47})`
        })
        .selectAll("rect")
        .data(d => keys.map(key => ({ key, value: d[key] })))
        // .call(log, d[key])
        .join("rect")
        .attr("x", d => xPop1(d.key))
        .attr("y", d => {
            // console.log("d.value", d.value)
            return yPop(d.value)
        })
        .attr("width", xPop1.bandwidth())
        .attr("height", d => yPop(0) - yPop(d.value))
        .attr("fill", d => {
            // console.log("check", d.key)
            return colorsd(d.key)
        })

    toolPop
        .on('mouseover', function (event, d) {
            d3.select(this)
                .transition("50")
                // .attr("width", xPop1.bandwidth() * 1.2)
                // .attr("height", d => (yPop(0) - yPop(d.value) * 1.2))
                .attr("fill", "#ff4646")
            // if (d.key === "Men") return "0.3"
            // else return "0.5"
            // console.log("checking another", d)
            const { clientX, clientY } = event // ???
            statePop.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                key: d.key,
                value: d.value
            }
            drawPop()

        })
        .on('mouseout', function (event, d) {
            d3.select(this)
                .transition("50")
                .attr("fill", d => colorsd(d.key))
            // .attr("width", xPop1.bandwidth())
            // .attr("height", d => yPop(0) - yPop(d.value))
            // .attr('fill', d => colors(d.key))
            statePop.hover.visible = false
            drawPop()
        })

    // svgPop
    //     .append("rect")
    //     .attr("transform", "translate(460, 30)")
    //     .attr("width", 440)
    //     .attr("height", 20)
    //     .attr("fill", "none")
    // .attr("stroke-width", "0.5")
    // .attr("stroke", "black")

    svgPop
        .selectAll("boxes")
        .data(["Total Married Women", "Women in Employment Discontinuity"])
        .enter()
        .append("rect")
        // .join("rect")
        .attr("y", 12)
        .attr("x", (d, i) => 465 + (i * (162 + 5)))
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", d => colorsd(d[0]))
    // {
    //     console.log("legend", d[0])
    //     if (d[0] === "S") return "#f95959"
    //     else if (d[0] === "U") return "#ffb037"
    //     else if (d[1] === "t") return "#aacfd0"
    // })
    svgPop.selectAll("labels")
        .data(["Total Married Women", "Women in Employment Discontinuity"])
        .enter()
        .append("text")
        .attr("y", 18)
        .attr("x", (d, i) => 488 + (i * (162 + 5)))
        // .style("fill", (d) => color(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14")

    drawPop()
}

function drawPop() {
    // console.log("hover", [statePop.hover])

    d3.select(".discon-pop")
        .selectAll("div.hover-content")
        .data([statePop.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 10}px, ${d.screenPosition[1] - 90}px)`
        })
        .html(d => {
            return `
            <div> ${d.key} </div>
            <div> Population: ${d3.format(",.3s")(d.value)} </div>

            `
        })
}