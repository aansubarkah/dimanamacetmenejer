//to make JSHint happy
/*global moment:false*/
/*global Hashids:false*/
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

moment.locale('id');
var hashids = new Hashids("m4c3tsur4b4y4");

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    //beforeModel: function(){},
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
		if (Ember.isPresent(params.lastminutes)) {
			query.lastminutes = params.lastminutes;
		}

		return Ember.RSVP.hash({
			markerview: this.store.query('markerview', query),
			place: this.store.findAll('place'),
			marker: this.store.findAll('marker'),
			category: this.store.findAll('category'),
			weather: this.store.findAll('weather'),
			respondent: this.store.findAll('respondent')
		});
	},
	setupController: function (controller, model) {
		controller.set('total', model.markerview.get('meta.total'));
		controller.set('markerview', model.markerview);
		var markerviews = [];
		controller.set('markerviews', markerviews);
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
		model.markerview.forEach(function (item) {
			var isPinned = "Tidak";
			var isCleared = "Belum";

			if (item.get('pinned')) {
				isPinned = "Ya";
			}

			if (item.get('cleared')) {
				isCleared = "Ya";
			}

			var result = {
				id: hashids.encode(item.get('id')),
				lat: item.get('lat'),
				lng: item.get('lng'),
				title: item.get('category_name'),
				icon: 'images/dark/' + item.get('category_id') + '.png',
				infoWindow: {
					content: "<p><strong>Waktu:&nbsp;</strong>" + moment(item.get('created')).fromNow() + "</p>" +
					"<p>(" + moment(item.get('created')).format('dddd, Do MMMM YYYY, h:mm:ss A') + ")</p>" +
					"<p><strong>Keterangan:&nbsp;</strong>" +
					item.get('info') + "</p><p><strong>Cuaca:&nbsp</strong>" + item.get('weather_name') + "</p>" +
					"<p><strong>Permanen:&nbsp;</strong>" + isPinned + "</p><p><strong>Selesai:&nbsp;</strong>" +
					isCleared + "</p>",
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
		},
		lastminutes: {
			refreshModel: true
		}
	}
});
