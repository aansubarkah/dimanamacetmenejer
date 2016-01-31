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
			var place = this.get('place');
			this.sendAction('deleteDatum', place);
		},
		edit(){
			this.set('isEditing', true);
		},
		view(){
			this.set('isShowingModal', true);
		},
		save(){
			this.set('isEditing', false);
			var place = this.get('place');

			if (this.get('place.name').trim() === '') {
				this.sendAction('deleteDatum', place);
			} else {
				this.sendAction('editDatum', place);
			}

		},
		toggleCreateNewMarker(){
			var place = this.get('place');
			this.sendAction('toggleCreateNewMarker', place);
		},
		cancel(){
			this.set('isEditing', false);
		},
		toggleAddModal(){
			this.toggleProperty('isShowingModal');
		},
		refreshPlace(){
			var lat = this.get('place.lat');
			var lng = this.get('place.lng');
			this.sendAction('refreshPlace', lat, lng);
		}
	}
});
