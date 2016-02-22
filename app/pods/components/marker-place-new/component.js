//to make JSHIT happy
/*global BigNumber:false*/
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
        this.set('category_id', 1);//Macet
        this.set('weather_id', 1);//Cerah
        this.set('info', '');
        this.set('placeName', '');
        this.set('selection', null);
    },
    actions: {
        toggleAddModal(){
            this.toggleProperty('isShowingModal');
            this.set('isPlaceNameExist', false);
            this.set('placeName', '');
        },
        toggleAlert(){
            this.toggleProperty('isAlert');
        },
        createNew(){
            if (this.get('placeName') === '') {
                this.set('isAlert', true);
                this.set('alertMessages', 'Place name is blank!');
                return;
            }

            var arr_token = this.get('session.session.content.authenticated.token').split('.');
            var user_id = decodeURIComponent(escape(window.atob(arr_token[1])));
            var arr_user = JSON.parse(user_id);

            var dataToSave = {
                sourceID: parseInt(this.get('newSource.id')),
                user_id: parseInt(arr_user['id']),
                category_id: parseInt(this.get('category_id')),
                respondent_id: parseInt(this.get('newSource.respondent_id')),
                respondentName: this.get('newRespondentName'),
                respondentContact: this.get('newRespondentContact'),
                twitPlaceName: this.get('placeName'),
                weather_id: parseInt(this.get('weather_id')),
                twitID: this.get('newSource.twitid_str'),
                twitURL: this.get('newSource.url'),
                twitTime: this.get('newSource.twitTime'),
                lat: this.get('newLat'),
                lng: this.get('newLng'),
                info: this.get('info'),
                pinned: 0
            };

            this.set('placeName', '');
            this.set('info', '');

            this.sendAction('createNew', dataToSave);
        }
    }
});
