//to make JSHint happy
/*global moment:false*/
import Ember from 'ember';
moment.locale('id');

export default Ember.Component.extend({
	tagName: 'tr',
	init() {
		this._super(...arguments);
		this.set('isEditing', false);
		this.set('isShowingModal', false);
        this.set('isMediaExist', false);

        if (this.get('source.media') !== null) {
            this.set('isMediaExist', true);
        }
	},
	actions: {
		remove(){
			var source = this.get('source');
			this.sendAction('deleteDatum', source);
		},
        hide() {
            var source = this.get('source');
            this.sendAction('hideDatum', source);
        },
		edit(){
			this.set('isEditing', true);
		},
		view(){
			this.set('isShowingModal', true);
		},
		save(){
			this.set('isEditing', false);
			var source = this.get('source');

			if (this.get('source.name').trim() === '') {
				this.sendAction('deleteDatum', source);
			} else {
				this.sendAction('editDatum', source);
			}
		},
		toggleCreateNewMarker(){
			var source = this.get('source');
			this.sendAction('toggleCreateNewMarker', source);
		},
        togglePicture() {
            //var pictureURL = this.get('source.media');
            this.sendAction('togglePicture', this.get('source'));
        },
		cancel(){
			this.set('isEditing', false);
		},
		toggleAddModal(){
			this.toggleProperty('isShowingModal');
		},
		addSourceToCache(){
            var source = this.get('source');
			this.sendAction('addSourceToCache', source);
		}
	}
});
