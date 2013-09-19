ta = null;
var bookToChapter = {};
var bookToChapterCount = {};
var maxLength = 250;

//vart start_date = 1043
var mag_factor = 3.7;
var start_date = 1700;
var end_date = 2021;

var color = d3.scale.category10(); //ordinal().range(colorbrewer['PuBu'][9]);

function schoen_url(man_id) {
    return "http://dla.library.upenn.edu/dla/schoenberg/record.html?id=SCHOENBERG_" + man_id
}
if (!window.maxArcs) {
    var maxArcs = 10;
}

//var mindate = 2013;
var man_array = [];
for (var obj in manuscripts) {
    man_array.push(manuscripts[obj]);
}


function getAbsoluteChapter(exchange_id) {
    //return the year
    var exchange = exchanges[exchange_id];
    if (exchange) {
        var date = exchange.cat_date;
        date = date.substr(0,4);
        var timeline_date = parseInt(date);
        if (timeline_date > start_date && timeline_date <= end_date) {
            return mag_factor*(timeline_date - start_date);
        }
        else {
            console.log("Corrupted database entry cat_date = " + date);
            return '';
        }
    }
    else {
        console.log("Exchange not found error: " + exchange);
        return '';
    }

}


d3.select('#contradictions-chart')
    .append('g')
    .attr('id', 'viewport');

function render() {

    var chart = d3.select('#viewport')
        .selectAll('.arc')
        .data(man_array, function (d) { return d.desc; });

    chart.enter().append('g')
        .attr('class', 'arc')
        .on('click', function (d) {
            var url = schoen_url(d.manuscript_id);
            // Handle [cmd/ctrl]+click and middle click to open a new tab
            window.open(url, "_blank");
        })
        .on('mouseover', function (d) {

            d3.select(this).selectAll('path')
            .style('stroke', function() { return '#111111'; });

            var disp_text = 'Title: ' +  d.desc +
                '<br />Manuscript id: ' + d.manuscript_id +
                '<br />Language: ' + d.language +
                '<br />Date: ' + d.date;

            d3.select('#selected')
                .html(disp_text);
        })
        .on('mouseout', function (d, i) {
            var group = d3.select(this);
            if (d.refs.length > 1) {
                for (x = 0; x <= Math.min(maxArcs, d.refs.length - 2); x++) {
                    var start = getAbsoluteChapter(d.refs[x]);
                    var end = getAbsoluteChapter(d.refs[x + 1]);

                    if (start > end) {
                        var tmp = end;
                        end = start;
                        start = tmp;
                    }

                    if (!isNaN(start) && !isNaN(end)) {
                    d3.select(this).selectAll('path')
                        .style('stroke', function() { return color(d.language); } );
                    }
                }
            }
        })
        .each(function (d, i) {
            var group = d3.select(this);
            if (d.refs.length > 1) {
                // Only show up to 10 refs, some have over 100...
                for (x = 0; x <= Math.min(maxArcs, d.refs.length - 2); x++) {
                    var start = getAbsoluteChapter(d.refs[x]);
                    var end = getAbsoluteChapter(d.refs[x + 1]);

                    if (start > end) {
                        var tmp = end;
                        end = start;
                        start = tmp;
                    }

                    var r = (end - start) * 0.51;
                    var ry = Math.min(r, 490);
                    if (!isNaN(start) && !isNaN(end) && !isNaN(r) && !isNaN(ry)) {
                        var path = 'M ' + start + ',399 A ' + r + ',' + ry + ' 0 0,1 ' + end + ',399 ';
                        group.append('path')
                            .attr('d', path)
                            .style('stroke', function (start, end) {
                                return color(d.language);
                            }(start, end));
                    }
                }
            }
        });
/*
    chart.exit()
        .transition()
            .duration(350)
            .style('opacity', 0)
        .remove();
*/
/*
    // Update any highlighting from filters
    d3.select('#viewport').selectAll('rect')
        .classed('selected', false);

    if (contraFilters.book !== null) {
        d3.select('#viewport').selectAll('.b' + contraFilters.book.replace(/\s+/g, '').toLowerCase())
            .classed('selected', true);
    }
*/
}


var svg = d3.select('#viewport');

var chapters = [];
for (var i=0; i < end_date-start_date; i++) {
    chapters[i] = 0;
}

for (var i=0; i < man_array.length; i++) {
    manu = man_array[i];
    var exchs = manu.refs;
    for (var j=0; j<exchs.length; j++) {
        var exch = exchs[j];
        var date = getAbsoluteChapter(exch-start_date);
        //console.log(date, exch);
        chapters[date]++;
    }
}

svg.selectAll('rect').data(chapters).enter()
    .append('rect')
        .attr('x', function(d, i) {
            return i*mag_factor;
        })
        .attr('y', function(d, i) {
            if (i%50==0) {
                return 385;
            }
            else {
                return 400;
            }
        })
        .attr('width',2)
        .attr('height', function(d, i) {
            if (i%50==0) {
                return 30;
            }
            if (i%5==0) {
                return 15;  //chapters[i];
            }
            console.log(chapters[i]);
        })
        /*
        .on('mouseover', function (d) {
            d3.select(this)
            .style('fill', function() { return '#AAAAAA'; });
        })
        .on('mouseout', function (d) {
            d3.select(this)
            .style('fill', function() { return '#000000'; });
        });
        */

var text = svg.selectAll('text').data(chapters).enter()
    .append('text')
        .attr('x', function(d, i) {
            return i*mag_factor;
        })
        .attr('y', 400)
        .text(function(d, i) {
            //console.log(i);
            if (i%20==0/* && i+start_date < 1670*/) {
                return i + start_date;
            }
            else {
                return ""
            }
        });

render();

