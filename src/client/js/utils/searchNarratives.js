
// Search narratives using elasticsearch
// `term` is a search term
// `sortBy` can be one of "Newest" or "Oldest"
// `category` can be one of:
//   - 'own' - narratives created by the current user
//   - 'shared' - narratives shared with the current user
//   - 'tutorials' - public narratives that are tutorials
//   - 'public' - all public narratives
//   - 'pageSize' - page length for search results
// returns a fetch Promise
export function searchNarratives({term, sort, category, skip, pageSize = 20}) {
  const options = {query: {bool: {must: []}}, pageSize};
  if (term) {
    // Multi-match on narrative fields for the given search term
    options.query.bool.must.push({
      multi_match: {
        query: term,
        fields: ['name', 'markdown_text', 'creator', 'app_names'],
      },
    });
  }
  if (category === 'own') {
    // Apply a filter on the creator to match the current username
    options.query.bool.must.push({term: {creator: window._env.username}});
    options.auth = true;
  } else if (category === 'public' || category === 'tutorials') {
    // Only show public narratives
    options.query.bool.must.push({term: {is_public: true}});
    options.auth = false;
    if (category === 'tutorials') {
      options.query.bool.must.push({
        bool: {
          should: [
            {match: {name: 'tutorial'}},
            {match: {name: 'narratorial'}},
          ],
        },
      });
    }
  }
  if (sort) {
    // Sort by timestamp
    const order = (sort === 'Newest') ? 'desc' : 'asc';
    options.sort = [{timestamp: {order}}, '_score'];
  }
  if (skip) {
    options.skip = skip;
  }
  return makeRequest(options);
}

// Make a request to the search API to fetch narratives
export function makeRequest({query, skip = 0, sort, auth = true, pageSize}) {
  const params = {
    indexes: ['narrative'],
    size: pageSize,
    query,
    from: skip,
  };
  const headers = {'Content-Type': 'application/json'};
  if (sort) {
    params.sort = sort;
  }
  if (auth) {
    headers['Authorization'] = window._env.token;
  }
  return fetch(window._env.searchapi, {
    method: 'POST',
    headers,
    body: JSON.stringify({method: 'search_objects', params}),
  }).then((resp) => resp.json());
}
