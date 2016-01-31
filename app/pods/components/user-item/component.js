import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'tr',
	init() {
		this._super(...arguments);
		this.set('isEditing', false);
		this.set('isShowingModal', false);
		this.set('triggerSuggestions', 1);
	},

	actions: {
		remove(){
			var user = this.get('user');
			this.sendAction('deleteDatum', user);
		},
		edit(dataToSave){
			//this.set('isEditing', true);
			this.sendAction('editDatum', dataToSave);

		},
		refreshOptionsGroup(inputVal){
			this.sendAction('refreshOptionsGroup', inputVal);
		},
		itemSelectedGroup(item){
			if (item.get('id') !== '0') {
				this.set('group_id', item.get('id'));
			}
			this.sendAction('itemSelectedGroup', item);
		},
		view(){
			this.set('isShowingModal', true);
		},
		save(){
			this.set('isEditing', false);
			var user = this.get('user');

			if (this.get('user.username').trim() === '') {
				this.sendAction('deleteDatum', user);
			} else {
				this.sendAction('editDatum', user);
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
