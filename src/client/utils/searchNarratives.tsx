import { getToken } from '../utils/auth';
import { Doc } from '../utils/narrativeData';

// Constants
const SEARCH_FIELDS = ['narrative_title', 'creator', 'data_objects'];
const INDEX_NAME = 'narrative';

export interface SearchParams {
  term: string;
  sort: string;
  category: string;
  skip: number;
  pageSize: number;
  musts?: Array<any>;
  mustNots?: Array<any>;
}

interface Options {
  query: {
    bool: {
      must: Array<object>;
      must_not?: Array<object>;
    };
  };
  pageSize: number;
  auth?: boolean;
  sort?: Array<{ [key: string]: { [key: string]: string } } | string>;
  skip?: number;
}

interface SearchHit {
  id: string;
  index: string;
  doc: Doc;
}

export interface SearchResults {
  count: number;
  search_time: number;
  aggregations: Object;
  hits: Array<SearchHit>;
}

/**
 * Search narratives using ElasticSearch.
 * `term` is a search term
 * `sortBy` can be one of "Newest" or "Oldest"
 * `category` can be one of:
 *   - 'own' - narratives created by the current user
 *   - 'shared' - narratives shared with the current user
 *   - 'tutorials' - public narratives that are tutorials
 *   - 'public' - all public narratives
 *   - 'pageSize' - page length for search results
 * returns a fetch Promise that results in SearchResults
 * @param param0
 */
export function searchNarratives({
  term,
  category,
  sort = 'Newest',
  skip = 0,
  pageSize = 20,
}: SearchParams) {
  const options: Options = { query: { bool: { must: [] } }, pageSize };
  // Query constraints for "must" conditions
  const musts = [];
  // Query constraints for "must not" conditions
  const mustNots = [];
  if (term) {
    // Multi-match on narrative fields for the given search term
    musts.push({ multi_match: { query: term, fields: SEARCH_FIELDS } });
  }
  if (category === 'own') {
    // Apply a filter on the creator to match the current username
    musts.push({ term: { creator: window._env.username } });
    options.auth = true;
  } else if (category === 'public' || category === 'tutorials') {
    // Only show public narratives
    musts.push({ term: { is_public: true } });
    options.auth = false;
    if (category === 'tutorials') {
      musts.push({
        bool: {
          should: [
            { match: { narrative_title: 'tutorial' } },
            { match: { narrative_title: 'narratorial' } },
          ],
        },
      });
    }
  } else if (category === 'shared') {
    // Must be in the shared users list
    musts.push({ term: { shared_users: window._env.username } });
    // Must not be the creator
    mustNots.push({ term: { creator: window._env.username } });
    options.auth = true;
  }
  if (sort) {
    if (sort === 'Newest') {
      options.sort = [{ creation_date: { order: 'desc' } }, '_score'];
    } else if (sort === 'Oldest') {
      options.sort = [{ creation_date: { order: 'asc' } }, '_score'];
    } else if (sort === 'Least recently updated') {
      options.sort = [{ timestamp: { order: 'asc' } }, '_score'];
    } else if (sort === 'Recently updated') {
      options.sort = [{ timestamp: { order: 'desc' } }, '_score'];
    }
  }
  if (skip) {
    options.skip = skip;
  }
  if (musts.length) {
    options.query.bool.must = musts;
  }
  if (mustNots.length) {
    options.query.bool.must_not = mustNots;
  }
  return makeRequest(options).then(resp => resp.result);
}

// Make a request to the search API to fetch narratives
export function makeRequest({
  query,
  skip = 0,
  sort,
  auth = true,
  pageSize,
}: Options) {
  const params = {
    indexes: [INDEX_NAME],
    size: pageSize,
    query,
    from: skip,
  };
  if (sort) {
    let sortObj = sort;
    Object.assign(params, { sort: sortObj });
  }
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    let token = getToken();
    Object.assign(headers, { Authorization: token });
  }
  return fetch(window._env.kbase_endpoint + '/searchapi2/rpc', {
    method: 'POST',
    headers,
    body: JSON.stringify({ method: 'search_objects', params }),
  }).then(resp => resp.json());
}
