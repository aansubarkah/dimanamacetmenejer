import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
	init() {
		this._super(...arguments);
		this.set('isShowingModal', false);
		this.set('isShowingNewRespondent', false);
		this.set('isAlert', false);
		this.set('alertMessages', '');
		this.set('triggerSuggestions', 1);
		this.set('newRespondentName', '');
		this.set('newRespondentContact', '');
		this.set('category_id', 1);
		this.set('respondent_id', 11);// Suara Surabaya
		this.set('weather_id', 1);
		//this.set('lat', 0);
		//this.set('lng', 0);
		this.set('info', '');
		this.set('newPinned', false);
		this.set('selection', null);
	},
	actions: {
		toggleAddModal(){
			this.toggleProperty('isShowingModal');
		},
		toggleAlert(){
			this.toggleProperty('isAlert');
		},
		refreshOptionsCategory(inputVal){
			this.sendAction('refreshOptionsCategory', inputVal);
		},
		itemSelectedCategory(item){
			if (item.get('id') !== '0') {
				this.set('category_id', item.get('id'));
			}
			this.sendAction('itemSelectedCategory', item);
		},
		refreshOptionsWeather(inputVal){
			this.sendAction('refreshOptionsWeather', inputVal);
		},
		itemSelectedWeather(item){
			if (item.get('id') !== '0') {
				this.set('weather_id', item.get('id'));
			}
			this.sendAction('itemSelectedWeather', item);
		},
		refreshOptionsRespondent(inputVal){
			//console.log(inputVal);
			this.set('newRespondentName', inputVal);
			this.sendAction('refreshOptionsRespondent', inputVal);
		},
		itemSelectedRespondent(item){
			//console.log(item.length);
			if (item.get('id') === '0') {
				this.set('respondent_id', 0);
				this.toggleProperty('isShowingNewRespondent');
				this.$('#respondentContact').focus();
			} else {
				this.sendAction('itemSelectedRespondent', item);
				this.set('respondent_id', item.get('id'));
			}

		},
		createNew(){
			if (this.get('info') === '') {
				this.set('isAlert', true);
				this.set('alertMessages', 'Marker Info is blank!');
				return;
			}

			if (this.get('respondent_id') === '0' && this.get('newRespondentContact') === '') {
				this.set('isAlert', true);
				this.set('alertMessages', 'Respondent is blank!');
				return;
			}

            //console.info(this.get('respondent_id'));
            //console.info(this.get('session.session.content.authenticated.token'));
            var arr_token = this.get('session.session.content.authenticated.token').split('.');
            var user_id = decodeURIComponent(escape(window.atob(arr_token[1])));
            //var user_id = this.get('session.session');
            var arr_user = JSON.parse(user_id);
            //console.log(arr_user['id']);

			var pinned = 0;
			if (this.get('newPinned')) {
				pinned = 1;
			}

			var dataToSave = {
                user_id: parseInt(arr_user['id']),
				category_id: parseInt(this.get('category_id')),
				respondent_id: parseInt(this.get('respondent_id')),
				respondentName: this.get('newRespondentName'),
				respondentContact: this.get('newRespondentContact'),
				weather_id: parseInt(this.get('weather_id')),
				lat: this.get('newLat'),
				lng: this.get('newLng'),
				info: this.get('info'),
				pinned: pinned
			};

			this.set('newRespondentName', '');
			this.set('newRespondentContact', '');
			this.set('info', '');

			this.sendAction('createNew', dataToSave);
		}
		//@todo if respondent doesn't exist, display contact and respondent's name input

	}
});
