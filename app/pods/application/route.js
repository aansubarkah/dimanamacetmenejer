import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
//import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    sessionInvalidated: function () {
        this.send('authorizationFailed');
    },
    actions: {
        authorizationFailed: function () {
            if (!Ember.testing) {
                window.location.replace(AuthConfiguration.baseURL);
            } else {
                run.next(this, function () {
                    this.transitionTo('login');
                });
            }
        }
    }
});
