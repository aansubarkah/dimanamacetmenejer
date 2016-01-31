//to make JSHint happy
/*global moment:false*/
import Ember from 'ember';
moment.locale('id');

export function formatDate(params) {
	return moment(params[0]).fromNow();
}

export default Ember.Helper.helper(formatDate);
