<template>
  <main class="c-main">
    <form @submit.prevent="fetchIcons" class="c-search">
      <div class="c-input">
        <input
          type="text"
          v-model="search"
          :disabled="!companies"
          :placeholder="companies ? 'Search' : 'Loading companies'"
        />
        <img
          src="data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.206 12.617L14.296 15.703C14.686 16.099 15.316 16.099 15.706 15.703C16.098 15.308 16.098 14.669 15.706 14.273L12.626 11.193C13.496 10.025 14.013 8.577 14.013 7.007C14.013 3.137 10.876 0 7.007 0C3.137 0 0 3.137 0 7.007C0 10.877 3.137 14.014 7.007 14.014C8.582 14.014 10.036 13.494 11.206 12.617ZM7.006 12.012C4.243 12.012 2.002 9.772 2.002 7.007C2.002 4.243 4.242 2.002 7.007 2.002C9.771 2.002 12.011 4.242 12.011 7.007C12.011 9.771 9.771 12.012 7.008 12.012H7.006Z' fill='%23111111' fill-opacity='0.48'/%3E%3C/svg%3E%0A"
          alt=""
        />
      </div>
      <!-- <button type="submit">Search</button> -->
    </form>
    <div class="c-body">
      <div v-if="search" class="c-logos">
        <div>
          <div class="c-grid" v-if="filteredCompanies.length">
            <div
              class="c-grid__box"
              v-for="(item, index) in filteredCompanies"
              :key="index"
            >
              <div class="c-company">
                <h5 class="c-company__category">
                  {{ item.title }}
                </h5>

                <div class="c-company__icon">
                  <img
                    :src="
                      `https://nigerialogos.com/logos/${item.filename}/${item.filename}.svg`
                    "
                    :alt="item.title"
                    loading="lazy"
                  />
                </div>

                <a :href="item.url" target="_blank" class="c-company__website">
                  Visit Website
                </a>
              </div>

              <div class="c-overlay">
                <button @click="importSvg(item.filename)">Import SVG</button>
              </div>
            </div>
          </div>
          <div class="c-empty" v-if="!filteredCompanies.length">
            <div class="c-empty__icon">
              <empty-icon />
            </div>
            <h3>Your search returned no results</h3>
          </div>
        </div>
      </div>
      <welcome v-else />
    </div>
  </main>
</template>

<script>
import '../figma/figma-ds/js/selectMenu';
import '../figma/figma-ds/js/iconInput';
import '../figma/figma-ds/js/disclosure';
import axios from 'axios';

import Welcome from './components/Welcome';
import EmptyIcon from './components/empty-icon.vue';

export default {
  data() {
    return {
      search: '',
      loading: false,
      baseUrl: 'https://nigerian-logos-server.herokuapp.com/api',
      companies: null
    };
  },

  computed: {
    filteredCompanies() {
      const filter = this.search.toLowerCase();
      return this.companies.filter(
        company => company.filename.indexOf(filter) > -1
      );
    }
  },

  components: {
    Welcome,
    EmptyIcon
  },

  mounted() {
    // Initialize the figma-ds components
    window.selectMenu.init();
    window.iconInput.init();
    window.disclosure.init();

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${this.baseUrl}/logos`);
        this.companies = res.data;
        console.log(res);
      } catch (error) {
        const { response } = error;
        parent.postMessage(
          {
            pluginMessage: {
              type: 'close',
              message: response.data.message
            }
          },
          '*'
        );
      }
    };

    fetchCompanies();

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
    },
    async fetchIcons() {},
    async importSvg(filename) {
      try {
        const res = await axios.get(`${this.baseUrl}/logos/${filename}`);
        console.log(res);
        parent.postMessage(
          {
            pluginMessage: {
              type: 'icon-loaded',
              data: res.data
            }
          },
          '*'
        );
      } catch (error) {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'show-message'
            }
          },
          '*'
        );
      }
    }
  }
};
</script>

<style lang="scss">
@import '../figma/figma-ds/figma-plugin-ds';
</style>
