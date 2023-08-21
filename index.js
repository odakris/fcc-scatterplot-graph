document.addEventListener("DOMContentLoaded", function () {
  //   URL JSON DATA
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  //   fetch data from json url
  const getData = (url) => {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data);
  };

  getData(url).then((data) => {
    const json = data;

    //     parameters
    const w = 1100;
    const h = 650;
    const padding = 50;
    const legendcolors = ["red", "green"];
    const legendlabels = [
      "Riders WITH doping allegations",
      "Riders WITHOUT doping allegations",
    ];

    const title = "Doping in Professional Bicycle Racing";
    const subtitle = "Fastest times up Alpe d'Huez";

    //     Format date for time in json data
    json.forEach((item) => {
      let splitTime = item.Time.split(":");
      item.Time = new Date(1970, 0, 1, 0, splitTime[0], splitTime[1]);
    });

    //     Add class to body
    d3.select("body").attr("class", "flex-center");

    //     Create container
    d3.select("body").append("div").attr("id", "container");
    d3.select("#container").attr("class", "flex-center");

    //     Add title and subtitle to container
    d3.select("#container").append("div").attr("id", "titles");

    d3.select("#titles")
      .append("h1")
      .attr("id", "title")
      .text(title)
      .style("color", "linen");

    d3.select("#titles")
      .append("h2")
      .attr("id", "subtitle")
      .text(subtitle)
      .style("color", "linen");

    //     Append credit
    d3.select("#titles")
      .append("h5")
      .attr("id", "credit")
      .html(
        "Created by <a href='https://github.com/odakris?tab=repositories' target='_blank' rel='noreferrer noopener'>Odakris</a>"
      )
      .style("color", "linen");

    //      Create div for Scatterplot Graph
    d3.select("#container").append("div").attr("id", "scatterplot");

    //     Scales X
    //     minYear return minYear - 1 to extent axis
    const minYear = d3.min(json, (d) => d.Year - 1);
    //     maxYear return minYear + 1 to extent axis
    const maxYear = d3.max(json, (d) => d.Year + 1);

    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, w - padding]);

    //     Scale Y
    const minTime = d3.min(json, (d) => d.Time);
    const maxTime = d3.max(json, (d) => d.Time);

    const yScale = d3
      .scaleTime()
      .domain([maxTime, minTime])
      .range([h - padding, padding]);

    //     SVG
    const svg = d3
      .select("#scatterplot")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style("border", "2px solid linen");

    //     Plot dots
    const dot = svg
      .selectAll("circle")
      .data(json)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("r", (d) => 8)
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time)
      .attr("fill", (d) => (d.Doping ? "red" : "green"))
      .style("opacity", 0.6)
      .style("stroke", "black");

    //     Plot xAxis
    //     tickFormat(d3.format("d")) ==> date format
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg
      .append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis)
      .attr("id", "x-axis");

    //     Plot yAxis
    //     tick labels on the y-axis with %M:%S time format
    let formatTime = d3.timeFormat("%M:%S");

    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);
    svg
      .append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis)
      .attr("id", "y-axis");

    //     tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0);

    dot
      .on("mousemove", function (event, d) {
        tooltip
          .html(
            "Name: " +
              d.Name +
              "</br>" +
              "Nationality: " +
              d.Nationality +
              "</br>" +
              "Year: " +
              d.Year +
              "</br>" +
              "Time: " +
              formatTime(d.Time) +
              "</br>" +
              (d.Doping ? "Note: " + d.Doping : "")
          )
          .attr("data-year", d.Year)
          .attr("data-time", formatTime(d.Time))
          .style("top", event.pageY + 20 + "px")
          .style("left", event.pageX + 20 + "px")
          .style("opacity", 0.8);
      })
      .on("mouseout", function (d) {
        tooltip.style("opacity", 0);
      });

    //     Legend
    const legend = d3
      .select("#container")
      .append("svg")
      .attr("id", "legend")
      .attr("width", 250)
      .attr("height", 60);

    legend
      .selectAll("#legenddata")
      .data(legendcolors)
      .enter()
      .append("circle")
      .attr("cx", 15)
      .attr("cy", (d, i) => 15 + i * 25)
      .attr("r", 10)
      .style("fill", (d) => d)
      .style("stroke", "black")
      .style("opacity", 0.8);

    legend
      .selectAll("#legenddata")
      .data(legendlabels)
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", (d, i) => 20 + i * 25)
      .text((d) => d);
  });
});
