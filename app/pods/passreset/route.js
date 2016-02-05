import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model: function(params) {
        var query = {};
        if (Ember.isPresent(params.user_id)) {
            query.id = params.user_id;
        }

        return Ember.RSVP.hash({
            user: this.store.query('user', query)
        });
    },
    setupController: function(controller, model) {
        controller.set('user', model.user);
    },
    queryParams: {

    }
});
