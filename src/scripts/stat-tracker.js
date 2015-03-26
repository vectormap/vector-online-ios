var _         = require('lodash');
var U         = require('utils');
var moment    = require('moment');
var AppConfig = require('config');
var analytics = require('analytics');
var qwest     = require('qwest');
var OrgModel  = require('models/OrgModel');
var request   = require('superagent-bluebird-promise');

function sendVectorStat (event, data) {
  // TODO: require here because controller also requires stat-tracker
  // (circular dependency)
  var {getSession, getCityConfig} = require('controller');
  var {userId, sessionId} = getSession();

  var stat = {
    app_id:     AppConfig.appId,
    city_id:    getCityConfig().city.id,
    session_id: sessionId,
    user_id:    userId,
    event:      'vector.stat.' + event,
    data:       data,
    sended_at:  moment().format('YYYY-MM-DDTHH:mm:ss')
  };

  qwest.post(
    AppConfig.statsUrl,
    JSON.stringify(stat),
    {dataType: 'blob'}
  ).catch(error => {
    console.log('stat error', error);
  });
}

function gaEvent (event, action, value) {
  var {getCityConfig} = require('controller');
  var city = getCityConfig().city.alias;
  var gaHelperValue = 0;

  // GA: event, action, label, value
  analytics.trackEvent(city, `${event}.${action}`, value, gaHelperValue);
}

// extract simple value from statData by valueKey for GA
function sendStat (event, action, valueKey, statData) {
  sendVectorStat(event, statData);
  gaEvent(event, action, statData[valueKey]);
}

// one argument (data) interface to track stat
var stat = function (event, action) {
  return _.partial(sendStat, event, action);
};


var StatTracker = {
  card: {
    /*{
      adv: true | false,
      org: "org title",
      org_id: 623
    }*/
    open: stat('card', 'open'),

    /*{
      adv: true | false,
      org: "org title",
      org_id: 623,
      contact: 'www.some-site.com'
    }*/
    clickSite: stat('card.www', 'click'),

    /*{
      adv: true | false,
      org: "org title",
      org_id: 623,
      contact: 'some@mail.com'
    }*/
    clickEmail: stat('card.email', 'click'),

    /*{
      adv: true | false,
      org: "org title",
      org_id: 623,
      address: "Мельникайте, 107",
      adr_id: 167,
    }*/
    clickAddress: stat('card.address', 'click'),

    /*{
      adv: true | false,
      org: "org title",
      org_id: 623,
      r_id: 10121,
      rubric: 'rubric name'
    }*/
    clickRubric: stat('card.rubric', 'click')

    /*{
      adv: true | false,
      org: "org title",
      org_id: 623
    }*/
    // reportError: stat('report')

  },

  search: {
    /*{
      name: 'search words'
    }*/
    query: stat('query', 'search')
  },

  map: {
    /*{
      layer: '...' ,
      semantic: {...}
    }*/
    clickGeoObject: stat('app.map')
  },

  withOrg (org, params) {
    return _.extend({
      adv: OrgModel.isOrgWithAd(org),
      org: org.title,
      org_id: org.int_id
    }, params);
  }
};

module.exports = StatTracker;
