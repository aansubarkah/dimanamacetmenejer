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
			var respondent = this.get('respondent');
			this.sendAction('deleteDatum', respondent);
		},
		edit(){
			this.set('isEditing', true);
		},
		view(){
			this.set('isShowingModal', true);
		},
		save(){
			this.set('isEditing', false);
			var respondent = this.get('respondent');

			if (this.get('respondent.name').trim() === '') {
				this.sendAction('deleteDatum', respondent);
			} else {
				this.sendAction('editDatum', respondent);
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
