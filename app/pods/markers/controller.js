//to make JSHint happy
/*global moment:false*/
/*global Hashids:false*/
import Ember from 'ember';
var hashids = new Hashids("m4c3tsur4b4y4");
var Category = Ember.Object.extend({id: '', name: ''});
var Weather = Ember.Object.extend({id: '', name: ''});
var Respondent = Ember.Object.extend({id: '', name: ''});

export default Ember.Controller.extend({
	//queryParams: ['page', 'limit', 'query', 'lastminutes'],
	geolocation: Ember.inject.service(),
	userLocation: null,
	//markersForDisplay: [],
	init: function () {
		var that = this;
		this.get('geolocation').getLocation().then(function () {
			var currentLocation = that.get('geolocation').get('currentLocation');
			that.set('userLocation', currentLocation);

			// if user share her location, relocate lat and lng, otherwise it will use defaul
			// value which is suarasurabaya office
			that.set('lat', currentLocation[0]);
			that.set('lng', currentLocation[1]);
			//console.log(currentLocation);
			//that.set('lat', -7.347932);
			//that.set('lng', 112.728073);
		});
	},
	queryParams: ['lastminutes'],
	//lastminutes: 10080,
	lat: -7.290293,
	lng: 112.727226,
	newLat: 0,
	newLng: 0,
	zoom: 16,
	isShowingModal: false,
	triggerSuggestions: 1,
	actions: {
		clickAction: function (e) {
			//console.log(e);

			//console.log(e.latLng);
			var that = this;
			/*that.routesForDisplay.addObject({
			 id: hashids.encode(new Date().getTime()),
			 origin: [-7.291820, 112.722176],
			 destination: [-7.372673, 112.729149],
			 travelMode: 'driving',
			 strokeColor: '#3333FF',
			 strokeOpacity: 0.6,
			 strokeWeight: 6,
			 region: 'id'
			 });*///don't remove above line, for educational purpose
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
		createNew(dataToSave){
			const store = this.get('store');
			var that = this;

			var marker = store.createRecord('marker', dataToSave);

			// @todo clear text field
			this.set('isShowingModal', false);

			marker.save().then(function () {
				// @warn refresh template
				that.get('target.router').refresh();
				//that.transitionToRoute('markers');
			});
		},
		refreshPlace(lat, lng){
			this.set('lat', lat);
			this.set('lng', lng);
			//console.info('lat:'+lat+' lng:'+lng);
		}
	}
});
/*
 *
 Jalan Wonokitri Besar No.40-C
 Kecamatan Sawahan, Kota Surabaya, Jawa Timur 60256
 -7.290293, 112.727226
 API:AIzaSyA7dciHJOSiR8annWOSISIdKFF6T3cuyMQ
 */
