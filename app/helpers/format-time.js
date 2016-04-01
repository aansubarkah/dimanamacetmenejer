//to make JSHint happy
/*global moment:false*/
import Ember from 'ember';
moment.locale('id');

export function formatTime(params) {
	return moment(params[0]).format('dddd, Do MMMM YYYY, HH:mm:ss');
}

export default Ember.Helper.helper(formatTime);
