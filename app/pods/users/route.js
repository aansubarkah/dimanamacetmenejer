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

		//return this.store.query('user', query);
		return Ember.RSVP.hash({
			user: this.store.query('user', query),
			//group: this.store.query('group', query)
			group: this.store.findAll('group')
		});
	},
	setupController: function (controller, model) {
		//this._super.apply(this, arguments);
		//controller.set('total', model.get('meta.total'));
		controller.set('user', model.user);
		var users = [];
		controller.set('users', users);
		controller.set('total', model.user.get('meta.total'));
		controller.set('group', model.group);
		var groups = [];
		controller.set('groups', groups);
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
	actions: {},
	afterModel: function () {
		var _this = this;
		return this.store.findAll('group').then(function (result) {
			_this.set('group', result);
		});
	}
});
