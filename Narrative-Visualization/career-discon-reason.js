

let svgReason;


const radReason = Math.min(width, height) / 2.5;
const innerReason = d3.arc()
    .innerRadius(radReason * 0.7)
    .outerRadius(radReason - 1)
const outerReason = d3.arc()
    .innerRadius(radReason * 0.9)
    .outerRadius(radReason * 0.9);

let pieReason = d3.pie()
    .sort(null)
    .value(d => d.ratio)
    .padAngle(0.005)

let stateReason = {
    data: null,
    selection: "15-54",
    hover: {
        screenPosition: null,
        visible: false,
        reason: null,
        ratio: null
    }
}

d3.json("./data/career_discon_reason_2020.json", d3.autoType)
    .then(data => {
        stateReason.data = data
        console.log("stateReason", stateReason)

        reasonList = ['Marriage', 'Pregnancy', 'Parenting', 'Child Education (Elementary)', 'Family Care']
        keysTttt = ["15-54", "15-29", "30-39", "40-49", "50-54"]

        group_by_group = d3.group(stateReason.data, d => d.group)
        console.log("group_by_group ", group_by_group)

        group_by_reason = d3.group(stateReason.data, d => d.reason)
        console.log("group_by_reason", group_by_reason)
        console.log("group_by_reason.keys()", Array.from(group_by_reason.keys()))

        map_by_reason = stateReason.data.map(d => d.reason)
        console.log("map_by_reason", map_by_reason)
        // groupReason = data.columns.slice(1)
        // console.log("groupReason", groupReason)
        initReason()
    })

function initReason() {
    colorReason = d3.scaleOrdinal().range(["#94d0cc", "#687980", "#9ede73", "#007580", "#897853"])
    // ["#02475e", "#687980", "#8fd9a8", "#f4eee8", "#a6acec"]
    // ["#5588a3", "#a7d0cd", "#ffef6f", "#b6c9f0", "#ff9757"]

    svgReason = d3.select(".career-discon-reason")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // dropdown 
    const selectReason = d3.select(".dropdown-reason")

    selectReason.selectAll("option")
        .data(Array.from(new Set(stateReason.data.map(d => d.group))))
        // {
        //     // console.log("hi", d[groupReason])
        //     return d.Category
        // })))))
        .join("option")
        .attr("value", d => d)
        .text(d => d)
    // .attr("font-size", "20")

    svgReason
        .selectAll("boxes")
        .data(reasonList)
        .enter()
        .append("circle")
        .attr("cx", -105)
        .attr("cy", (d, i) => -80 + i * 40)
        .attr("r", 8)
        // .attr("height", 50)
        .attr("fill", (d, i) => colorReason(d))


    svgReason
        .selectAll("labels")
        .data(reasonList)
        .enter()
        .append("text")
        .attr("y", (d, i) => -80 + i * 40)
        .attr("x", -90)
        .text(d => d)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("fill", "black")
        .attr("font-size", 18)

    console.log("dropdown:", selectReason)

    selectReason
        .on("change", event => {
            console.log("changed!", event.target.value)
            stateReason.selection = event.target.value
            console.log("new state", stateReason)
            drawReason();
        })
    drawReason()

}

function drawReason() {

    const filterReason = stateReason.data.filter(d => stateReason.selection === d.group)
    console.log("filtered", filterReason)
    arcs = pieReason(filterReason)
    // console.log("agagaaga", stateReason.data)
    console.log("aaaaaaaaaa", arcs)

    arcReason = svgReason.append("g")
        .selectAll("path")
        .data(arcs)
        .join("path")
        // .attr("transform", `translate(${width / 2}, ${width / 2})`)
        .attr("fill", d => {
            console.log("distinction", d.data.ratio)
            return colorReason(d.data.ratio)
        })
        .attr("d", innerReason)
        .attr("stroke", "#f9ffea")
        .on("mousemove", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("fill", "#ff3434")

            // console.log("checking", d)
            const { clientX, clientY } = event
            stateReason.hover = {
                screenPosition: [clientX, clientY],
                visible: true,
                reason: d.data.reason, //?????????????????
                ratio: d.data.ratio, // ????????????????????????????
            }
            toolOn()
        })
        .on("mouseout", function (event, d) {
            d3.select(this).transition()
                .duration("50")
                .attr("fill", d => colorReason(d.data.ratio))
            // donutTip.transition()
            //     .duration("50")
            //     .attr("opacity", 0)
            stateReason.hover.visible = false
            toolOn()
        })

    midAngle = function (d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 1;
    }



    // .attr("transform", `translate(${height / 3.5},${width / 5})`)
    // {
    //     console.log("legend", d[0])
    //     if (d[0] === "S") return "#f95959"
    //     else if (d[0] === "U") return "#ffb037"
    //     else if (d[1] === "t") return "#aacfd0"
    // })
    toolOn()


}



function toolOn() {


    // console.log("hover", [stateReason.hover])
    d3.select(".career-discon-reason")
        .selectAll("div.hover-content")
        .data([stateReason.hover])
        .join("div")
        .attr("class", "hover-content")
        .classed("visible", d => d.visible)
        .style("position", "absolute")
        .style("transform", d => {
            if (d.screenPosition) return `translate(${d.screenPosition[0] + 20}px, ${d.screenPosition[1] - 200}px)`
        })
        .html(d => {
            return `
            <div> Category: ${d.reason} </div>
            <div> Ratio: ${d3.format(".1%")(d.ratio)}% </div>
            `
        })


    // const donutTip = d3.select(".career-discon-reason").append("div")
    //     .attr("class", "donut-tip")
    //     .attr("opacity", 0);
}

           // console.log("Working?", arcs.reason)
            //     donutTip.transition()
            //         .duration("50")
            //         .attr("opacity", 1)

            //     let pos = d3.pointer(event, this);
            //     let num = (Math.round(d.data.ratio * 100)) + '%';
            //     // console.log("num", num)
            //     donutTip
            //         .html(d => {
            //             return `
            //            <div> Ratio: ${num} </div> 
            //         `
            //             // <div> Reason: ${stateReason.data.reason} </div>
            //         })
            //         .style("transform", `translate(${pos[0] + 470}px, ${pos[1] - 200}px)`)
            // })