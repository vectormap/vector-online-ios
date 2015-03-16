var {t} = require('controller');
var moment = require('moment');

var weekDays = {
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
  7: 'sun'
};

function trWeekDay (day) {
  return t(`card.week.${weekDays[day]}`);
}

function formatHours ({begin, end} = {}) {
  if (!begin || !end) {
    return '';
  }

  begin = moment.utc(begin).format('HH:mm');
  end = moment.utc(end).format('HH:mm');

  return `${begin}—${end}`;
}

var ScheduleModel = {
  formatSchedule (scheduleList = []) {
    return scheduleList.map(schedule => {
      var scheduleInfo;
      var mainTime = '';
      var isFlow = schedule.mode === 'Flow';
      var isDaily = schedule.day === 'Daily';

      if (isDaily) {
        if (schedule.mode === 'h24') {
          scheduleInfo = {
            mainTime: t('card.schedule.round_the_clock'),
            isDaily
          };
        } else {
          scheduleInfo = {
            weekDay: t('card.schedule.daily'),
            mainTime: formatHours(schedule.work),
            isDaily
          };
        }
      } else {
        if (schedule.mode === 'Work') {
          mainTime = formatHours(schedule.work);
        }

        if (schedule.mode === 'Free') {
          mainTime = t('card.schedule.day_off');
        }

        if (isFlow) {
          mainTime = t('card.schedule.free');
        }

        scheduleInfo = {
            weekDay: trWeekDay(schedule.day),
            mainTime,
            breakTime: formatHours(schedule.break),
            isCurrentWeekDay: moment().weekday() === schedule.day,
            isFlow
          };
      }

      return scheduleInfo;
    });
  },

  getCurrentDaySchedule (scheduleInfo = []) {
    var weekDay = moment().weekday();

    if (scheduleInfo.length === 1) {
      return scheduleInfo[0];
    } else {
      return scheduleInfo[weekDay - 1];
    }
  }

};

module.exports = ScheduleModel;
