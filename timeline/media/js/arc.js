ta = null;
var bookToChapter = {};
var bookToChapterCount = {};
var maxLength = 250;

var contra = null;
var contraFilters = {
    book: null, /* Specific book name */
    chapter: null, /* Specific absolute chapter */
    type: null, /* Specific contradiction type */
    refCount: null, /* Specific range of references */
    crossBook: false, /* Only show cross-book contradictions */
    colorize: 'Rainbow' /* Colorize the arcs */
};

var color = d3.scale.ordinal().range(colorbrewer['Blues'][9]);

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



function renderContra() {

    var chart = d3.select('#contradictions-chart')
        .selectAll('.arc')
        .data(exchanges);
        /*.filter(function (d) {
            var i, found, match;
            // Filter out items that don't touch this chapter
            if (contraFilters.chapter !== null) {
                found = false;

                for (i = 0; i <= Math.min(d.refs.length - 1, 10); i++) {
                    var year = getAbsoluteChapter(d.refs[i]);
                    if (year == contraFilters.chapter) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }

            // Filter out items that don't touch this book
            if (contraFilters.book !== null) {
                found = false;

                for (i = 0; i < Math.min(d.refs.length - 1, 10); i++) {
                    match = /(\d?\s*\w+)/.exec(d.refs[i]);

                    if (match && (match[1] == contraFilters.book || match[1] + 's' == contraFilters.book)) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }

            // Filter out the wrong type of item
            var regex;
            if (contraFilters.type !== null) {
                if (contraFilters.type == 'Other') {
                    // Exclude any of the listed types except 'All' and 'Other'
                    var keys = Object.keys(contraTypeFilters);
                    for (i = 0; i < keys.length; i++) {
                        regex = contraTypeFilters[keys[i]];
                        if (regex && regex.test(d.desc)) {
                            return false;
                        }
                    }
                } else {
                    // Include only this type
                    regex = contraTypeFilters[contraFilters.type];
                    if (regex && !regex.test(d.desc)) {
                        return false;
                    }
                }
            }

            return true;
        }),
        // Key function to compare values on insert/update/remove
        function (d) {
            return d.desc;
        });
*/
    chart.enter().append('g')
        .attr('class', 'arc')
        .on('click', function (d) {
            var url = schoen_url(d.manuscript_id);
            // Handle [cmd/ctrl]+click and middle click to open a new tab
            window.open(url, "_blank");
        })
        .on('mouseover', function (d) {
            /*d3.select('#contradictions-chart')
                .selectAll('.arc')
                .sort(function (a, b) {
                    return (a == d) ? 1 : -1;
                });
                renderContra();
                console.log(d);
                var lst = [];
                */
            for(var i=0; i<d.refs.length; i++) {
                var ref = d.refs[i];
                var exchange = exchanges[ref];
                var date = getAbsoluteChapter(exchange);
                if (date===0) {
                }
                else {
                    lst.push(date);
                }
            }
        });

        d3.select(this).selectAll('path')
            .style('stroke', function() { return '#111111'; });

        var disp_text = d.desc +
            '<br />Manuscript id: ' + d.manuscript_id;
        d3.select('#selected')
            .html(disp_text)
            .on('mouseout', function(d) {
                
                d3.select(this).selectAll('path')
                    .style('stroke', function() { return color(getAbsoluteChapter[d.date]); } )
            })
            .each(function (d, i) {
                console.log(i, d);
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

    chart.exit()
        .transition()
            .duration(350)
            .style('opacity', 0)
        .remove();

    // Update any highlighting from filters
    d3.select('#contradictions-chart')
        .selectAll('rect')
        .classed('selected', false);

    if (contraFilters.book !== null) {
        d3.select('#contradictions-chart')
            .selectAll('.b' + contraFilters.book.replace(/\s+/g, '').toLowerCase())
            .classed('selected', true);
    }
}

function issueBarChart(selector, data) {
    var element = d3.select('#' + selector);

    for (var i = 0; i < 4; i++) {
        var y = 100 / 4 * i;

        element.append('line')
            .attr('class', 'axis')
            .attr('x1', 0)
            .attr('x2', 1189)
            .attr('y1', y)
            .attr('y2', y);
    }

    element.selectAll('rect')
        .data(data)
        .enter().append('rect')
            .attr('class', function (d, i) {
                return i >= 39 ? 'nt ' + selector : selector;
            })
            .attr('x', function (d, i) {
                return bookToChapter[d.name];
            })
            .attr('y', function (d, i) {
                return 98 - (d.relativeCount * 98);
            })
            .attr('width', function (d, i) {
                return Math.max(1, bookToChapterCount[d.name] - 1);
            })
            .attr('height', function (d) {
                return d.relativeCount * 98 + 2;
            })
            .on('click', function (d, i) {
                var url = 'http://www.skepticsannotatedbible.com/' + d.url;

                window.open(url, "_blank");
            })
            .on('mouseover', function (d, i) {
                var testament = i >= 39 ? 'New Testament' : 'Old Testament';
                var lst = [];
                console.log('this is happening');
                for(var i=0; i<d.refs.length; i++) {
                    var ref = d.refs[i];
                    var exchange = exchanges[ref];
                    var date = getAbsoluteChapter(exchange);
                    lst.append(date);
                }
                d3.select('#selected')
                    .html(testament + ' - ' + d.name + ' - ' + d.verseCount + ' verses<br/><span class="subdued">' + lst.join(',') + '</span>');
            });

    element.selectAll('text')
        .data(data)
        .enter().append('text')
            .attr('x', function (d) {
                return bookToChapter[d.name] + 4;
            })
            .attr('y', function (d) {
                return 109 - (d.relativeCount * 98);
            })
            .style('stroke', 'none')
            .style('fill', 'white')
            .style('font-size', '8pt')
            .style('opacity', '0.4')
            .text(function (d) {
                if (bookToChapterCount[d.name] >= 30 && d.verseCount && (d.relativeCount * 98 + 2) > 16) {
                    return d.verseCount;
                }
            });
}

// Clip a value between min and max, inclusive
function clip(min, value, max) {
    return Math.max(min, Math.min(value, max));
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




var svg = d3.select('#contradictions-chart');

var chapters = [];
for (var i=0; i < 2014; i++) {
    chapters[i] = 0;
}

for (var i=0; i < manuscripts.length; i++) {
    manu = manuscripts[i];
    var exchs = manu.refs;
    for (var j=0; j<exchs.length; j++) {
        var exch = exchs[j];
        var date = getAbsoluteChapter(exch);
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
            renderContra();
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
            if (i%50==7) {
                return i + 1043;
            }
            else {
                return ""
            }
        });

if (window._contradictions !== undefined) {
    contra = _contradictions;

    renderContra();
} else {
    contra = manuscripts;
    renderContra();
}

var typeSelect = d3.select('#type-select');

typeSelect.selectAll('option').data(Object.keys(contraTypeFilters)).enter().append('option')
    .text(function (d) {return d; });

typeSelect.on('change', function () {
    contraFilters.type = this.value;

    renderContra();
});

d3.select('#color-select')
    .on('change', function () {
        // Set the filter
        contraFilters.colorize = this.value;

        // Clear all current arcs so they get recreated
        d3.select('#contradictions-chart').selectAll('.arc').remove();

        renderContra();
    });
