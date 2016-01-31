import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
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

		return this.store.query('weather', query);
	}, /*,
	 actions: {
	 reload: function () {
	 this.store.unloadAll('weather');
	 this.refresh();
	 }
	 }*/
	setupController: function (controller, model) {
		this._super.apply(this, arguments);
		controller.set('total', model.get('meta.total'));
		//controller.set('model',model);
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
	},
	actions: {
		/*modelChanged: function () {
		 //this.refresh();
		 this.controller.get('model').reload();
		 },
		 deleteDatum: function (weather) {
		 var that = this;
		 weather.destroyRecord().then(function () {
		 that.transitionTo('weathers');
		 });
		 }*/
	}
});
