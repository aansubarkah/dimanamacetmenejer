// to make JSHint happy
/*global Hashids:false*/

import Ember from 'ember';
var hashids = new Hashids("m4c3tsur4b4y4");

export default Ember.Controller.extend({
    queryParams: ['page', 'limit', 'lastminutes', 'query', 'respondentID'],
    page: 1,
    limit: 20,
    lastminutes: 60,
    query: '',
    respondentID: null,//elshinta
    total: null,
    totalPages: function() {
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
    isPlaceNameExist: false,
    newSource: null,
    respondentNameCache: '',
    respondentsOptionsSelected: 'Respondents',
    zoom: 16,
    pictureURL: '',
    isAddRowVisible: false,
    isShowingModal: false,
    isShowingMap: false,
    isShowingModalPicture: false,
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
        togglePicture: function(source) {
            this.toggleProperty('isShowingModalPicture');
            this.set('pictureURL', source);
        },
        // when map is clicked, add marker
        clickAction: function (e) {
            var that = this;
            that.placesForDisplay.addObject({
                id: hashids.encode(new Date().getTime()),
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                title: 'New Places',
                draggable: true,
                infoWindow: {
                    content: 'Click or move the marker to display new place (and marker) form.',
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
            this.toggleProperty('isShowingModal');
            this.set('isPlaceNameExist', false);
            this.set('newLat', place.get('lat'));
            this.set('newLng', place.get('lng'));
        },
        toggleCreateNewMarkerWithPlace: function(place, placeName) {
            this.toggleProperty('isShowingModal');
            this.set('newLat', place.get('lat'));
            this.set('newLng', place.get('lng'));
            this.set('isPlaceNameExist', true);
            this.set('newPlaceName', placeName);
        },
        // create new marker
        createNew: function (dataToSave) {
            const store = this.get('store');
            var that = this;
            var sourceID = dataToSave.sourceID;

            var marker = store.createRecord('marker', dataToSave);

            this.set('isShowingModal', false);

            marker.save().then(function () {
                var sourceToRemove = store.peekRecord('source', sourceID);
                sourceToRemove.unloadRecord();
                // @warn refresh template
                //that.get('target.router').refresh();
                //that.transitionToRoute('traffic');
                that.set('isShowingMap', false);
            });
        },
        deleteDatum: function (source) {
            var that = this;
            source.destroyRecord().then(function () {
                // refresh template
                that.transitionToRoute('sources');
            });
        },
        editDatum: function (place) {
            place.save();
            // refresh template
            this.transitionToRoute('soures');
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
        },
        addSourceToCache: function(source) {
            this.toggleProperty('isShowingMap');
            this.set('newSource', source);
            this.set('respondentNameCache', source.get('twitUserScreenName'));
        }
    }
});
