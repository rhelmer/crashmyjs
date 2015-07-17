var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var button = ToggleButton({
  id: 'crashmyjs-button',
  label: 'Crash My JS',
  icon: {
    '18': './crash-icon-16.png',
    '32': './crash-icon-32.png',
    '64': './crash-icon-64.png'
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: './panel.html',
  onHide: handleHide
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
