//to make JSHint happy
/*global moment:false*/
/*global Hashids:false*/
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

moment.locale('id');
var hashids = new Hashids("m4c3tsur4b4y4");

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	breadCrumb: {
		title: 'Surabaya Traffic'
	},
	model: function (params) {
		var query = {};
		if (Ember.isPresent(params.page)) {
			query.page = params.page;
		}
		if (Ember.isPresent(params.limit)) {
			query.limit = params.limit;
		}
		if (Ember.isPresent(params.query)) {
			query.query = params.query;
		}

		return Ember.RSVP.hash({
			place: this.store.query('place', query),
			marker: this.store.findAll('marker'),
			category: this.store.findAll('category'),
			weather: this.store.findAll('weather'),
			respondent: this.store.findAll('respondent')
		});
	},
	setupController: function (controller, model) {
		controller.set('total', model.place.get('meta.total'));
		controller.set('place', model.place);
		var places = [];
		controller.set('places', places);
		controller.set('marker', model.marker);
		var markers = [];
		controller.set('markers', markers);
		controller.set('category', model.category);
		var categories = [];
		controller.set('categories', categories);
		controller.set('weather', model.weather);
		var weathers = [];
		controller.set('weathers', weathers);
		controller.set('respondent', model.respondent);
		var respondents = [];
		controller.set('respondents', respondents);

		// ---------------------------------------------------------
		// ------------- create markers to display on maps ---------
		// ---------------------------------------------------------
		var markersForDisplay = [];
		model.place.forEach(function (item) {
			var result = {
				id: hashids.encode(item.get('id')),
				lat: item.get('lat'),
				lng: item.get('lng'),
				infoWindow: {
					content: "<p><strong>" + item.get('name') + "</strong></p>",
					visible: false
				}
			};
			markersForDisplay.push(result);
		});
		controller.set('markersForDisplay', markersForDisplay);
	},
	queryParams: {
		page: {
			refreshModel: true
		},
		limit: {
			refreshModel: true
		},
		query: {
			refreshModel: true
		}
	}
});
