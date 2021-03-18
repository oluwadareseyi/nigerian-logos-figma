console.clear();
const start = Date.now();

// shwo UI and edit dimensions of plugin frame
figma.showUI(__html__, {
  width: 310,
  height: 440
});

const eventFunction = () => {
  // Send event with event type and any object property you want
  console.log('button clicked');

  figma.ui.postMessage({
    type: 'event-name',
    name: 'arbitrary',
    data: 'arbitrary'
  });
};

// Receive Events
figma.ui.onmessage = event => {
  if (event.type === 'close') {
    figma.closePlugin();
  }
  if (event.type === 'event-click') {
    // let selected = figma.currentPage.selection['0'];
    eventFunction();
  }
};

//time taken
const end = Date.now();
const time = ((end - start) / 1000).toFixed(2);
figma.ui.postMessage({
  type: 'time',
  data: `Completed in : ${time}s`
});
console.log('Completed in:', time + 's');
