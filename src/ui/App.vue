<template>
  <main class="c-main">
    <h1>Plugin</h1>
    <button class="button c-button" @click="buttonClick">Click me</button>
  </main>
</template>

<script>
import '../figma/figma-ds/js/selectMenu';
import '../figma/figma-ds/js/iconInput';
import '../figma/figma-ds/js/disclosure';

import Welcome from './components/Welcome';

export default {
  data() {
    return {};
  },

  components: {
    Welcome
  },

  mounted() {
    // Initialize the figma-ds components
    window.selectMenu.init();
    window.iconInput.init();
    window.disclosure.init();

    window.onmessage = event => {
      const { type, name, data } = event.data.pluginMessage;

      //  recieve data
      if (type === 'event-name') {
        console.log('event called');
      }
    };
  },
  methods: {
    buttonClick() {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'event-click'
          }
        },
        '*'
      );
    }
  }
};
</script>

<style lang="scss">
@import '../figma/figma-ds/figma-plugin-ds';
</style>
