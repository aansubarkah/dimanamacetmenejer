import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'tr',
	init() {
		this._super(...arguments);
		this.set('isEditing', false);
		this.set('isShowingModal', false);
	},

	actions: {
		remove(){
			var weather = this.get('weather');
			this.sendAction('deleteDatum', weather);
		},
		edit(){
			this.set('isEditing', true);
		},
		view(){
			this.set('isShowingModal', true);
		},
		save(){
			this.set('isEditing', false);
			var weather = this.get('weather');

			if (this.get('weather.name').trim() === '') {
				this.sendAction('deleteDatum', weather);
			} else {
				this.sendAction('editDatum', weather);
			}

		},
		cancel(){
			this.set('isEditing', false);
		},
		toggleAddModal(){
			this.toggleProperty('isShowingModal');
		}
	}
});
