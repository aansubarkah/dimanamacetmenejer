import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model: function(params) {
        var arr_token = this.get('session.session.content.authenticated.token').split('.');
        var userId = decodeURIComponent(escape(window.atob(arr_token[1])));
        var arr_user = JSON.parse(userId);

        /*var query = {};
        if (Ember.isPresent(params.query)) {
            query.query = params.query;
        }*/

        return Ember.RSVP.hash({
            //pass: this.store.query('user', query),
            user: this.store.find('user', parseInt(arr_user['id']))
        });
    },
    setupController: function(controller, model) {
        //controller.set('pass', model.pass);
        controller.set('user', model.user);
    },
    /*queryParams: {
        query: {
            refreshModel: true
        }
    }*/
});
