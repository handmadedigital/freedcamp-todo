<script>
  export default {
    data () {
      return {
        oldSitemap: 'https://www.chamilia.com/sitemap/sitemapindex.xml',
        newSitemap: '/sitemap.xml',
        oldHrefs: [],
        oldUrls: [],
        oldCount: 0,
        newHrefs: [],
        newUrls: [],
        newCount: 0,
        finalUrlMatches: [],
        csvData: ''
      }
    },
    mounted () {
      if (this.oldUrls.length < 10) this.startGenerating('old')
      if (this.newUrls.length < 10) this.startGenerating('new')
    },
    computed: {

    },
    methods: {
      startGenerating (key) {
        const y = new XMLHttpRequest();
        let mainUrl = ''
  	    let fullUrl = []

        if (key === 'new') mainUrl = this.newSitemap
        if (key === 'old') mainUrl = this.oldSitemap
        // 'https://www.chamilia.com/sitemap/sitemapindex.xml'

    	  y.open("GET", mainUrl, true);
    	  y.onreadystatechange = () => {
    		  if (y.readyState == 4 && y.status == 200){
             this.serializeUrls(y.responseXML, key)
    		  }
    		}
    		y.send(null)
      },
      serializeUrls (response, key) {
        let sitemapUrls = Array.prototype.slice.call(response.getElementsByTagName("loc"))

        if (key === 'old') {
          console.log('old')
          sitemapUrls.map((url, i) => {
            if (i > 3) return
            let sitemapUrl = url.innerHTML
            let countryCode = sitemapUrl.split('Web_')[1].split('/site')[0]
            let pageType = sitemapUrl.split('sitemap-')[1].split('.xml')[0]
            let lang = pageType.split('-')
            lang.length > 1 ? lang = lang[1] : lang = lang[0]

            if (pageType.includes('categories')) {
              pageType = 'category'
            } else if (pageType.includes('products')) {
              pageType = 'product'
            } else {
              pageType = 'cms'
            }
            this.getUrlList(sitemapUrl, i, countryCode, pageType, lang, key)
          })
          return
        }

        console.log('new')
        sitemapUrls.map((url, i) => {
          const sitemapUrl = url.innerHTML
          const path = sitemapUrl.split('.cloud/')[1]
          this.getUrlParams(sitemapUrl, path, null, null, key)
        })
      },
      getUrlParams(url, path, pageType, lang, key) {
        let countryCode = ''
        if (url.includes('.chamilia')) {
          countryCode = url.split('.chamilia')[0].split('://')[1]
        }
  			const urlPath = path.split('/')
        const urlTags = path.split(/[\s,\/\-\.\_]+/)
  			let categoryName = ''
        let urlObject = {
          fullPath: url,
          path: path,
          pageType: pageType,
          lang: lang,
          categoryName: '',
          countryCode: countryCode,
          tags: urlTags
        }

				if (pageType == 'category' && urlPath.length > 2) {
					urlObject.categoryName = urlPath[1]
					urlObject.lang = urlPath[0].split('_')[0]
          this.oldUrls.push(urlObject)
				}

        if (pageType == 'category') urlObject.categoryName = urlPath[0]
        key === 'old' ? this.oldUrls.push(urlObject) : this.newUrls.push(urlObject)
  		},
      getUrlList (url, index, countryCode, pageType, lang, key) {
  			const x = new XMLHttpRequest();
  			x.open("GET", url, true);
  			x.onreadystatechange = () => {
  			  if (x.readyState == 4 && x.status == 200){
  			    const doc = x.responseXML;
  			    const levelOneUrls = Array.prototype.slice.call(doc.getElementsByTagName("url"))

            levelOneUrls.map((levelOneUrl) => {
              const url = levelOneUrl.getElementsByTagName("loc")[0].innerHTML
              const path = url.split('.com/')[1]
  			    	const levelTwoUrls = Array.prototype.slice.call(levelOneUrl.getElementsByTagName('xhtml:link'))
              if (this.oldHrefs.length > 0 && !this.oldHrefs.includes(url)) {
  			    		this.oldHrefs.push(url)
                this.getUrlParams(url, path, pageType, lang, key)
  			    	}
              levelTwoUrls.map((levelTwoUrl) => {
                const levelTwoHref = levelTwoUrl.getAttribute('href')
  			    		const levelTwoUrlLang = levelTwoUrl.getAttribute('hreflang').split('-')[0]
                const levelTwoPath = url.split('.com/')[1]
  			    		if (!this.oldHrefs.includes(levelTwoHref)) {
  			    			this.oldHrefs.push(levelTwoHref)
                  this.getUrlParams(levelTwoHref, levelTwoPath, pageType, lang, key)
  			    		}
              })
            })
  			  }
  			};
  			x.send(null);
  		},
      findMatches () {
        if (this.oldUrls.length < 10) this.startGenerating('old')
        if (this.newUrls.length < 10) this.startGenerating('new')

        let unique = []
        const uniqueUrls = this.oldUrls.filter((url) => {
          if (unique.includes(url.path)) return false
          unique.push(url.path)
          return true
        })

        let finalMatches = uniqueUrls.map((oldUrl, i) => {
          // if (i > 3) return
          const oldTags = oldUrl.oldTags
          const oldUrlPath = oldUrl.path.toUpperCase()
          let finalUrlMatches = []
          let matchedUrl = {
            oldPath: oldUrl.path,
            matched: [],
            topMatch: {}
          }

          let urlMatches = this.newUrls.map(newUrl => {
            let totalCount = 0
            let uniqueArray = []
            let tagMatches = newUrl.tags.map(tag => {
              tag = tag.toUpperCase()
              if (tag.slice(-1) == 'S') tag = tag.substring(0, tag.length - 1)
              let tagMatch = {
                name: tag,
                doesnt: [
                  'HTML',
                  'PHP',
                  'INDEX'
                ],
                score: 0,
                matched: ''
              }
              if (oldUrlPath.includes(tag) && tag.length > 3 && !tagMatch.doesnt.includes(tag) && !uniqueArray.includes(tag)) {
                uniqueArray.push(tag)
                tagMatch.matched = true
              }
              if (tagMatch.matched) {
                tagMatch.score = (tag.length * 100) / oldUrlPath.replace(/[0-9]|.HTML|EN_US\//g, '').length
                totalCount = totalCount + tagMatch.score
              }
              return tagMatch
            })
            tagMatches = tagMatches.filter(tag => tag.matched)
            if (tagMatches.length < 2) return false
            return {
              count: tagMatches.length,
              path: newUrl.path,
              tags: tagMatches,
              totalCount: totalCount,
              rgb: this.getColorForPercentage((totalCount / 100)),
              isOpen: false
            }
          })// End of new Matched url loop
          urlMatches = urlMatches.filter(match => match)
          urlMatches = urlMatches.sort((a, b) => b.totalCount - a.totalCount)

          if (!urlMatches.length) return false

          matchedUrl.matched = urlMatches
          matchedUrl.topMatch =  matchedUrl.matched[0]
          return matchedUrl
        })

        finalMatches = finalMatches.filter(match => match)
        finalMatches = finalMatches.sort((a, b) => b.topMatch.totalCount - a.topMatch.totalCount)

        this.finalUrlMatches = finalMatches
      },
      getColorForPercentage (pct) {
        let percentColors = [
          { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
          { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
          { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
        ]
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct <= percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1]
        var upper = percentColors[i]
        var range = upper.pct - lower.pct
        var rangePct = (pct - lower.pct) / range
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct
        var color = {
          r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
          g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
          b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        }
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')'
        // or output as hex if preferred
      },
      finalUrlMatchesEvent () {
        console.log('testing')
        const csvContent = this.finalUrlMatches.map(match => {
          const topMatchPath = match.topMatch ? match.topMatch.path : 'No Match Found'
          return match.oldPath + ', ' + topMatchPath
        })
        this.csvData = csvContent.join('\r\n')
      }
    },
    watch: {
      oldUrls () {
        this.oldCount = this.oldUrls.length
        if (this.oldUrls.length < 10) this.startGenerating('old')
      },
      newUrls () {
        if (this.newUrls.length < 10) this.startGenerating('new')
      },
      finalUrlMatches () {
        this.finalUrlMatchesEvent()
      }
    }
  }
</script>

<template>
  <div class="redirects-generator-wrapper">
    <div class="row">
      <div class="medium-8 medium-offset-2 columns">
        <h1>Generate Redirect Matches</h1>
        <div class="inputs-wrapper">
          <div class="input-wrapper">
            <label>Old Sitemap - <strong>{{oldUrls.length}}</strong></label>
            <div class="input">
              <input type="text" name="oldSitemap" :value="oldSitemap">
            </div>
          </div>
          <div class="input-wrapper">
            <label>New Sitemap - <strong>{{newUrls.length}}</strong></label>
            <div class="input">
              <input type="text" name="newSitemap" :value="newSitemap">
            </div>
          </div>
        </div>
        <button type="button" name="button" @click="findMatches">Find Matches</button>
        <textarea name="name" :disabled="!csvData">{{csvData}}</textarea>
        <p>Copy and Paste CSV Content (ctrl+a - Select All) (ctrl+c - Copy)</p>
        <h2 v-if="finalUrlMatches.length">{{finalUrlMatches.length}} Matches Found</h2>
        <div v-for="(urlMatch, index) in finalUrlMatches" class="inputs-wrapper">
          <button class="match_expand" @click="urlMatch.topMatch.isOpen = !urlMatch.topMatch.isOpen">
            {{index}}
          </button>
          <div class="input-wrapper">
            <div class="input">
              <input type="text" name="oldUrl" :value="urlMatch.oldPath" @change="finalUrlMatchesEvent">
            </div>
          </div>
          <div class="input-wrapper">
            <div class="input">
              <input type="text" name="newUrl" :value="urlMatch.topMatch.path" @change="finalUrlMatchesEvent">
              <div class="match_percentage" :style="{width: urlMatch.topMatch.totalCount + '%', backgroundColor: urlMatch.topMatch.rgb }">
              </div>
            </div>
          </div>
          <div v-show="urlMatch.topMatch.isOpen" class="matchData">
            <ul class="tags">
              <li v-for="tag in urlMatch.matched[0].tags"> {{tag.name}}</li>
            </ul>
            <ul class="other-urls">
              <li v-for="match in urlMatch.matched"> {{match.path}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.redirects-generator-wrapper {
  padding-top: 80px;
  text-align: center;

  button {
    margin-top: 20px;
    margin-right: 20px;
    padding: 20px;
    border-radius: 8px;
    background-color: #d9d9d9;

    &.match_expand {
      margin: 0;
      padding: 14px 15px;
    }
  }
  textarea {
    margin-top: 60px;
    min-height: 200px;
    border-radius: 8px;

    & + p {
      margin-bottom: 80px;
    }
  }

  .inputs-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;

    .matchData {
      width: 100%;
      padding: 32px 65px;
      text-align: left;
      line-height: 38px;
      display: flex;
      justify-content: space-between;
      background: rgba(0,0,0,0.1);
      margin: 20px 0;
      border-radius: 8px;

      ul {
        width: calc(50% - 30px);
      }
    }

    .input-wrapper {
      width: calc(50% - 40px);
      position: relative;

      label {
        display: block;
      }

      .input {
        background-color: #fff;
        border-radius: 8px;
        position: relative;

        input {
          background-color: transparent;
          border-radius: 8px;
          padding: 20px 20px;
          margin-bottom: 0;
          position: relative;
          z-index: 9;
        }

        .match_percentage {
          position: absolute;
          left: 4px;
          bottom: 4px;
          top: 4px;
          background-color: red;
          width: 0%;
          z-index: 0;
          border-radius: 6px;
          opacity: 0.2;
        }
      }
    }
  }
}
</style>
