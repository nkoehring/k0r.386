import { defineConfig } from 'vitepress'
import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from './theme/Config'

export default defineConfigWithTheme<ThemeConfig>({
  title: "k0r.386",
  description: "Norman Köhrings Homepage",
  lang: 'en',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['link', { rel: 'alternate', href: 'https://k0r.in' }],
    ['link', { rel: 'alternate', href: 'https://koehr.in' }],
    ['link', { rel: 'alternate', href: 'https://koehr.ing' }],
    ['link', { rel: 'canonical', href: 'https://koehr.ing' }],
    ['meta', { content: "The personal page and weblog of Norman Köhring", name: "description" }],
    ['meta', { content: "Norman Köhring", name: "author" }],
    ['meta', { content: "the codeartist — programmer and engineer based in Berlin", name: "DC.title" }],
    ['meta', { content: "52.4595, 13.5335", name: "ICBM" }],
    ['meta', { content: "52.4595; 13.5335", name: "geo.position" }],
    ['meta', { content: "DE-BE", name: "geo.region" }],
    ['meta', { content: "Berlin", name: "geo.plac,ename" }],
    ['meta', { content: "width=device-width,initial-scale=1.0", name: "viewport" }],
  ],
  themeConfig: {
    commands: [{
      command: 'about',
      aliases: ['info'],
      help: 'Who is Norman Köhring?',
      message: 'Norman Köhring is a programmer, hacker and open source enthusiast based in Berlin. He is the Principal Frontend Engineer at Code Gaia, where he is a proud part of revolutionizing carbon emission reporting.',
      uris: [{
        label: 'Berlin', uri: 'https://www.openstreetmap.org/#map=12/52.4595/13.5335'
      }, {
        label: 'CodeGaia', uri: 'https://codegaia.io/'  
      }, {
        label: 'Hacker?', uri: 'https://en.wikipedia.org/wiki/Hacker'  
      }]
    }, {
      command: 'contact',
      aliases: ['email', 'homepage', 'www'],
      help: 'How to contact Norman Köhring?',
      message: [
        '# other servers',
        'email - n@koehr.in OR norman.koehring@mailbox.org',
        'mastodon - mstdn.io/@koehr',
        'twitter - twitter.com/koehr_in',
        'github - github.com/nkoehring',
        'instagram - instagram.com/coffee_n_code',
        '500px - 500px.com/koehr',
        '# my server',
        'sourcecode - git.k0r.in/ (forgejo)',
        'fediverse - m.k0r.in/@n (misskey)',
      ].join('\n'),
      uris: [{
        label: 'email', uri: 'mailto:n@koehr.in'  
      }, {
        label: 'mastodon', uri: 'https://mstdn.io/@koehr'  
      }, {
        label: 'twitter', uri: 'https://twitter.com/koehr_in'  
      }, {
        label: 'github', uri: 'https://github.com/nkoehring'  
      }, {
        label: 'instagram', uri: 'https://instagram.com/coffee_n_code'  
      }, {
        label: '500px', uri: 'https://500px.com/koehr'  
      }, {
        label: 'sourcecode', uri: 'https://git.k0r.in/'  
      }, {
        label: 'fediverse', uri: 'https://m.k0r.in/@n'  
      }]
    }],
  }
})
