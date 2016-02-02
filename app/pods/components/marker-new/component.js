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
        this.set('info', '');
        this.set('newPinned', false);
        this.set('selection', null);
    },
    actions: {
        toggleAddModal(){
            this.toggleProperty('isShowingModal');
            console.log(this.get('category_id'));
            //console.log(this.get('category'));
        },
        toggleAlert(){
            this.toggleProperty('isAlert');
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

            var arr_token = this.get('session.session.content.authenticated.token').split('.');
            var user_id = decodeURIComponent(escape(window.atob(arr_token[1])));
            var arr_user = JSON.parse(user_id);

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
    }
});
