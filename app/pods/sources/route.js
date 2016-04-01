//to make JSHint happy
/*global moment:false*/
/*global Hashids:false*/
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import InfinityRoute from 'ember-infinity/mixins/route';

moment.locale('id');
var hashids = new Hashids("m4c3tsur4b4y4");

export const pollInterval = 60000;
export default Ember.Route.extend(AuthenticatedRouteMixin, InfinityRoute, {
    _minId: undefined,
    _maxId: undefined,
    _firstLoad: true,
    _canLoadMore: true,
    model: function(params) {
        var query = {};
        var queryForRespondent = {};
        var respondentID = null;

        /*if (Ember.isPresent(params.page)) {
            query.page = params.page;
        }
        if (Ember.isPresent(params.limit)) {
            query.limit = params.limit;
        }
        if (Ember.isPresent(params.lastminutes)) {
            query.lastminutes = params.lastminutes;
        }*/
        if (Ember.isPresent(params.respondentID)) {
            query.respondentID = params.respondentID;
            respondentID = params.respondentID;
        }
        /*if (Ember.isPresent(params.query)) {
            query.query = params.query;
        }*/

        return Ember.RSVP.hash({
            //respondents: this.store.query('respondent', {displayAllOfficial: null}),
            respondentSelected: this.store.peekRecord('respondent', respondentID),
            weathers: this.store.findAll('weather'),
            categories: this.store.findAll('category'),
            markers: this.store.findAll('marker'),
            //places: this.store.findAll('place'),
            respondents: this.store.query('respondent', {showAll: true}),
            places: this.store.query('place', {showAll: true}),
            //sources: this.store.query('source', query),
            sources: this.infinityModel('source', {
                //min_id: '_minId',
                perPage: 5,
                startingPage: 1,
                respondentID: respondentID,
                older: true,
                modelPath: 'controller.sources'
            }, {
                min_id: '_minId'
            }),
            activity: this.store.query('activity', {today: true})
        });
    },
    setupController: function(controller, model) {
        controller.set('total', model.sources.get('meta.total'));
        controller.set('maxId', model.sources.get('meta.maxId'));
        controller.set('minId', model.sources.get('meta.minId'));
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

        var respondentsOptions = [];
        var resNull = {
            label: 'All Respondent',
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

        var times = [
            {label: '30 minutes', value: 30},
            {label: '1 hour', value: 60},
            {label: '6 hours', value: 360},
            {label: '12 hours', value: 720},
            {label: '1 day', value: 1440},
            {label: '1 week', value: 10080}
        ];
        controller.set('times', times);

        var placesOptions = [];
        model.places.forEach(function (item) {
            var result = {
                label: item.get('name'),
                value: item.get('id')
            };
            placesOptions.push(result);
        });
        controller.set('placesOptions', placesOptions);
        //this.updateSource(model.sources);
    },
    queryParams: {
        /*page: {
            refreshModel: true
        },
        limit: {
            refreshModel: true
        },
        lastminutes: {
            refreshModel: true
        },
        query: {
            refreshModel: true
        },*/
        respondentID: {
            refreshModel: true
        }
    },
    actions: {
        didTransition: function() {
            this.controller.set('isShowingMap', false);
            //console.log(this.get('_maxId'));
        },
        willTransition: function(transition) {
            this.set('_minId', undefined);
            this.set('_maxId', undefined);
            this.set('_firstLoad', true);
            this._super(transition);
            this.get('poll').removePoll('sources');
        }
    },
    afterInfinityModel(sources) {
        let loadedAny = sources.get('length') > 0;
        this.set('_canLoadMore', loadedAny);
        //this.set('_minId', sources.get('lastObject.id'));
        this.set('_minId', sources.get('meta.minId'));

        if(this.get('_firstLoad')) {
            //this.set('_maxId', sources.get('firstObject.id'));
            this.set('_maxId', sources.get('meta.maxId'));
            this.set('_firstLoad', false);
        }
    },
    newSource: function() {
        let query = {
            newer: true,
            max_id: this.get('_maxId')
        };

        return Ember.RSVP.hash({
            sources: this.store.query('source', query)
        });
    },
    onPoll: function() {
        this.newSource().then((datum) =>  {
            //let latestId = datum.sources.get('firstObject.id');
            let latestId = datum.sources.get('meta.maxId');
            if(latestId > 0) {
                this.set('_maxId', latestId);
                let oldSources = this.controller.get('sources');
                datum.sources.forEach(function(item){
                    oldSources.addObject(item);
                });
                this.controller.set('sources', oldSources);
            }
        });
    },
    afterModel: function() {
        let sourcesPoller = this.get('sourcesPoller');
        if (!sourcesPoller) {
            sourcesPoller = this.get('pollboy').add(this, this.onPoll, pollInterval);
            this.set('sourcesPoller', sourcesPoller);
        }
    },
    deactivate: function() {
        const sourcesPoller = this.get('sourcesPoller');
        this.get('pollboy').remove(sourcesPoller);
    },
    updateSource: function(model) {
        let that = this;
        let interval = 60000 * 0.5;// 1 minutes * 5
        let query = {
            newer: true,
            max_id: that.get('_maxId')
        };
        let sources = that.controller.get('sources');
        Ember.run.later(function() {
            that.store.query('source', query).then(function(datum) {
                datum.forEach(function(item) {
                    console.log(item);
                });

                console.log(sources);
                console.log(datum);
            });
            that.updateSource();
        }, interval);
    }
});
