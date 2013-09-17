ta = null;
var bookToChapter = {};
var bookToChapterCount = {};
var maxLength = 250;

var contraFilters = {
    book: null, /* Specific book name */
    chapter: null, /* Specific absolute chapter */
    type: null, /* Specific contradiction type */
    refCount: null, /* Specific range of references */
    crossBook: false, /* Only show cross-book contradictions */
    colorize: 'Rainbow' /* Colorize the arcs */
};

var color = d3.scale.ordinal().range(colorbrewer['YlOrBr'][9]);

function schoen_url(man_id) {
    return "http://dla.library.upenn.edu/dla/schoenberg/record.html?id=SCHOENBERG_" + man_id
}
if (!window.maxArcs) {
    var maxArcs = 10;
}

// Available contradiction types
var contraTypeFilters = {
    'All': null,
    'Count': /(how (many|old))|(sixth)/i,
    'People': /(^\s*who)|(whom)|(whose)|(sons? of)|(mother)|(father)|(offspring)|(genealogy)|(related)/i,
    'Time': /(^\s*when)|(what day)|(which came first)/i,
    'Location': /(where)|(road)|(mountain)|(from the)/i,
    'Death': /(heaven)|(hell)|(die)|(death)|(lifespan)|(congregation of the lord)|(live long)/i,
    'Love': /(marry)|(marriage)|(love)|(sex)|(homosexual)|(conceive)|(wife)|(childbearing)|(adulterer)/i,
    'God': /god/i,
    'Jesus': /jesus/i,
    'Other': null
};

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
        date = parseInt(date);
        if (date > 1000 && date <= 2013) {
            /*
            
            if (date < mindate) {
                mindate = date;
            }*/
            return date - 1043;
        }
        else
        return 0;
    }
    else {
        //console.log(exchange);
        return 0;
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
            /*d3.select('#viewport')
                .selectAll('.arc')
                .sort(function (a, b) {
                    return (a == d) ? 1 : -1;
                });
                render();
                console.log(d);
                */
            /*
            var lst = [];
            for(var i=0; i<d.refs.length; i++) {
                var exchange = exchanges[ref];
                if ( exchange ) {
                    lst.push(exchange);
                }
            }*/
        
            var disp_text = d.desc + '<br />Manuscript id: ' + d.manuscript_id;

            d3.select('#selected')
                .html(disp_text);
        })
        .on('mouseout', function(d) {
            d3.select(this).selectAll('path')
                .style('stroke', function() { return color(getAbsoluteChapter[d.refs.length-2]); } )
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
                                return color(start);
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


// Chooses a color for an arc from start to end
function colorize(start, end) {
    var color = '#F5D9A4';
    var distance;

    if (contraFilters.colorize == 'Rainbow') {
        distance = Math.abs(end - start);
        color = d3.hsl(distance / 1189 * 360, 0.7, 0.35);
    }

    return color;
}


d3.select('#selected').transition().delay(7000).duration(1000).style('opacity', 1.0);

d3.select('#filter-notice')
    .transition()
        .delay(1000)
        .duration(1000)
        .style('opacity', 1.0)
    .transition()
        .delay(4000)
        .duration(1000)
        .style('opacity', 0)
    .transition()
        .style('display', 'none');

d3.select('#contra-notice')
    .transition()
        .delay(4000)
        .duration(1000)
        .style('opacity', 1.0)
    .transition()
        .delay(7000)
        .duration(1000)
        .style('opacity', 0)
    .transition()
        .style('display', 'none');

d3.select('#langSelect')
    .on('change', function () {
        var lang = this.value;

        if (lang == 'new') {
            return window.location = '/translate.html';
        }

        var path = window.location.pathname;

        if (path[path.length - 1] == '/') {
            window.location = path + 'index' + (lang == 'en' ? '' : '-' + lang) + '.html';
        } else {
            var match = /(.*?)(-.*)?\.html/gi.exec(path);
            if (match) {
                path = match[1];
                window.location = match[1] + (lang == 'en' ? '' : '-' + lang) + '.html';
            }
        }
    });




var svg = d3.select('#viewport');

var chapters = [];
for (var i=0; i < 2014; i++) {
    chapters[i] = 0;
}

for (var i=0; i < man_array.length; i++) {
    manu = man_array[i];
    var exchs = manu.refs;
    for (var j=0; j<exchs.length; j++) {
        var exch = exchs[j];
        var date = getAbsoluteChapter(exch);
        console.log(date, exch);
        chapters[date]++;
    }
}

svg.selectAll('rect').data(chapters).enter()
    .append('rect')
        .attr('x', function(d, i) {
            return i;
        })
        .attr('y', 400)
        .attr('width',1)
        .attr('height', function(d, i) {
            return chapters[i];
        })
        .on('mouseover', function (d) {
            render();
            d3.select('#selected')
                .html(d);
        });


var text = svg.selectAll('text').data(chapters).enter()
    .append('text')
        .attr('x', function(d, i) {
            return i*1.5;
        })
        .attr('y', 440)
        .text(function(d, i) {
            //console.log(i);
            if (i%50==7/* && i+1043 < 1670*/) {
                return i + 1043;
            }
            else {
                return ""
            }
        });

render();

var typeSelect = d3.select('#type-select');

typeSelect.selectAll('option').data(Object.keys(contraTypeFilters)).enter().append('option')
    .text(function (d) {return d; });

typeSelect.on('change', function () {
    contraFilters.type = this.value;

    render();
});

d3.select('#color-select')
    .on('change', function () {
        // Set the filter
        contraFilters.colorize = this.value;

        // Clear all current arcs so they get recreated
        d3.select('#viewport').selectAll('.arc').remove();

        render();
    });
