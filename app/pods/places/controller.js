//to make JSHint happy
/*global Hashids:false*/
import Ember from 'ember';
var hashids = new Hashids("m4c3tsur4b4y4");
var Place = Ember.Object.extend({id: '', name: ''});
var Category = Ember.Object.extend({id: '', name: ''});
var Weather = Ember.Object.extend({id: '', name: ''});
var Respondent = Ember.Object.extend({id: '', name: ''});

export default Ember.Controller.extend({
	queryParams: ['page', 'limit', 'query'],
	page: 1,
	limit: 5,
	query: '',
	total: null,
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
    newSearch: '',
	zoom: 16,
	isAddRowVisible: false,
	isShowingModal: false,
	triggerSuggestions: 1,
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
				title: 'New Place',
				draggable: true,
				infoWindow: {
					content: 'Click or move the marker to display new place form.',
					visible: true
				},
				click: function () {
					that.toggleProperty('isAddRowVisible');
					that.set('newPlaceLat', e.latLng.lat());
					that.set('newPlaceLng', e.latLng.lng());
				},
				dragend: function (f) {
					that.toggleProperty('isAddRowVisible');
					that.set('newPlaceLat', f.latLng.lat());
					that.set('newPlaceLng', f.latLng.lng());
				}
			});
		},
		itemSelectedCategory: function (item) {
			console.log(item.get('id'));
			this.set('category', item);
		},
		refreshOptionsCategory: function (inputVal) {
			var categoryList = [];
			var self = this;
			var triggerSuggestions = this.get('triggerSuggestions');
			var categories = this.store.query('category', {searchName: inputVal, limit: 3}).then(function (categories) {
				categories.forEach(function (item) {
					var full = item.get('name');
					categoryList.pushObject(Category.create({
						id: item.get('id'),
						name: full
					}));
				});
				self.set('categories', categoryList);
				triggerSuggestions = triggerSuggestions + 1;
				self.set('triggerSuggestions', triggerSuggestions);
			});
		},
		itemSelectedWeather: function (item) {
			this.set('weather', item);
		},
		refreshOptionsWeather: function (inputVal) {
			var weatherList = [];
			var self = this;
			var triggerSuggestions = this.get('triggerSuggestions');
			var weathers = this.store.query('weather', {searchName: inputVal, limit: 3}).then(function (weathers) {
				weathers.forEach(function (item) {
					var full = item.get('name');
					weatherList.pushObject(Weather.create({
						id: item.get('id'),
						name: full
					}));
				});
				self.set('weathers', weatherList);
				triggerSuggestions = triggerSuggestions + 1;
				self.set('triggerSuggestions', triggerSuggestions);
			});
		},
		itemSelectedRespondent: function (item) {
			//console.log(item.get('id'));
			this.set('respondent', item);
		},
		refreshOptionsRespondent: function (inputVal) {
			var respondentList = [];
			var self = this;
			var triggerSuggestions = this.get('triggerSuggestions');
			var respondents = this.store.query('respondent', {
				searchName: inputVal,
				limit: 3
			}).then(function (respondents) {
				respondents.forEach(function (item) {
					//var full = item.get('name');
					respondentList.pushObject(Respondent.create({
						id: item.get('id'),
						name: item.get('name'),
						contact: item.get('contact')
					}));
				});
				self.set('respondents', respondentList);
				triggerSuggestions = triggerSuggestions + 1;
				self.set('triggerSuggestions', triggerSuggestions);
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
				//that.get('target.router').refresh();
				that.transitionToRoute('markers');
			});
		},
		createNewPlace: function () {
			const store = this.get('store');
			var that = this;

			// get name inputed, if blank return to input
			var name = this.get('newPlaceName');
			if (name && !name.trim()) {
				this.set('newPlaceName', '');
				return;
			}

			// create the new Weather model
			var place = store.createRecord('place', {
				name: name,
				lat: this.get('newPlaceLat'),
				lng: this.get('newPlaceLng')
			});

			// clear the "New Weather" text field
			this.set('newPlaceName', '');
			this.set('isAddRowVisible', false);

			place.save().then(function () {
				// refresh template
				that.transitionToRoute('places');
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
		refreshPlace(lat, lng){
			//console.info('lat:' + lat + ' lng:' + lng);
			this.set('lat', lat);
			this.set('lng', lng);
		},
		itemSelected: function (item) {
			console.log(item.get('id'));
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
        searchPlace: function() {
            this.set('query', this.get('newSearch'));
            this.set('page', 1);
        }
	}
});
