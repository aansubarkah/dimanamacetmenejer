//to make JSHint happy
/*global Hashids:false*/
import Ember from 'ember';
var hashids = new Hashids("m4c3tsur4b4y4");
var Place = Ember.Object.extend({id: '', name: ''});
var Category = Ember.Object.extend({id: '', name: ''});
var Weather = Ember.Object.extend({id: '', name: ''});
var Respondent = Ember.Object.extend({id: '', name: ''});

export default Ember.Controller.extend({
	queryParams: ['page', 'limit', 'query', 'lastminutes'],
	page: 1,
	limit: 5,
	query: '',
	lastminutes: 30,
	total: null,
    postByUser: null,
    postToday: null,
	totalPages: function () {
		return Math.ceil(this.get('total') / this.limit);
	}.property('total'),
	firstRowNumber: function () {
		return (((this.page - 1) * this.limit) + 1);
	}.property('page', 'limit'),
	lastRowNumber: function () {
		var number = 0;
		if ((this.limit * this.page) > this.total) {
			number = this.total;
		} else {
			number = this.limit * this.page;
		}

		return number;
	}.property('page', 'total', 'limit'),
	geolocation: Ember.inject.service(),
	userLocation: null,
	lat: -7.290293,
	lng: 112.727226,
	newLat: 0,
	newLng: 0,
	newPlaceLat: 0,
	newPlaceLng: 0,
	newPlaceName: '',
	zoom: 16,
	isAddRowVisible: false,
	isShowingModal: false,
	triggerSuggestions: 1,
	times: [
		{label: '30 minutes', value: 30},
		{label: '1 hour', value: 60},
		{label: '6 hours', value: 360},
		{label: '12 hours', value: 720},
		{label: '1 day', value: 1440},
		{label: '1 week', value: 10080}
	],
	init: function () {
		var that = this;
		this.get('geolocation').getLocation().then(function () {
			var currentLocation = that.get('geolocation').get('currentLocation');
			that.set('userLocation', currentLocation);

			// if user share her location, relocate lat and lng, otherwise it will use defaul
			// value which is suarasurabaya office
			that.set('lat', currentLocation[0]);
			that.set('lng', currentLocation[1]);
		});
	},
	actions: {
		toggleAdd: function () {
			this.toggleProperty('isAddRowVisible');
		},
		// when map is clicked, add marker
		clickAction: function (e) {
			var that = this;
			that.markersForDisplay.addObject({
				id: hashids.encode(new Date().getTime()),
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
				title: 'New Marker',
				draggable: true,
				infoWindow: {
					content: 'Click or move the marker to display new marker form.',
					visible: true
				},
				click: function () {
					that.toggleProperty('isShowingModal');
					that.set('newLat', e.latLng.lat());
					that.set('newLng', e.latLng.lng());
				},
				dragend: function (f) {
					that.toggleProperty('isShowingModal');
					that.set('newLat', f.latLng.lat());
					that.set('newLng', f.latLng.lng());
				}
			});
		},
		toggleCreateNewMarker: function (place) {
			//console.log(place);
			this.toggleProperty('isShowingModal');
			this.set('newLat', place.get('lat'));
			this.set('newLng', place.get('lng'));
		},
		// create new marker
		createNew: function (dataToSave) {
			const store = this.get('store');
			var that = this;

			var marker = store.createRecord('marker', dataToSave);

			// @todo clear text field
			this.set('isShowingModal', false);

			marker.save().then(function () {
				// @warn refresh template
				that.get('target.router').refresh();
				//that.transitionToRoute('traffic');
			});
		},
		deleteDatum: function (place) {
			var that = this;
			place.destroyRecord().then(function () {
				// refresh template
				that.transitionToRoute('places');
			});
		},
		editDatum: function (place) {
			place.save();
			// refresh template
			this.transitionToRoute('places');
		},
		itemSelected: function (item) {
			//console.log(item.get('id'));
			this.set('model', item);
		},
		refreshOptions: function (inputVal) {
			var placeList = [];
			var self = this;
			var triggerSuggestions = this.get('triggerSuggestions');
			var places = this.store.query('place', {searchName: inputVal, limit: 5}).then(function (places) {
				places.forEach(function (item) {
					var full = item.get('name');
					placeList.pushObject(Place.create({
						id: item.get('id'),
						name: full
					}));
				});
				self.set('places', placeList);
				triggerSuggestions = triggerSuggestions + 1;
				self.set('triggerSuggestions', triggerSuggestions);
			});
		},
		refreshPlace(lat, lng){
			this.set('lat', lat);
			this.set('lng', lng);
		}
	}
});
