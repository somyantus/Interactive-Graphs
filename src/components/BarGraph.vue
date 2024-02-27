<template>
    <div>
        <div ref="chartContainer" id="chartContainer">
            <svg ref="chart"></svg>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    props: {
        selectedGraphs: {
            type: Array,
            required: true,
        },
        chartData: {
            type: Array,
            required: true,
        },
        addedDataPoint: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            width: 700,
            height: 500,
            margin: 50

        }
    },
    watch: {
        selectedGraphs() {
            this.renderChart()
        },
        addedDataPoint() {
            this.renderChart()
        }
    },
    created() {
        this._windowListener = window.addEventListener("resize", this.handleResize)
    },
    mounted() {
        this.renderChart()
        this.addTooltip()
    },
    methods: {
        handleResize() {
            this.width = window.innerWidth * 75 / 100
            this.height = Math.min(500, window.innerHeight * 75 / 100)
            this.renderChart()
        },
        renderChart() {
            const [x, y, g] = this.drawChart()
            const toDraw = []

            if (this.selectedGraphs.includes('max'))
                toDraw.push('max')
            if (this.selectedGraphs.includes('min'))
                toDraw.push('min')
            if (this.selectedGraphs.includes('mean'))
                toDraw.push('mean')

            for (const graph of toDraw) {
                const selectedData = this.chartData.map((d) => ({
                    day: d.day, value: d[graph]
                }))
                if (graph === 'mean') {
                    this.lineChart(selectedData, x, y, g)
                } else if (graph === 'max') {
                    this.barChart(selectedData, x, y, g, '#60beae')
                } else if (graph === 'min') {
                    this.barChart(selectedData, x, y, g, '#f1efe3')
                }
            }
        },
        drawChart() {
            const svg = d3.select("svg").attr("width", this.width).attr("height", this.height).attr("viewBox", [0, 0, this.width, this.height]);
            svg.selectAll('*').remove()
            const g = svg.append("g")

            const x = d3
                .scaleBand()
                .padding(0.2)
                .domain(this.chartData.map((d) => { return d.day }))
                .range([this.margin, this.width - this.margin])

            const y = d3
                .scaleLinear()
                .domain([0, d3.max(this.chartData, (d) => { return d.max }) + 10])
                .range([this.height - this.margin, this.margin])



            g.append("g")
                .call(d3.axisBottom(x))
                .attr("transform", `translate(0,${this.height - this.margin})`)
                .append("text")
                .attr("fill", "#000")
                .attr("text-anchor", "center")
                .attr("x", 29)
                .attr("y", 10)
                .text("Days");

            g.append("g")
                .call(d3.axisLeft(y))
                .attr("transform", `translate(${this.margin},0)`)
                .append("text")
                .attr("fill", "#000")
                .attr("text-anchor", "center")
                .attr("transform", `rotate(-90) translate(-${this.height / 2},-${this.margin / 2})`)
                .text("Temparature (Celsius)")

            return [x, y, g]

        },
        lineChart(selectedData, x, y, g) {
            const line = d3.line()
                .x(function (d) {
                    return x(d.day)
                })
                .y(function (d) {
                    return y(d.value)
                })

            g.append("path")
                .datum(selectedData)
                .attr("fill", "none")
                .attr("stroke", "#3d9098")
                .attr("stroke-width", 1.5)
                .attr("transform", `translate(${(((this.width - this.margin * 2) / selectedData.length) / 2) * 0.8}, 0)`)
                .attr("d", line)

            g.selectAll(".dot")
                .data(selectedData)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", function (d) { return x(d.day); })
                .attr("cy", function (d) { return y(d.value); })
                .attr("r", 5)
                .attr("fill", "#679186")
                .attr("transform", `translate(${(((this.width - this.margin * 2) / selectedData.length) / 2) * 0.8}, 0)`)
                .on("mouseover", this.handleMouseOver)
                .on("mousemove", (event, d) => { this.handleMouseMove(event, d) })
                .on("mouseleave", this.handleMouseLeave)
        },
        barChart(selectedData, x, y, g, fill) {
            let $this = this
            g.selectAll("mybar")
                .data(selectedData)
                .enter()
                .append("rect")
                .attr("x", function (d) { return x(d.day); })
                .attr("y", function (d) { return y(d.value); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                    return $this.height - $this.margin - y(d.value);
                })
                .attr("fill", fill)
                .on("mouseover", $this.handleMouseOver)
                .on("mousemove", (event, d) => { this.handleMouseMove(event, d) })
                .on("mouseleave", $this.handleMouseLeave)
        },
        addTooltip() {
            if (this._tooltip) return

            this._tooltip = d3.select("#chartContainer")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
        },
        handleMouseOver() {
            this._tooltip.style("opacity", 1)
            d3.select("#chartContainer div")
                .style("stroke", "black")
                .style("opacity", 1)
        },
        handleMouseMove(event, d) {
            this._tooltip
                .html("The exact value of<br>this cell is: " + d.value)
                .style("left", (event.pageX - this.margin * 6) + "px")
                .style("top", (event.pageY -this.margin * 2) + "px")
        },
        handleMouseLeave() {
            this._tooltip
                .style("opacity", 0)
            d3.select("#chartContainer div")
                .style("stroke", "none")
                .style("opacity", 0)
        },
    }
}
</script>

<style scoped lang="postcss">
svg {
    @apply my-4 mx-auto
}
</style>

<style>
#chartContainer {
    position: relative;
}

.tooltip {
    position: absolute;
    opacity: 0;
}
</style>