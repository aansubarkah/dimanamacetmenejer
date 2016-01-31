import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
//import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    beforeModel(){
    },
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
    //export default Ember.Route.extend({
    /*breadCrumb:{
title: 'Surabaya Traffic'
},*/
    /*actions: {
authorizationFailed: function () {
if (!Ember.testing) {
//window.location.replace(AuthConfiguration.baseURL);
this.transitionToRoute('index');
} else {
run.next(this, function () {
this.transitionTo('login');
});
}
}
}*/
});
