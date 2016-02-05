import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    user_id: null,
    user_name: null,
    init: function() {
        var arr_token = this.get('session.session.content.authenticated.token').split('.');
        var userId = decodeURIComponent(escape(window.atob(arr_token[1])));
        var arr_user = JSON.parse(userId);

        this.set('user_id', parseInt(arr_user['id']));
        this.set('user_name', arr_user['username']);
    }
});
