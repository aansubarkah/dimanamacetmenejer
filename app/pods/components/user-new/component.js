import Ember from 'ember';

export default Ember.Component.extend({
	init() {
		this._super(...arguments);
		this.set('isShowingModal', false);
		this.set('isAlert', false);
		this.set('alertMessages', '');
		this.set('triggerSuggestions', 1);
		this.set('group_id', 1);
		this.set('username', '');
		this.set('email', '');
		this.set('password', '');
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
		createNew(){
			if (this.get('username') === '') {
				this.set('isAlert', true);
				this.set('alertMessages', 'Username is blank!');
				return;
			}

			if (this.get('email') === '') {
				this.set('isAlert', true);
				this.set('alertMessages', 'Email is blank!');
				return;
			}

			if (this.get('password') === '') {
				this.set('isAlert', true);
				this.set('alertMessages', 'Password is blank!');
				return;
			}

			var dataToSave = {
				group_id: parseInt(this.get('group_id')),
				username: this.get('username'),
				email: this.get('email'),
				password: this.get('password')
			};

			this.set('username', '');
			this.set('email', '');
			this.set('password', '');
			this.set('isAlert', false);
			this.set('alertMessages', '');

			this.set('isShowingModal', false);

			this.sendAction('createNew', dataToSave);
		}
	}
});
