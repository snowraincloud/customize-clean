import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: '清痕助手 - 历史记录清理',
    permissions: ['history', 'storage'],
  },
  hooks: {
    build: {
      manifestGenerated(_, manifest) {
        manifest.options_ui!.open_in_tab = true;
      },
    },
  },
});
