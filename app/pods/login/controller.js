import Ember from 'ember';

export default Ember.Controller.extend({
	session: Ember.inject.service(),
	//password: '',
	//signInError: true,
	//siginLoading: true,
	actions: {
		authenticate: function () {
			var credentials = this.getProperties('identification', 'password'),
				authenticator = 'authenticator:jwt';

			this.get('session').authenticate(authenticator, credentials);
			//this.transitionToRoute('/');
			/*this.set('signinLoading', true);
			return this.get('session').authenticate(authenticator, credentials).then(()=> {
				this.set('signInError', false);
			}, ()=> {
				this.set('password', '');
				this.set('signInError', true);
				this.set('signinLoading', false);
				return true;
			});*/
			//this.transitionToRoute('index');
		}
	}
});
