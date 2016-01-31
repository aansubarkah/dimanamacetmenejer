import Ember from 'ember';

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
	newName: '',
	newContact: '',
	actions: {
		toggleAdd: function () {
			this.toggleProperty('isAddRowVisible');
		},
		createNew: function () {
			const store = this.get('store');
			var that = this;

			// get name inputed, if blank return to input
			var name = this.get('newName');
			var contact = this.get('newContact');
			if (name && !name.trim()) {
				this.set('newName', '');
				return;
			}
			if (contact && !contact.trim()) {
				this.set('newContact', '');
				return;
			}

			// create the new Weather model
			var respondent = store.createRecord('respondent', {
				name: name,
				contact: contact
			});

			// clear the "New Weather" text field
			this.set('newName', '');
			this.set('newContact', '');
			this.set('isAddRowVisible', false);

			respondent.save().then(function () {
				// refresh template
				that.get('target.router').refresh();
				//that.transitionToRoute('respondents');
			});
		},
		deleteDatum: function (respondent) {
			var that = this;
			respondent.destroyRecord().then(function () {
				that.transitionToRoute('respondents');
			});
		},
		editDatum: function (respondent) {
			respondent.save();
			// refresh template
			this.transitionToRoute('respondents');
		}
	}
});
