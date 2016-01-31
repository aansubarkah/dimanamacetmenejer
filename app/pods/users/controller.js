import Ember from 'ember';
var Group = Ember.Object.extend({id: '', name: ''});

export default Ember.Controller.extend({
	queryParams: ['page', 'limit', 'query'],
	page: 1,
	limit: 10,
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
	isAddRowVisible: false,
	triggerSuggestions: 1,
	isShowingModal: false,
	actions: {
		toggleAdd: function () {
			//this.toggleProperty('isAddRowVisible');
			this.toggleProperty('isShowingModal');
		},
		createNew: function (dataToSave) {
			const store = this.get('store');
			var that = this;

			var user = store.createRecord('user', dataToSave);

			// @todo clear text field
			this.set('isShowingModal', false);

			user.save().then(function () {
				// @warn refresh template
				that.transitionToRoute('users');
				//that.get('target.router').refresh();
			});
		},
		deleteDatum: function (user) {
			var that = this;
			user.destroyRecord().then(function () {
				that.transitionToRoute('users');
				// refresh template
				// that.get('target.router').refresh();
			});
		},
		editDatum: function (user) {
			user.save();
			// refresh template
			//this.get('target.router').refresh();
			this.transitionToRoute('users');
		},
		itemSelectedGroup: function (item) {
			this.set('group', item);
		},
		refreshOptionsGroup: function (inputVal) {
			var groupList = [];
			var self = this;
			var triggerSuggestions = this.get('triggerSuggestions');
			var groups = this.store.query('group', {searchName: inputVal, limit: 3}).then(function (groups) {
				groups.forEach(function (item) {
					var full = item.get('name');
					groupList.pushObject(Group.create({
						id: item.get('id'),
						name: full
					}));
				});
				self.set('groups', groupList);
				triggerSuggestions = triggerSuggestions + 1;
				self.set('triggerSuggestions', triggerSuggestions);
			});
		}
	}
});
