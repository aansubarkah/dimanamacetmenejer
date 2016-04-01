//to make JSHint happy
/*global moment:false*/
import Ember from 'ember';
moment.locale('id');

export default Ember.Component.extend({
	tagName: 'tr',
    formatedTime: '',
	init() {
		this._super(...arguments);
		this.set('isEditing', false);
		this.set('isShowingModal', false);

        // refresh time displayed
        this.updateTime();
    },
    updateTime: function() {
        let that = this;
        let interval = 60000 * 5;//1 minutes * 5

        // time left from created updated every 5 minutes
        // 1st create string from date with moment.js
        let itemCreatedAt = '';
        itemCreatedAt = moment(that.get('markerview.created')).fromNow();
        that.set('formatedTime', itemCreatedAt);

        Ember.run.later(function() {
            itemCreatedAt = moment(that.get('markerview.created')).fromNow();
            that.set('formatedTime', itemCreatedAt);
            that.updateTime();
        }, interval);
    },
	actions: {
		remove(){
			var markerview = this.get('markerview');
			this.sendAction('deleteDatum', markerview);
		},
		edit(){
			this.set('isEditing', true);
		},
		view(){
			this.set('isShowingModal', true);
		},
		save(){
			this.set('isEditing', false);
			var markerview = this.get('markerview');

			if (this.get('markerview.name').trim() === '') {
				this.sendAction('deleteDatum', markerview);
			} else {
				this.sendAction('editDatum', markerview);
			}

		},
		toggleCreateNewMarker(){
			var markerview = this.get('markerview');
			this.sendAction('toggleCreateNewMarker', markerview);
		},
		cancel(){
			this.set('isEditing', false);
		},
		toggleAddModal(){
			this.toggleProperty('isShowingModal');
		},
		refreshPlace(){
			var lat = this.get('markerview.lat');
			var lng = this.get('markerview.lng');
			this.sendAction('refreshPlace', lat, lng);
		}
	}
});
