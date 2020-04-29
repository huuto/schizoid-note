import Vue from 'vue'
import sanitizeHTML from 'sanitize-html'

Vue.prototype.$sanitize = (string) =>
  sanitizeHTML(string, {
    allowedTags: sanitizeHTML.defaults.allowedTags.concat(['img'])
  })
