//to make JSHint happy
/*global moment:false*/
/*global Hashids:false*/
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

moment.locale('id');
var hashids = new Hashids("m4c3tsur4b4y4");

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model: function(params) {
        var query = {};
        var queryForRespondent = {};
        var respondentID = null;

        if (Ember.isPresent(params.page)) {
			query.page = params.page;
		}
		if (Ember.isPresent(params.limit)) {
			query.limit = params.limit;
		}
		if (Ember.isPresent(params.respondentID)) {
			query.respondentID = params.respondentID;
            respondentID = params.respondentID;
		}
        if (Ember.isPresent(params.query)) {
            query.query = params.query;
        }

        return Ember.RSVP.hash({
            respondents: this.store.query('respondent', {displayAllOfficial: null}),
            respondentSelected: this.store.peekRecord('respondent', respondentID),
            weathers: this.store.findAll('weather'),
            categories: this.store.findAll('category'),
            markers: this.store.findAll('marker'),
            //places: this.store.findAll('place'),
            places: this.store.query('place', { limit: 10000}),
            sources: this.store.query('source', query),
            activity: this.store.query('activity', {})
        });
    },
    setupController: function(controller, model) {
        controller.set('total', model.sources.get('meta.total'));
        controller.set('sources', model.sources);
        controller.set('markers', model.markers);
        controller.set('places', model.places);
        controller.set('categories', model.categories);
        controller.set('weathers', model.weathers);
        controller.set('postByUser', model.activity.get('meta.total'));
        controller.set('postToday', model.activity.get('meta.totalToday'));

        if (model.respondentSelected !== null) {
            controller.set('respondentsOptionsSelected', model.respondentSelected.get('name'));
        }

        //controller.set('respondentsOptionsSelected', model.sources.get('twitUserScreenName'));
        var respondentsOptions = [];
        var resNull = {
            label: 'Respondent',
            value: null
        };
        respondentsOptions.push(resNull);

        model.respondents.forEach(function (item) {
            var result = {
                label: item.get('name'),
                value: item.get('id')
            };
            respondentsOptions.push(result);
        });
        controller.set('respondentsOptions', respondentsOptions);

        // ---------------------------------------------------------
		// ------------- create markers to display on maps ---------
		// ---------------------------------------------------------
		var placesForDisplay = [];
		model.places.forEach(function (item) {
            var that = this;
			var result = {
				id: hashids.encode(item.get('id')),
				lat: item.get('lat'),
				lng: item.get('lng'),
				infoWindow: {
					content: "<p><strong>" + item.get('name') + "</strong></p>",
					visible: false
				},
                dblclick: function(event, marker, placeName = item.get('name')) {
                    var controller = DimanamacetMiminFrontend.__container__.lookup("controller:sources");
                    var boundSend = controller.send.bind(controller);
                    boundSend('toggleCreateNewMarkerWithPlace', marker, placeName);
                }
			};
			placesForDisplay.push(result);
		});
		controller.set('placesForDisplay', placesForDisplay);
    },
	queryParams: {
		page: {
			refreshModel: true
		},
		limit: {
			refreshModel: true
		},
		respondentID: {
			refreshModel: true
		},
        query: {
            refreshModel: true
        }
	},
    actions: {
        didTransition: function() {
            this.controller.set('isShowingMap', false);
        }
    }
});
