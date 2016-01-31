import Ember from 'ember';

export default Ember.Component.extend({
	init() {
		this._super(...arguments);
		this.set('isShowingModal', false);
	},
	actions:{
		toggleAddModal(){
			this.sendAction('toggleAddModal', this.get('isShowingModal'));
		}
	}
});
