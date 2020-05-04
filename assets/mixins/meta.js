export default {
  head() {
    return {
      meta: [
        // { hid: 'description', name: 'description', content: this.meta.description },
        // { hid: 'og:description', property: 'og:description', content: this.meta.description },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'スキゾイド帳',
        },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://schizoid-note.com',
        },
        { hid: 'og:title', property: 'og:title', content: 'スキゾイド帳' },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://schizoid-note.com/img/schizoid-chan.png',
        },
        // { property: 'article:publisher', content: 'FacebookURL' },
        // { property: 'fb:app_id', content: 'FacebookAppID' },
        { name: 'twitter:card', content: 'summary' },
        // { name: 'twitter:site', content: '@Twitter' }, ],
      ],
    }
  },
}
