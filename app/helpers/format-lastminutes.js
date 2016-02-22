import Ember from 'ember';

export function formatLastminutes(params/*, hash*/) {
  var lastminutesText = '';
  switch (params[0]) {
    case 30:
      lastminutesText = '(30 minutes ago)';
      break;
    case 60:
      lastminutesText = '(1 hour ago)';
      break;
    case 180:
      lastminutesText = '(3 hours ago)';
      break;
    case 360:
      lastminutesText = '(6 hours ago)';
      break;
    case 720:
      lastminutesText = '(12 hours ago)';
      break;
    case 1440:
      lastminutesText = '(1 day ago)';
      break;
    case 10080:
      lastminutesText = '(1 week ago)';
      break;
    default:
      lastminutesText = '(60 minutes ago)';
      break;
  }

  return ' ' + lastminutesText;
}

export default Ember.Helper.helper(formatLastminutes);
