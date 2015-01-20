var React = require('react');

var MenuLayout = React.createClass({

  render: function() {
    return (
      <div>
        <div className="bar-stable bar bar-header disable-user-behavior">
          <h1 className="title">Вектор</h1>
        </div>
        <div className="scroll-content ionic-scroll  has-header">
          <div className="disable-user-behavior">
            <div className="list">
              <div className="item">
                Сургут
                <span className="item-note">Сменить город</span>
              </div>

              <div className="item item-complex">
                <a className="item-content" ng-href="#/search/main">
                  <span className="badge badge-assertive">RU</span>
                  Язык
                </a>
              </div>

              <a className="item item-icon-left" href="#/app/browse">
                <i className="icon ion-ios7-star"></i>
                Избранное
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = MenuLayout;
