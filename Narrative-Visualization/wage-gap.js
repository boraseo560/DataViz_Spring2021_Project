// Germany, OECD Total, Romania - 2018 data

let xGap;
let yGap;
let xAxisGap;
let yAxisGap;
let svgGap;

let stateGap = {
    data: null
}

d3.csv("./data/02_oecd_wage_gap.csv", d3.autoType)
    .then(raw_data => {
        console.log("DATA", raw_data)
        data = raw_data.sort((a, b) => d3.ascending(a.Gap, b.Gap))
        console.log("Ascending", data)


        xGap = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Gap)])
            .range([margin.left, width - margin.right])


        yGap = d3.scaleBand().paddingInner(0.2)
            .domain(data.map(d => d.Country))
            .range([height - margin.bottom, margin.top])

        xAxisGap = d3.axisTop(xGap)
        // .attr('transform', `translate(0,${margin.top})`)
        // .call(d3.axisTop(xGap))
        // .append("text")
        // .text("Wage Gap")
        // .style("text-anchor", "middle")
        // .attr("transform", `translate(${width / 2}, ${40})`)
        // .attr("fill", "black")
        // .attr("font-size", "20")

        yAxisGap = d3.axisLeft(yGap).tickSize(0)
        // = g => g
        // .attr("transform", `translate(${margin.left},0)`)
        // .call(d3.axisLeft(yGap))
        // .append('text')
        // .text("Country")
        // .attr("transform", `translate(${- 30}, ${height / 2})rotate(-90)`)
        // .attr("text-anchor", "middle")
        // .attr("fill", "black")
        // .attr("font-size", "20")

        svgGap = d3.select(".wage-gap")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        svgGap.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("width", d => xGap(d.Gap) - margin.right)
            .attr("height", yGap.bandwidth())
            .attr("fill", d => {
                if (d.Country === "South Korea") return "#6a492b"

                else if (d.Country === "USA") return "#a58faa"
                else if (d.Country === "OECD Total*") return "#c8c2bc"
                // "#fb4936"
                else return "#bfdcae"
            })
            .attr("x", d => margin.left + 30)
            .attr("y", d => yGap(d.Country))
            .on("mouseover", event => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration("200")
                    .attr("fill", "#f04747")
            })
            .on("mouseout", event => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration("100")
                    .attr("fill", d => {
                        if (d.Country === "South Korea") return "#6a492b"

                        else if (d.Country === "USA") return "#a58faa"
                        else if (d.Country === "OECD Total*") return "#c8c2bc"
                        // "#fb4936"
                        else return "#bfdcae"
                    })
            })
        // .transition()
        // .ease(d3.easeLinear)
        // .duration(750)
        // .attr("x", d => xGap(d.Gap))
        // .attr("width", d => xGap(d.Gap))
        // .delay((d, i) => i * 100)

        svgGap.append("g")
            .call(yAxisGap)
            .attr("transform", `translate(${margin.left + 30},0)`)
            .selectAll(".tick text")
            .attr("font-size", "15")


        svgGap.append("g")
            .attr("class", "xAxisGap")
            .attr("transform", `translate(30, ${margin.top})`)
            .call(xAxisGap)
            .append("text") // 왜 안 보이지????
            .text(" (%)")
            .attr("transform", `translate(${width - 50}, ${-15})`)
            .attr("text-anchor", "middle")
            .attr("fill", "#0f0f0f")
            .attr("font-size", "20")

        svgGap.selectAll("text.Gap")
            .data(data)
            .join("text")
            .attr("class", "Gap")
            .text(d => d.Gap + "%")
            .attr("x", d => xGap(d.Gap))
            .attr("y", d => yGap(d.Country) + (yGap.bandwidth() / 2))
            .attr("dx", d => {
                if (d.Country === "South Korea") return "0.9em"
                else return "1.2em"
            }
            )
            .attr("dy", "0.4em")
            .attr("fill", d => {
                if (d.Country === "South Korea") return "#e1ffc5"
                else return "#2b2b2b"
            }
            )
            .attr("text-anchor", "end")
            .attr("font-size", d => {
                if (d.Country === "South Korea") return "22"
                else return "18"
            }
            )
        svgGap
            .append("text")
            .attr("x", 720)
            .attr("y", 520)
            .text("*Pay gap from 2018 Data")
            .style("font-size", "18")
            .attr("fill", "#0f0f0f")
            .attr("alignment-baseline", "middle")

    })
