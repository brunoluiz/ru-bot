const I18n = (session, item) => (
  session.localizer.gettext(session.preferredLocale(), item)
);

module.exports = I18n;
