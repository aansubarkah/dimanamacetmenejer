//to make JSHint happy
/*global Hashids:false*/
import Ember from 'ember';
var hashids = new Hashids("m4c3tsur4b4y4");
var Category = Ember.Object.extend({id: '', name: ''});
var Weather = Ember.Object.extend({id: '', name: ''});
var Respondent = Ember.Object.extend({id: '', name: ''});

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    geolocation: Ember.inject.service(),
    userLocation: null,
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
    queryParams: ['lastminutes'],
    lastminutes: 30,
    times: [
        {label: '30 minutes', value: 30},
        {label: '1 hour', value: 60},
        {label: '6 hours', value: 360},
        {label: '12 hours', value: 720},
        {label: '1 day', value: 1440},
        {label: '1 week', value: 10080}
    ],
    lat: -7.290293,
    lng: 112.727226,
    newLat: 0,
    newLng: 0,
    zoom: 16,
    isShowingModal: false,
    triggerSuggestions: 1,
    actions: {
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
        createNew(dataToSave){
            const store = this.get('store');
            var that = this;

            console.log(dataToSave);
            var marker = store.createRecord('marker', dataToSave);

            // @todo clear text field
            this.set('isShowingModal', false);

            marker.save().then(function () {
                // @warn refresh template
                that.get('target.router').refresh();
            });
        },
        refreshPlace(lat, lng){
            this.set('lat', lat);
            this.set('lng', lng);
        }
    }
});
