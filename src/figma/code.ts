console.clear();
const start = Date.now();

// shwo UI and edit dimensions of plugin frame
figma.showUI(__html__, {
  width: 460,
  height: 590
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

const createSvg = (svgString: string) => {
  const nodes: SceneNode[] = [];

  const svg = figma.createNodeFromSvg(svgString);
  nodes.push(svg);
  figma.currentPage.selection = nodes;
};

// Receive Events
figma.ui.onmessage = event => {
  if (event.type === 'close') {
    if (event.message) {
      figma.closePlugin(event.message);
    }
    figma.closePlugin();
  }
  if (event.type === 'show-message') {
    figma.notify('A network error occured, please try again');
  }

  if (event.type === 'icon-loaded') {
    createSvg(event.data);
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
