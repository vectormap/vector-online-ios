var c = require('./concat');

var en = {
  'vmp_url'                       : 'http://vmp.ru',
  'online_url'                    : 'http://online.vmp.ru',

  'vector_online'                 : 'Vector Online',

  'card.splash.welcome'           : 'Welcome to <a class="vector" href="/">Vector</a>',

  'card.splash.main_info'         : c('We are glad to provide you with the freshest information about',
                                      '<span class="highlight"><%= orgsCount %></span> companies in',
                                      '<a class="city-selector-btn" href="javascript:void(0);"><%= cityName %></a>,',
                                      'that is to say as many as',
                                      '<span class="highlight"><%= phonesCount %></span> telephone numbers and',
                                      '<span class="highlight"><%= emailsCount %></span> emails.',
                                      'Take advantage of it right now, absolutely free of charge, simply use the search box above.'),

  'card.splash.remember_we_have'  : 'We are also pleased to offer you',
  'card.splash.mobile_vector'     : 'Vector mobile',
  'card.splash.for_android'       : 'Light and fast for Android devices',
  'card.splash.for_wp'            : 'Offline map and city guide are available for Windows Phone',
  'card.splash.for_desktop'       : 'Vector desktop',
  'card.splash.works_on_platforms': 'Works on Windows / Linux / Mac OS X',

  'card.splash.franchise'         : c('By the way, if you are able and willing to set up this project in your city,',
                                      'please feel free to contact us via email:',
                                      '<span class="highlight">info@vmp.ru</span> or phone:',
                                      '<span class="highlight">+7 (3462) 44-20-22</span>'),

  // infocard/templates/card.html
  'card.link_to_org'              : 'Link to organization',
  'card.fields_of_activity'       : 'Scope of business',
  'card.another_branches'         : 'Branches',
  'card.increase_effectiveness'   : 'Get the most out of your advertising',
  'card.alco.license'             : 'The license',
  'card.alco.valid_until'         : 'is valid before',

  // infocard/templates/department.html
  'card.schedule.daily'           : 'Daily',
  'card.schedule.free'            : 'Flexible hours',
  'card.schedule.round_the_clock' : '24 hours a day',
  'card.schedule.nonstop'         : 'Without a break',

  // infocard/templates/search.html
  'card.search.try_to_search_hint': 'Try to search for something',
  'card.search.clear'             : 'To clear the search history',
  'card.search.not_found'         : 'No results',

  // infocard/adv-popup/adv-popup.html
  'card.adv_popup.title'          : c('Would you like to get the most out of your advertising in Vector?',
                                      'Please write your contact details and we will call you back shortly.',
                                      'We will be glad to offer you the best placement for your advertisment.',
                                      'By the way, all advertisement layouts are prepared free of cost.'),
  'card.adv_popup.name'           : 'Your name',
  'card.adv_popup.phone'          : 'Phone number',
  'card.adv_popup.request_call'   : 'Request a callback',
  'card.adv_popup.download_price' : 'While waiting for a callback, you may download our business proposal and have a look at our range of services',
  'card.adv_popup.thanks'         : 'Thank you for contacting us',
  'card.adv_popup.manager_call'   : 'Our manager will call you back shortly',
  'card.adv_popup.try_again'      : 'Something went wrong. Please try again.',

  'card.week.mon'                 : 'Mon',
  'card.week.tue'                 : 'Tue',
  'card.week.wed'                 : 'Wed',
  'card.week.thu'                 : 'Thu',
  'card.week.fri'                 : 'Fri',
  'card.week.sat'                 : 'Sat',
  'card.week.sun'                 : 'Sun',

  'card.search'                   : 'Search',
  'card.all'                      : 'All',
  'card.organization'             : 'Organization',
  'card.organizations'            : 'Organizations',
  'card.rubric'                   : 'Rubric',
  'card.rubrics'                  : 'Rubrics',
  'card.orgs_by_address'          : 'Organizations at',
  'card.address'                  : 'Address',
  'card.addresses'                : 'Addresses',
  'card.street'                   : 'Street',
  'card.streets'                  : 'Streets',
  'card.select_city'              : 'Choose the city',
  'card.increase_org_effectiveness': 'Get the most out of your advertising',
  'card.load_more'                : 'Load more',
  'card.add_to_favorites'         : 'Add to favorites',
  'card.remove_from_favorites'    : 'Remove from favorites',

  // geocoding/templates/popups*
  'geo.area'                      : 'District',
  'geo.purpose'                   : 'Purpose',
  'geo.postal_index'              : 'Post code',
  'geo.show_orgs'                 : 'Show organizations',
  'geo.street'                    : 'Street',
  'geo.routes'                    : 'Routes',
  'geo.unknown'                   : 'unknown',
  'geo.unknown2'                  : 'unknown',
  'geo.building'                  : 'Building',

  'map.control.support.name'      : 'Any ideas? Post them!',

  'map.control.lang.name'         : 'Select language',
  'map.control.lang.modal_title'  : 'Select language',

  'map.control.ruller.name'           : 'Ruller',
  'map.control.ruller.click_to_start' : 'Click to start measuring',
  'map.control.ruller.click_to_finish': 'Click on the last point to close path',

  'measure.m': 'm',
  'measure.km': 'km',

  'cancel': 'Cancel',
  'city': 'City',
  'lang': 'Language',
  'select_city_imperative': 'Choose the city',
  'settings': 'Settings',
  'favorites': 'Favorites',
  'connection_not_available': 'Internet connection is not available',
  'try_again': 'Try again'
};

module.exports = en;
