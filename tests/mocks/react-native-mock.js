const React = require('react');

const View = (props) => React.createElement('div', props, props.children);
const Text = (props) => React.createElement('span', props, props.children);
const Image = (props) => React.createElement('img', props);
const TouchableOpacity = (props) => React.createElement('button', props, props.children);
const Pressable = (props) => React.createElement('button', props, props.children);

const StyleSheet = {
  create: (styles) => styles,
  flatten: (styles) => styles,
};

const Dimensions = {
  get: () => ({ width: 1920, height: 1080 }),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

const AppState = {
  currentState: 'active',
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

const BackHandler = {
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  exitApp: jest.fn(),
};

const Animated = {
  Value: function(val) {
    this.value = val;
    this.setValue = (v) => { this.value = v; };
    this.interpolate = (config) => this.value;
  },
  timing: (val, config) => ({
    start: (callback) => {
      val.setValue(config.toValue);
      if (callback) callback({ finished: true });
    },
    stop: jest.fn(),
  }),
  sequence: (anims) => ({
    start: (callback) => {
      anims.forEach((a) => a.start());
      if (callback) callback({ finished: true });
    },
  }),
  loop: (anim) => ({
    start: (callback) => {
      anim.start(callback);
    },
    stop: jest.fn(),
  }),
  View: (props) => React.createElement('div', props, props.children),
  Text: (props) => React.createElement('span', props, props.children),
};

module.exports = {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
  AppState,
  BackHandler,
  Animated,
};
