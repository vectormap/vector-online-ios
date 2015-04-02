var c = require('./concat');

var az = {
  'vmp_url'                       : 'http://vmp.az',
  'online_url'                    : 'http://online.vmp.az',

  'vector_online'                 : 'Onlayn Vektor',

  'card.splash.welcome'           : '<a class="vector" href="/">Vektora</a> xoş gəlmisiz',
  'card.splash.main_info'         : c('<a class="city-selector-btn" href="javascript:void(0);"><%= cityName %></a> şəhəri üzrə sizə',
                                      '<span class="highlight"><%= orgsCount %></span> təşkilat təqdim edirik,',
                                      '<span class="highlight"><%= phonesCount %></span> əlaqə nömrəsi və',
                                      '<span class="highlight"><%= emailsCount %></span> elektron poçt ünvanı.',
                                      'Bütün bunlar indi və pulsuz mümkündür, Yuxarıdakı axtarış sistemindən istifadə edin.'),

  'card.splash.remember_we_have'  : 'YadInızda saxlayIn:',
  'card.splash.mobile_vector'     : 'Vektorun mobil variantı mövcuddur',
  'card.splash.for_android'       : 'Andorid qurğular üçün - sadə və tez',
  'card.splash.for_wp'            : 'Windows telefonlar üçün - offline xəritə və məlumat mərkəzi ilə',
  'card.splash.for_desktop'       : 'Stolüstü Vektor',
  'card.splash.works_on_platforms': 'Windows / Linux / Mac OS X əməliyyat sistemlərində işləyir',
  'card.splash.franchise'         : c('<span class="highlight">Türkiyədə</span> fəaliyyətə başlamışıq.',
                                      'Sizdə öz şəhərinizdə Vektoru görmək istəsəniz',
                                      '<a href="mailto:info@vmp.az">info@vmp.az</a> elektron poçtu və ya',
                                      '<span class="highlight">+994 (012) 440-87-10</span> nömrəsi ilə əlaqə saxlaya bilərsiniz.'),

  // infocard/templates/card.html
  'card.link_to_org'              : 'Təşkilatlar üçün link',
  'card.fields_of_activity'       : 'Məşğuliyyət sahələri',
  'card.another_branches'         : 'Başqa filiallar',
  'card.increase_effectiveness'   : 'Effektivliyi artırır',
  'card.alco.license'             : 'Lisenziya',
  'card.alco.valid_until'         : 'etibarlıdır',

  // infocard/templates/department.html
  'card.schedule.daily'           : 'Gündəlik',
  'card.schedule.free'            : 'Sərbəst qrafik',
  'card.schedule.round_the_clock' : '24 saat',
  'card.schedule.nonstop'         : 'Fasiləsiz',
  'card.schedule.day_off'         : 'Istirahət günü',
  'card.schedule.lunch_time'      : 'Nahar',

  // infocard/templates/search.html
  'card.search.try_to_search_hint': 'Nə isə axtarmağa cəhd edin',
  'card.search.clear'             : 'Axtarışı təmizləmək',
  'card.search.not_found'         : 'Heçnə tapılmadı',

  // infocard/adv-popup/adv-popup.html
  'card.adv_popup.title'          : c('Siz məlumat mərkəzində yerləşdirməni yaxşılaşdırmaq istəyirsiniz?',
                                      'Əlaqə məlumatlarınızı saxlayın, bizim əməkdaşlarımız sizinlə qısa',
                                      'müddətdə əlaqə saxlayacaq. Biz sizə yerləşdirmə üçün ən rahat yolu',
                                      'seçməyə kömək edəcəyik. Reklam maketlərinin hazırlanması pulsuzdur.'),
  'card.adv_popup.name'           : 'Sizin adınız',
  'card.adv_popup.phone'          : 'Telefon',
  'card.adv_popup.request_call'   : 'Zəng sifariş etmək',
  'card.adv_popup.download_price' : 'Zəngi gözlədiyiniz müddətdə siz bizim kommersiya təkliflərimizi yükləyə və tanış ola bilərsiniz',
  'card.adv_popup.thanks'         : 'Müraciətinizə görə təşəkkür edirik',
  'card.adv_popup.manager_call'   : 'Bizim menecer sizinlə qısa müddətdə əlaqə saxlayacaq',
  'card.adv_popup.try_again'      : 'Nə isə səhv oldu. Bir daha təkrarlayın.',

  'card.week.mon'                 : 'B.E.',
  'card.week.tue'                 : 'Ç.A.',
  'card.week.wed'                 : 'Ç.',
  'card.week.thu'                 : 'C.A.',
  'card.week.fri'                 : 'C.',
  'card.week.sat'                 : 'Ş.',
  'card.week.sun'                 : 'B.',

  'card.search'                   : 'Axtarış',
  'card.all'                      : 'hamsı',
  'card.organization'             : 'Təşkilat',
  'card.organizations'            : 'Təşkilatlar',
  'card.rubric'                   : 'Rubrika',
  'card.rubrics'                  : 'Rubrikalar',
  'card.orgs_by_address'          : 'ünvanlı Təşkilatlar',
  'card.address'                  : 'ünvan',
  'card.addresses'                : 'ünvanlar',
  'card.street'                   : 'Küçə',
  'card.streets'                  : 'Küçələr',
  'card.select_city'              : 'Şəhəri seçin',
  'card.increase_org_effectiveness': 'Təşkilatın effektliliyini artırmag',
  'card.load_more'                : 'Yenidən yükləmək',
  'card.add_to_favorites'         : 'Seçilmiş siyahıya əlavə etmək',
  'card.remove_from_favorites'    : 'Seçilmiş siyahıdan silmək',
  'card.sibling.hint'             : 'Digər təşkilatların təklifləri',

  // geocoding/templates/popups*
  'geo.area'                      : 'Rayon',
  'geo.purpose'                   : 'Təyinat',
  'geo.postal_index'              : 'Poçt indeksi',
  'geo.show_orgs'                 : 'Binada yerləşən təşkilatları göstərmək',
  'geo.street'                    : 'Küçə',
  'geo.routes'                    : 'Marşrutlar',
  'geo.unknown'                   : 'naməlum',
  'geo.unknown2'                  : 'naməlum',
  'geo.building'                  : 'Bina',

  'map.control.support.name'      : 'İdeyanız var? Onları deyin!',

  'map.control.lang.name'         : 'Dili seçmək',
  'map.control.lang.modal_title'  : 'Dili seçin',

  'map.control.ruller.name'           : 'Xətkeş',
  'map.control.ruller.click_to_start' : 'Olçməni başlamaq üçün klikləyin',
  'map.control.ruller.click_to_finish': 'Qurtarmaq üçün son nöqtəyə klikləyin',

  'map.control.location.map_is_tracking_your_location': 'Xəritə sizin olduğunuz məkanda izləyir',
  'map.control.location.location_tracking_disabled'   : 'Məkan izləmə söndürülür',
  'map.control.location.enable_location_in_settings'  : 'Məkan təyin etməni Vektor sistem parametrlərindən açın',
  'map.control.location.we_cant_find_you'             : 'Biz sizi tapa bilmirik',
  'map.control.location.location_out_of_city'         : 'Siz xəritədən kənarda yerləşirsiniz',

  'measure.m' : 'm',
  'measure.km': 'km',

  'cancel': 'Imtina etmək',
  'city': 'Şəhər',
  'lang': 'Dili',
  'select_city_imperative': 'Şəhəri seçin',
  'settings': 'Parametrlər',
  'favorites': 'Seçilmiş',
  'connection_not_available': 'Bağlantı  yoxdu',
  'check_internet_connection': 'Internet bağlantısını  yoxlayın',
  'try_again': 'Yenidən cəhd edin',
  'today': 'Bu gün',
  'search_history_info': 'Burada sizin axtarış tarixçəniz yadda saxlanılacaq',
  'bookmarks_info': 'Siz hələ seçilmiş siyahıya heç bir təşkilat əlavə etməmisiniz'
};

module.exports = az;
