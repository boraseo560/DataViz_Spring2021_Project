
let xDisPop0;
let xDisPop1;
let yDisPop;
let xAxisDisPop;
let yAxisDisPop;
let svgDisPop;

let stateDisPop = {
    data: [],
    selection: "2014"
}

const timeTime = d3.timeFormat("%Y")
d3.csv("./data/10_career_discon_age_population_2014_2020.csv", d3.autoType, d => {
    return {
        Year: timeTime(new Date(+d.Year, 0, 1)),
        Total: +d['Total Married Women'],
        Discon: +d['Women in Employment Discontinuity'],
        Group: d.Group
    }
}).then(data => {
    stateDisPop.data = data
    console.log("load population", stateDisPop.data)
    groupKey = stateDisPop.data.columns[0]
    console.log("groupDisPop", groupKey)
    keys = data.columns.slice(2)
    console.log("keysDisPop", keys)

    initDisPop()

})

function initDisPop() {
    xDisPop0 = d3.scaleBand()
        .domain(stateDisPop.data.map(d => d[groupKey]))
        .range([margin.left, width - margin.right])
        .padding(0.5)

    xDisPop1 = d3.scaleBand()
        .domain(keys)
        .range([0, xDisPop0.bandwidth()])
        .padding(.1)

    yDisPop = d3.scaleLinear()
        .domain([0, 9000])
        // d3.extent(stateDisPop.data, d => d.Total))
        // [0, d3.max(stateDisPop.data, d => d3.max(keys, key => d[key]))]).nice()
        .range([height - margin.bottom, margin.top])

    colorsDisPop = d3.scaleOrdinal()
        .range(["#2b2e4a", "#e84545"])


    svgDisPop = d3.select(".pop-test")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    xAxisDisPop = d3.axisBottom(xDisPop0)
    yAxisDisPop = d3.axisLeft(yDisPop)

    svgDisPop.append("g")
        .call(xAxisDisPop)
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .selectAll(".tick text")
        .attr("font-size", "12")

    svgDisPop.append("g")
        .call(yAxisDisPop)
        .attr("transform", `translate(${margin.left}, ${0})`)
    // .selectAll(".tick text")
    // .attr("font-size", "12")

    // dropdown 
    const selectElement = d3.select(".dropdown-test")

    selectElement.selectAll("option")
        .data(Array.from(new Set(stateDisPop.data.map(d => d.Year))))
        .join("option")
        .attr("value", d => d)
        .text(d => d)

    console.log("dropdown:", selectElement)

    selectElement
        .on("change", event => {
            console.log("changed!", event.target.value)
            stateDisPop.selection = event.target.value
            console.log("new state", stateDisPop)
            drawDisPop();
        })

    drawDisPop();
}

function drawDisPop() {

    const filterDisPop = stateDisPop.data.filter(d => stateDisPop.selection === d.Year)
    console.log("FILTERED", filterDisPop)

    // yDisPop.domain(d3.extent(filterDisPop, d => d3.max(keys, key => d[key]))).nice()

    svgDisPop
        .append("g")
        .selectAll("g")
        .data(filterDisPop)
        .join("g")
        .attr("transform", d => `translate(${xDisPop0(d[groupKey])},0)`)
        .selectAll("rect")
        .data(d => [d.Total, d.Discon])
        // console.log("whatisthis", filterDisPop.map(key => ({ key, value: d[key] })))
        // return filterDisPop.map(key => ({ key, value: d[key] }))
        .join("rect")
        .attr("x", (d, i) => {
            // console.log("key", d.key)
            return xDisPop1(d.key)
        })
        .attr("y", d => {
            console.log("value", d.value)
            return yDisPop(d.value)
        })
        .attr("width", xDisPop1.bandwidth())
        .attr("height", d => {
            console.log("values?", d)
            // console.log(yDisPop(1))
            return yDisPop(d[0]) - yDisPop(d.value)
        })
        .attr("fill", d => colorsDisPop(d.key))

}