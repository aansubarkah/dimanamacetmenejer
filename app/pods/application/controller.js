/**
 * Created by aan on 14/08/15.
 */
import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    state: 'all',
    queryParams: [
        'state'
    ],
    isManager: true,
    username: "John Doe",
    page: 1,
    limit: 1,
    init: function() {
        if(typeof this.get('session.session.content.authenticated.token') !== 'undefined') {
            var arr_token = this.get('session.session.content.authenticated.token').split('.');
            var user_id = decodeURIComponent(escape(window.atob(arr_token[1])));
            var arr_user = JSON.parse(user_id);

            this.set('username', arr_user['username']);
        } else {
            this.transitionToRoute('login');
        }
    },
    actions: {
        doRefresh: function () {
            this.get('target.router').refresh();
        },
        invalidateSession: function () {
            this.get('session').invalidate();
            this.transitionToRoute('login');
            this.set('username', 'John Doe');
        }
    }
});
