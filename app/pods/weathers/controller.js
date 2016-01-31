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
	actions: {
		toggleAdd: function () {
			this.toggleProperty('isAddRowVisible');
		},
		createNew: function () {
			const store = this.get('store');
			var that = this;

			// get name inputed, if blank return to input
			var name = this.get('newName');
			if (name && !name.trim()) {
				this.set('newName', '');
				return;
			}

			// create the new Weather model
			var weather = store.createRecord('weather', {
				name: name
			});

			// clear the "New Weather" text field
			this.set('newName', '');
			this.set('isAddRowVisible', false);

			weather.save().then(function () {
				// refresh template
				that.get('target.router').refresh();
			});

			// refresh page
			//this.transitionToRoute('weathers');

		},
		deleteDatum: function (weather) {
			var that = this;
			weather.destroyRecord().then(function () {
				that.transitionToRoute('weathers');
				// refresh template
				//that.get('target.router').refresh();
			});
		},
		editDatum: function (weather) {
			weather.save();
			// refresh template
			this.get('target.router').refresh();
		}
	}
});
