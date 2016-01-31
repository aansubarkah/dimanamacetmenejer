import Ember from 'ember';

export default Ember.Component.extend({
	init() {
		this._super(...arguments);
		this.set('isShowingModal', false);
		this.set('isAlert', false);
		this.set('alertMessages', '');
		this.set('triggerSuggestions', 1);
		this.set('group_id', this.get('user.group_id'));
	},
	actions: {
		toggleAddModal(){
			this.toggleProperty('isShowingModal');
			this.set('isAlert', false);
			this.set('alertMessages', '');
		},
		toggleAlert(){
			this.toggleProperty('isAlert');
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
		edit(){
			if (this.get('user.username') === '') {
				this.set('isAlert', true);
				this.set('alertMessages', 'Username is blank!');
				return;
			}

			if (this.get('user.email') === '') {
				this.set('isAlert', true);
				this.set('alertMessages', 'Email is blank!');
				return;
			}

			var user=this.get('user');
			user.set('group_id', this.get('group_id'));

			this.set('isAlert', false);
			this.set('alertMessages', '');

			this.set('isShowingModal', false);

			this.sendAction('edit', user);
		}
	}
});
