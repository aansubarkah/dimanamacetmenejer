import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['query'],
    session: Ember.inject.service(),
    query: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    isAlert: false,
    alertMessages: '',
    alertClass: 'alert-danger',
    meta: function() {
        return this.store.metadataFor('user');
    }.property('model'),
    actions: {
        changePassword() {
            const store = this.get('store');
            var that = this;
            var arr_token = this.get('session.session.content.authenticated.token').split('.');
            var userId = decodeURIComponent(escape(window.atob(arr_token[1])));
            var arr_user = JSON.parse(userId);

            this.store.findRecord('user', parseInt(arr_user['id'])).then(function(user){
                user.set('password', that.get('oldPassword'));
                user.set('password1', that.get('newPassword'));
                user.set('password2', that.get('confirmPassword'));

                user.save().then((response) => {
                    that.set('alertClass', 'alert-success');
                    that.set('isAlert', true);
                    that.set('alertMessages', 'Berhasil mengubah password');
                    that.set('oldPassword', '');
                    that.set('newPassword', '');
                    that.set('confirmPassword', '');
                }).catch((adapterError) => {
                    var err1 = adapterError.errors.toArray();
                    that.set('isAlert', true);
                    // if one of the password input is empty
                    if(typeof err1[0].detail === 'string') {
                        that.set('alertMessages', err1[0].detail);
                    }

                    if(typeof err1[0].detail === 'object') {
                        // if old password didn't match
                        if(typeof err1[0].detail.old_password.custom === 'string') {
                            that.set('alertMessages', err1[0].detail.old_password.custom);
                        }
                        // if new password less than 1 char or doesn't match with confirm password
                        if(typeof err1[0].detail.password1.match === 'string') {
                            that.set('alertMessages', err1[0].detail.password1.match);
                        }
                        if(typeof err1[0].detail.password1.length === 'string') {
                            that.set('alertMessages', err1[0].detail.password1.length);
                        }
                        // if confirm password less than 1 char or doesn't match with new password
                        if(typeof err1[0].detail.password2.match === 'string') {
                            that.set('alertMessages', err1[0].detail.password2.match);
                        }
                        if(typeof err1[0].detail.password1.length === 'string') {
                            that.set('alertMessages', err1[0].detail.password2.length);
                        }
                    }
                });
            });
        }
    }
});
