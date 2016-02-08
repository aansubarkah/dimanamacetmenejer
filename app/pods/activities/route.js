import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model: function(params) {
        var arr_token = this.get('session.session.content.authenticated.token').split('.');
        var userId = decodeURIComponent(escape(window.atob(arr_token[1])));
        var arr_user = JSON.parse(userId);

        return Ember.RSVP.hash({
            activity: this.store.find('activity', parseInt(arr_user['id']))
        });
    },
    setupController: function(controller, model) {
        controller.set('activity', model.activity);
    }
});
