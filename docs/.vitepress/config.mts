import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'smart-unit',
  description:
    'Elegant unit conversion utility with automatic unit selection and high-precision support',
  base: '/smart-unit/',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '指南', link: '/guide/' },
          { text: 'API', link: '/api/' },
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/guide/' },
              { text: '常用单位', link: '/guide/units' },
              { text: '高精度', link: '/guide/high-precision' },
              { text: '链式格式化', link: '/guide/chain-format' },
              { text: '国际化', link: '/guide/i18n' },
            ],
          },
          {
            text: 'API 参考',
            items: [
              { text: 'SmartUnit', link: '/api/' },
              { text: '接口', link: '/api/interface' },
            ],
          },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'API', link: '/en/api/' },
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Quick Start', link: '/en/guide/' },
              { text: 'Common Units', link: '/en/guide/units' },
              { text: 'High Precision', link: '/en/guide/high-precision' },
              { text: 'Chain Formatting', link: '/en/guide/chain-format' },
              { text: 'Internationalization', link: '/en/guide/i18n' },
            ],
          },
          {
            text: 'API Reference',
            items: [
              { text: 'SmartUnit', link: '/en/api/' },
              { text: 'Interfaces', link: '/en/api/interface' },
            ],
          },
        ],
      },
    },
  },
  markdown: {
    theme: {
      light: 'light-plus', // VSCode Light+
      dark: 'dark-plus', // VSCode Dark+
    },
  },

  themeConfig: {
    outline: [1, 3],
    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/flycran/smart-unit' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/smart-unit' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present flycran',
    },
  },
})
