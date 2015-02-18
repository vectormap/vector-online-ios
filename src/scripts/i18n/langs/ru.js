var c = require('./concat');

var ru = {
  'vmp_url'                       : 'http://vmp.ru',
  'online_url'                    : 'http://online.vmp.ru',

  'vector_online'                 : 'Вектор Онлайн',

  'card.splash.welcome'           : 'Добро пожаловать в <a class="vector" href="/">Вектор</a>',
  'card.splash.main_info'         : c('По <a class="city-selector-btn" href="javascript:void(0);"><%= cityName %></a>  мы предоставляем наисвежайшую',
                                      'информацию по <span class="highlight"><%= orgsCount %></span> компаниям, а это целых',
                                      '<span class="highlight"><%= phonesCount %></span> телефонов и',
                                      '<span class="highlight"><%= emailsCount %></span> электропочт. Все это доступно сейчас и бесплатно,',
                                      'воспользуйтесь поисковой строкой выше.'),

  'card.splash.remember_we_have'  : 'Помните, что у - еще есть',
  'card.splash.mobile_vector'     : 'Мобильный Вектор',
  'card.splash.for_android'       : 'Для Android устройств - легкий и быстрый',
  'card.splash.for_wp'            : 'Для Windows Phone - с оффлайн картой и справочником',
  'card.splash.for_desktop'       : 'Настольный Вектор',
  'card.splash.works_on_platforms': 'Работает под Windows / Linux / Mac OS X',
  'card.splash.franchise'         : c('Кстати, если у вас есть желание и возможности',
                                      'запустить <span class="highlight">проект</span> в своем городе, можете связаться',
                                      'с нами электропочтой <a href="mailto:info@vmp.ru?subject=Вектор в моем городе">info@vmp.ru</a> либо по телефону',
                                      '+7 (3462) 44-20-22'),

  // infocard/templates/card.html
  'card.link_to_org'              : 'Ссылка на организацию',
  'card.fields_of_activity'       : 'Сферы деятельности',
  'card.another_branches'         : 'Другие филиалы',
  'card.increase_effectiveness'   : 'Повысить эффективность',
  'card.alco.license'             : 'Лицензия',
  'card.alco.valid_until'         : 'действительна до',

  // infocard/templates/department.html
  'card.schedule.daily'           : 'Ежедневно',
  'card.schedule.free'            : 'Свободный график',
  'card.schedule.round_the_clock' : 'Круглосуточно',
  'card.schedule.nonstop'         : 'Без перерыва',

  // infocard/templates/search.html
  'card.search.try_to_search_hint': 'Попробуйте что-нибудь поискать',
  'card.search.clear'             : 'Очистить поиск',
  'card.search.not_found'         : 'Ничего не найдено',

  // infocard/adv-popup/adv-popup.html
  'card.adv_popup.title'          : c('Желаете повысить эффективность вашего размещения в справочнике?',
                                      'Оставьте ваши контактные данные и наши специалисты свяжутся с вами',
                                      'в ближайшее время. Мы поможем подобрать наилучший способ размещения.',
                                      'Кстати, рекламные макеты мы изготавливаем бесплатно.'),
  'card.adv_popup.name'           : 'Ваше имя',
  'card.adv_popup.phone'          : 'Телефон',
  'card.adv_popup.request_call'   : 'Заказать звонок',
  'card.adv_popup.download_price' : 'В ожидании звонка вы можете скачать наше коммерческое предложение и познакомиться с ассортиментом',
  'card.adv_popup.thanks'         : 'Спасибо за обращение',
  'card.adv_popup.manager_call'   : 'Наш менеджер перезвонит вам в ближайшее время',
  'card.adv_popup.try_again'      : 'Что-то пошло не так. Попробуйте еще раз.',

  'card.week.mon'                 : 'Пн',
  'card.week.tue'                 : 'Вт',
  'card.week.wed'                 : 'Ср',
  'card.week.thu'                 : 'Чт',
  'card.week.fri'                 : 'Пт',
  'card.week.sat'                 : 'Сб',
  'card.week.sun'                 : 'Вс',

  'card.search'                   : 'Поиск',
  'card.all'                      : 'Все',
  'card.organization'             : 'Организация',
  'card.organizations'            : 'Организации',
  'card.rubric'                   : 'Рубрика',
  'card.rubrics'                  : 'Рубрики',
  'card.orgs_by_address'          : 'Организации по адресу',
  'card.address'                  : 'Адрес',
  'card.addresses'                : 'Адреса',
  'card.street'                   : 'Улица',
  'card.streets'                  : 'Улицы',
  'card.select_city'              : 'Выберите город',
  'card.increase_org_effectiveness': 'Повысить эффективность организации',
  'card.load_more'                : 'Загрузить еще',

  // geocoding/templates/popups*
  'geo.area'                      : 'Район',
  'geo.purpose'                   : 'Назначение',
  'geo.postal_index'              : 'Почтовый индекс',
  'geo.show_orgs'                 : 'Показать организации в здании',
  'geo.street'                    : 'Улица',
  'geo.routes'                    : 'Маршруты',
  'geo.unknown'                   : 'неизвестно',
  'geo.unknown2'                  : 'неизвестен',
  'geo.building'                  : 'Сооружение',

  'map.control.support.name'      : 'Есть идеи? Выскажите их!',

  'map.control.lang.name'         : 'Выбрать язык',
  'map.control.lang.modal_title'  : 'Выберите язык',

  'map.control.ruller.name'           : 'Линейка',
  'map.control.ruller.click_to_start' : 'Кликните для начала измерения',
  'map.control.ruller.click_to_finish': 'Кликните на последней точке для завершения',

  'measure.m': 'м',
  'measure.km': 'км',

  'cancel': 'Отмена',
  'city': 'Город',
  'lang': 'Язык',
  'select_city_imperative': 'Выбрать город',
  'settings': 'Настройки'
};

module.exports = ru;
