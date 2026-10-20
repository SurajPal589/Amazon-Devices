const React = require('react');

module.exports = {
  usePreventHideSplashScreen: jest.fn(),
  useHideSplashScreenCallback: jest.fn(() => jest.fn()),
  TVFocusGuideView: (props) => React.createElement('div', props, props.children),
};
