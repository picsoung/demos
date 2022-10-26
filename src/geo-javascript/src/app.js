import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import injectScript from 'scriptjs'

const GOOGLE_API = process.env.GOOGLE_API

injectScript(
  `https://maps.googleapis.com/maps/api/js?v=quarterly&key=${GOOGLE_API}`,
  () => {
    const search = instantsearch({
      indexName: 'world_cities',
      searchClient: instantMeiliSearch(
        'https://ms-69223ce62f2d-106.lon.meilisearch.io',
        '2969134b46109f7a8d0330f6d1655d9c65c84752ac130674859feeefdf216f25',
      ),
    })

    search.addWidgets([
      instantsearch.widgets.sortBy({
        container: '#sort-by',
        items: [
          { value: 'world_cities', label: 'Relevant' },
          {
            value: 'world_cities:population:desc',
            label: 'Most Populated',
          },
          {
            value: 'world_cities:population:asc',
            label: 'Least Populated',
          },
        ],
      }),
      instantsearch.widgets.searchBox({
        container: '#searchbox',
      }),
      instantsearch.widgets.configure({
        hitsPerPage: 20,
      }),
      instantsearch.widgets.geoSearch({
        container: '#maps',
        googleReference: window.google,
        initialZoom: 7,
        initialPosition: {
          lat: 50.655250871381355,
          lng: 4.843585698860502,
        },
      }),
      instantsearch.widgets.infiniteHits({
        container: '#hits',
        templates: {
          item: `
            <div>
              <div class="hit-name">
                City: {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
              </div>
              <div class="hit-name">
                Country: {{#helpers.highlight}}{ "attribute": "country" }{{/helpers.highlight}}
              </div>
              <div class="hit-name">
                Population: {{#helpers.highlight}}{ "attribute": "population" }{{/helpers.highlight}}
              </div>
            </div>
          `,
        },
      }),
    ])

    search.start()
  }
)
