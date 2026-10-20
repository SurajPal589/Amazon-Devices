const React = require('react');

const WebView = React.forwardRef((props, ref) => {
  return React.createElement('iframe', { ...props, ref });
});

module.exports = {
  WebView,
};
