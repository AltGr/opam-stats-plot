var kdate = function (x) {
  return ~~(x / 10000) + "-" + ~~((x / 100) % 100) + "-" + ~~(x % 100);
}

data = [data0, data1, data2];

visits = data.map(function(d) {return d.visitors.data});

visits.forEach(function(a) {a.reverse()});

function updates(title, visits) {
  return {
    name: title,
    x: visits.map(e => kdate (e.data)),
    y: visits.map(e => e.visitors.count),
    type: 'scatter'
  };
}

var updates0 = updates("opam 1.1", visits[0]);
var updates1 = updates("opam 1.2", visits[1]);
var updates2 = updates("opam 2", visits[2]);

var total = new Array();
visits.forEach(d => d.forEach(e => total[e.data] = e.visitors.count + (total[e.data] || 0)));
var all_dates = Array.from(Object.keys(total));
var all_totals = all_dates.map(d => total[d]);
var week_total = new Array();
all_totals.forEach((x,i) => week_total[i] = x/7 + (week_total[i-1] || 0) - (all_totals[i-7] || 0) / 7);

var total_week_avg = {
  name: "total/week",
  x: all_dates.map(kdate),
  y: week_total,
  type: 'scatter',
  fill: 'tozeroy',
  mode: 'none',
  fillcolor: 'rgb (210, 210, 210)'
}

var layout = {
  yaxis: {
    range: [0, 1000],
    title: "updates"
  },
  xaxis: {
    title: "date"
  },
  margin: {                           // update the left, bottom, right, top margin
    l: 40, b: 80, r: 10, t: 20
  },
  height: 800
};
Plotly.newPlot('plot', [total_week_avg, updates0, updates1, updates2], layout);
