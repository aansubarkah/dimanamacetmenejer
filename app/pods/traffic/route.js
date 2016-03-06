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
        if (Ember.isPresent(params.respondentID)) {
			query.lastminutes = params.respondentID;
		}


		return Ember.RSVP.hash({
			markerview: this.store.query('markerview', query),
			place: this.store.query('place', {showAll: true}),
			marker: this.store.findAll('marker'),
			category: this.store.findAll('category'),
			weather: this.store.findAll('weather'),
			respondent: this.store.findAll('respondent'),
            activity: this.store.query('activity', {})
		});
	},
	setupController: function (controller, model) {
		controller.set('total', model.markerview.get('meta.total'));
        controller.set('postByUser', model.activity.get('meta.total'));
        controller.set('postToday', model.activity.get('meta.totalToday'));
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
		controller.set('weather', model.weather);
		controller.set('respondent', model.respondent);

		var markersForDisplay = [];
        // ---------------------------------------------------------
        // ------------- create markers to display on maps ---------
        // ---------------------------------------------------------
        model.place.forEach(function (item) {
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
                    var controller = DimanamacetMiminFrontend.__container__.lookup("controller:traffic");
                    var boundSend = controller.send.bind(controller);
                    boundSend('toggleCreateNewMarkerWithPlace', marker, placeName);
                }
            };
            markersForDisplay.push(result);
        });

        // ---------------------------------------------------------
		// ------------- create markers to display on maps ---------
		// ---------------------------------------------------------
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

        var placesOptions = [];
        model.place.forEach(function (item) {
            var result = {
                label: item.get('name'),
                value: item.get('id')
            };
            placesOptions.push(result);
        });
        controller.set('placesOptions', placesOptions);
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
		},
		respondentID: {
			refreshModel: true
		}

	}
});
