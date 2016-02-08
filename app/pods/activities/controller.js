import Ember from 'ember';

export default Ember.Controller.extend({
    total: null,
    totalWeek: null,
    chartOptions: {
        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,
        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth : 1,
    }
});
