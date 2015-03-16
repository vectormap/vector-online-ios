var _ = require('lodash');
var React = require('react/addons');
var M = require('morearty');
var {t} = require('controller');

var cx = React.addons.classSet;
var {
  formatSchedule, getCurrentDaySchedule, isCurrentWeekDay
} = require('models/ScheduleModel');
var {toggle} = M.Callback;

var ScheduleView = React.createClass({
  mixins: [M.Mixin],

  renderSchedule (scheduleInfo = []) {
    var {departmentId} = this.props;

    return [].concat(scheduleInfo).map(schedule => {
      var rowCls = cx({
        'vmp-schedule-current-day-row': schedule.isCurrentWeekDay,
        'vmp-table vmp-schedule': true
      });

      var mainTimeCls = cx({
        'vmp-cell vmp-cell-main-time': true,
        'vmp-schedule-flow-desc': schedule.isFlow
      });

      return (
        <div className={rowCls} key={`${_.uniqueId('schedule')}`}>
          {schedule.weekDay &&
            <span className="vmp-cell vmp-cell-weekday">{schedule.weekDay}</span>}

          <span className={mainTimeCls}>{schedule.mainTime}</span>

          {schedule.breakTime &&
            <span className="vmp-cell">{schedule.breakTime}</span>}
        </div>
      );
    });
  },

  render () {
    var schedule = this.getBinding().get();

    if (!schedule || (schedule && schedule.size === 0)) {
      return null;
    }

    var scheduleInfo                   = formatSchedule(schedule.toJS());
    var scheduleTable                  = this.renderSchedule(scheduleInfo);
    var {weekDay, mainTime, breakTime, isDaily} = getCurrentDaySchedule(scheduleInfo);
    var currentScheduleItem            = this.renderSchedule({mainTime, breakTime});
    var showTableMeta                  = this.getBinding().meta('showTable');
    var showTable                      = showTableMeta.get();
    var currentCls = cx({
      'item item-icon-left item-icon-right vmp-list-item vmp-schedule-current': true,
      'open': showTable
    });

    return (
      <div>
        <div
          className={currentCls}
          onTouchTap={isDaily ? null : toggle(showTableMeta)}
        >
          <i className="icon ion-ios-time-outline"></i>
          {isDaily && weekDay &&
            <span>{weekDay}:</span>}

          <span>{currentScheduleItem}</span>
          <div className="item-desc">
            {!isDaily &&
              <span>{t('today')}</span>}

            {breakTime &&
              <span className="vmp-schedule-break-desc">{t('card.schedule.lunch_time')}</span>}
          </div>
          {!isDaily &&
            <i
              className={`icon ion-ios-arrow-${showTable ? 'up' : 'down'}`}></i>}
        </div>
        {showTable &&
          <div className="item item-text vmp-schedule-table">
            {scheduleTable}
          </div>}
      </div>
    );
  }
});

module.exports = ScheduleView;
