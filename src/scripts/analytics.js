module.exports = {
  startTrackerWithId (id) {
    if (window.analytics) {
      window.analytics.startTrackerWithId(id);
    }
  },

  trackView (title) {
    if (window.analytics) {
      window.analytics.trackView(title);
    }
  },

  trackEvent (category, action, label, value) {
    if (window.analytics) {
      window.analytics.trackEvent(category, action, label, value);
    }
  }
};
