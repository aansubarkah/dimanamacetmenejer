// to make JSHint happy
/* global moment:false */
/* global Hashids: false */
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
moment.locale('id');

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model: function() {
        var query = {};
        return Ember.RSVP.hash({
            //activity: this.store.findAll('activity')
            activity: this.store.query('activity', query)
        });
    },
    setupController: function(controller, model) {
        controller.set('activity', model.activity);
        controller.set('total', model.activity.get('meta.total'));
        controller.set('totalWeek', model.activity.get('meta.totalWeek'));

        // data to display as chart
        var headers = [];
        var datum = [];
        model.activity.forEach(function(item) {
            //headers.push(item.get('name'));
            headers.push(moment(item.get('name')).format('dddd, Do MMMM YYYY'));
            datum.push(item.get('value'));
        });
        var dataForChart = {
            labels: headers,
            datasets: [{
                label: "Daily Report",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: datum
            }]
        };
        controller.set('dataForChart', dataForChart);
    }
});
