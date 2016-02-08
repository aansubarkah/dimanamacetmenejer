/**
 * Created by aan on 14/08/15.
 */
import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from '../config/environment';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
    //session: Ember.inject.service(),
    authorizer: 'authorizer:token',
    //headers: Ember.computed('session', function () {
    //	return {
    //	};
    //}),
    shouldReloadAll: function () {
        return false;
    },
    shouldBackgroundReloadRecord: function () {
        return false;
    },
    host: config.apiURL,
    /*handleResponse: function(status, headers, payload){
        if(status === 400 && payload.errors){
            return new DS.InvalidError(payload.errors);
        }
        return this._super(...arguments);
    }*/
    /*ajax: function (url, method, hash) {
      hash = hash || {};
      hash.crossDomain = true;
      hash.xhrFields = {withCredentials: false};
      return this._super(url, method, hash);
      }*/
    /*handleResponse: function (status) {
      if (status === 401) {
      if (this.get('session.isAuthenticated')) {
      this.get('session').invalidate();
      }
      }

      return this._super(...arguments);
      },
ajaxError: function(jqXHR) {
                // if 401, ESA needs to invalidate
                if (jqXHR && jqXHR.status === 401) {
                if (this.get('session.isAuthenticated')) {
                this.get('session').invalidate();
                }
                return true;
                } else {
                return this._super.apply(this, arguments);
                }
                }*/
});
