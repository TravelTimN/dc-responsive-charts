$(document).ready(function () {

    queue()
        .defer(d3.json, "js/transactions.json")
        .await(makeGraphs);

    function makeGraphs(error, dataset) {

        // crossfilters
        var barChartCrossfilter = crossfilter(dataset);
        var pieChartCrossfilter = crossfilter(dataset);
        //var lineChartCrossfilter = crossfilter(dataset);

        // dimensions
        var barChartNameDimension = barChartCrossfilter.dimension(dc.pluck("name"));
        var barChartStoreDimension = barChartCrossfilter.dimension(dc.pluck("store"));
        var barChartStateDimension = barChartCrossfilter.dimension(dc.pluck("state"));
        var pieChartNameDimension = pieChartCrossfilter.dimension(dc.pluck("name"));
        var pieChartStoreDimension = pieChartCrossfilter.dimension(dc.pluck("store"));
        var pieChartStateDimension = pieChartCrossfilter.dimension(dc.pluck("state"));
        //var lineChartDimension = lineChartCrossfilter.dimension(dc.pluck("date"));

        // groups
        var barChartSpendPerPerson = barChartNameDimension.group().reduceSum(dc.pluck("spend"));
        var barChartSpendPerStore = barChartStoreDimension.group().reduceSum(dc.pluck("spend"));
        var barChartSpendPerState = barChartStateDimension.group().reduceSum(dc.pluck("spend"));
        var pieChartSpendPerPerson = pieChartNameDimension.group().reduceSum(dc.pluck("spend"));
        var pieChartSpendPerStore = pieChartStoreDimension.group().reduceSum(dc.pluck("spend"));
        var pieChartSpendPerState = pieChartStateDimension.group().reduceSum(dc.pluck("spend"));
        //var lineChartSpendPerMonth = lineChartDimension.group().reduceSum(dc.pluck("spend"));

        // BAR CHARTS
        var barChartPerPerson = dc.barChart("#barChart-perPerson");
        var barChartPerStore = dc.barChart("#barChart-perStore");
        var barChartPerState = dc.barChart("#barChart-perState");
        // PIE CHARTS
        var pieChartPerPerson = dc.pieChart("#pieChart-perPerson");
        var pieChartPerStore = dc.pieChart("#pieChart-perStore");
        var pieChartPerState = dc.pieChart("#pieChart-perState");
        // LINE CHART
        //var lineChartPerMonth = dc.lineChart("#lineChart-perMonth");

        // BAR CHART FUNCTION
        function barChartBuilder(chartName, dimension, group, xAxisLabel, yAxisLabel) {
            chartName
                .width(300)
                .height(300)
                .margins({
                    top: 0,
                    right: 0,
                    bottom: 40,
                    left: 40
                })
                .useViewBoxResizing(true) // allows chart to be responsive
                .dimension(dimension)
                .group(group)
                .transitionDuration(500)
                .transitionDelay(250)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .gap(10)
                .renderHorizontalGridLines(true)
                .xAxisLabel(xAxisLabel)
                .yAxisLabel(yAxisLabel)
                .yAxis().ticks(10);
        };
        // BAR CHARTS
        barChartBuilder(barChartPerPerson, barChartNameDimension, barChartSpendPerPerson, "Person", "Spend");
        barChartBuilder(barChartPerStore, barChartStoreDimension, barChartSpendPerStore, "Store", "Spend");
        barChartBuilder(barChartPerState, barChartStateDimension, barChartSpendPerState, "State", "Spend");

        // PIE CHART FUNCTION
        function pieChartBuilder(chartName, dimension, group) {
            chartName
                .height(400)
                //.radius(400) // adjusted in CSS
                .useViewBoxResizing(true) // allows chart to be responsive
                .dimension(dimension)
                .group(group)
                .transitionDuration(500)
                .transitionDelay(250);
        };
        // PIE CHART
        pieChartBuilder(pieChartPerPerson, pieChartNameDimension, pieChartSpendPerPerson);
        pieChartBuilder(pieChartPerStore, pieChartStoreDimension, pieChartSpendPerStore);
        pieChartBuilder(pieChartPerState, pieChartStateDimension, pieChartSpendPerState);


        // LINE CHART BUILDER

        //-- parse Date format from json
        //var parseDate = d3.time.format("%d/%m/%Y").parse;
        //dataset.forEach(function (d) {
        //d.date = parseDate(d.date);
        //});
        //var lineChartMinDate = lineChartDimension.bottom(1)[0].date;
        //var lineChartMaxDate = lineChartDimension.top(1)[0].date;

        //function lineChartBuilder(chartName, dimension, group, minDate, maxDate, xAxisLabel, yAxisLabel) {
        //chartName
        ////.width(1000)
        ////.height(300)
        //.margins({
        //top: 10, //0
        //right: 50, //0
        //bottom: 30, //40
        //left: 50 //40
        //})
        //.useViewBoxResizing(true) // allows lineChart to be responsive
        //.dimension(dimension)
        //.group(group)
        //.transitionDuration(500)
        //.transitionDelay(250)
        //.x(d3.time.scale().domain([minDate, maxDate]))
        //.renderHorizontalGridLines(true)
        //.xAxisLabel(xAxisLabel)
        //.yAxisLabel(yAxisLabel)
        //.yAxis().ticks(5);
        //}

        // LINE CHARTS
        //lineChartBuilder(lineChartPerMonth, lineChartDimension, lineChartSpendPerMonth, lineChartMinDate, lineChartMaxDate, "Month", "Spend");
        //-- parse Date format from json
        var parseDate = d3.time.format("%d/%m/%Y").parse;
        dataset.forEach(function (d) {
            d.date = parseDate(d.date);
        });
        var lineChartCrossfilter = crossfilter(dataset);
        var lineChartDimension = lineChartCrossfilter.dimension(dc.pluck("date"));
        var lineChartSpendPerMonth = lineChartDimension.group().reduceSum(dc.pluck("spend"));
        var lineChartMinDate = lineChartDimension.bottom(1)[0].date;
        var lineChartMaxDate = lineChartDimension.top(1)[0].date;
        dc.lineChart("#lineChart-perMonth")
            //.width(1000)
            //.height(300)
            .margins({
                top: 10, //0
                right: 50, //0
                bottom: 30, //40
                left: 50 //40
            })
            .useViewBoxResizing(true) // allows lineChart to be responsive
            .dimension(lineChartDimension)
            .group(lineChartSpendPerMonth)
            .transitionDuration(500)
            .transitionDelay(250)
            .x(d3.time.scale().domain([lineChartMinDate, lineChartMaxDate]))
            .renderHorizontalGridLines(true)
            .xAxisLabel("Month")
            .yAxisLabel("Spend")
            .yAxis().ticks(5);

        dc.renderAll();

        //console.log(lineChartPerMonth.minDate);
    }
});