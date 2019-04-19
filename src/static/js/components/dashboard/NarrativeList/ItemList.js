// Narrative list header with tabs
import {Component, h} from 'preact';
import * as timeago from 'timeago.js';
import mitt from 'mitt';

// Components
// import {PaginationState} from '../../Pagination';

// Utils
import {sortBy} from '../../../utils/sortBy';

export class ItemList extends Component {
  static createState({update}) {
    // TODO 'show more' style pagination
    return {
      update,
      term: '',
      sortBy: 'Newest',
      category: 'own',
      emitter: mitt(),
      esResults: null,
      activeItem: null,
      itemDetails: null
    };
  }

  static fetchItems(state) {
    const {emitter, update} = state;
    search(state.term, state.sortBy, state.category)
      .then(esResults => {
        const newState = Object.assign(state, {
          esResults,
          activeItem: esResults.hits.hits[0]
        });
        update(newState);
        emitter.emit('fetched', esResults);
      });
  }

  static selectItem(item, state) {
    const {emitter, update} = state;
    update(Object.assign(state, {activeItem: item}));
    emitter.emit('selected', item);
  }

  static searchBy(term, state) {
    const newState = Object.assign(state, {term});
    state.update(newState);
    ItemList.fetchItems(newState);
  }

  static sortBy(sortBy, state) {
    const newState = Object.assign(state, {sortBy});
    state.update(newState);
    ItemList.fetchItems(newState);
  }

  // Apply a search filter based on a tab name ("my narratives", "shared with me", etc)
  static applyCategory(catName, state) {
    // map from tab text to a more canonical name
    const categoryMap = {
      'My narratives': 'own',
      'Shared with me': 'shared',
      'Tutorials': 'tutorials',
      'Public': 'public' 
    }
    if (!(catName in categoryMap)) {
      console.log('Known category names:', Object.keys(categoryMap));
      throw new Error('Invalid category name: ' + catName);
    }
    const newState = Object.assign(state, {category: categoryMap[catName]})
    state.update(newState);
    ItemList.fetchItems(newState);
  }

  // Fetch items immediately on pageload
  componentDidMount() {
    ItemList.fetchItems(this.props.state);
  }

  render() {
    const {esResults} = this.props.state;
    if (!esResults || !esResults.hits || !esResults.hits.hits || !esResults.hits.hits.length) {
      return (<div className='w-40'></div>);
    }
    const items = esResults.hits.hits;
    return (
      <div className='w-40'>
        { items.map((item) => itemView(this, item)) }
      </div>
    );
  }
}

// view for a single narrative item
const itemView = (component, item) => {
  const state = component.props.state;
  const status = state.activeItem === item ? 'active' : 'inactive';
  const css = itemClasses[status];
  const data = item._source;
  const savedAgo = data.timestamp
  // Action to select an item to view details
  return (
    <div onClick={() => ItemList.selectItem(item, state)} key={ data.upa } className='br b--black-20'>
      <div className={css.outer}>
        <div className={css.inner}>
          <h4 className='ma0 mb2 pa0 f5'>{ data.name }</h4>
          {/* TODO author compute to detect "you" */}
          <p className='ma0 pa0 f6 black-60'>Updated { timeago.format(data.timestamp) } by { data.creator }</p>
        </div>
      </div>
    </div>
  );
};

// Active and inactive classnames for the item listing
const itemClasses = {
  active: {
    inner: 'pv3 pr3 br bw2 b--blue',
    outer: 'bb b--black-20',
  },
  inactive: {
    inner: 'pv3 pr3',
    outer: 'bb b--black-20 dim black-70 pointer',
  },
};

// `category` can be one of:
//   - 'own' - narratives created by the current user
//   - 'shared' - narratives shared with the current user
//   - 'tutorials' - public narratives that are tutorials
//   - 'public' - all public narratives
function search(term, sortBy, category) {
  const query = {
    'bool': {'must': []}
  }
  if (term) {
    query['bool']['must'].push({
      multi_match: {
        query: term,
        fields: ['name', 'markdown_text', 'creator', 'app_names']
      }
    })
  }
  if (category === 'own') {
    // Apply a filter on the creator to match the current username
    query['bool']['must'].push({'term': {'creator': window._env.username}});
  } else if (category === 'public') {
    query['bool']['must'].push({'term': {'is_public': true}});
  }

  if (sortBy) {
    const sort = [];
    if (sortBy === 'Newest') {
      sort.push({timestamp: {order: 'desc'}});
    } else if (sortBy === 'Oldest') {
      sort.push({timestamp: {order: 'asc'}});
    }
    return searchObjects(query, sort);
  } else {
    return searchObjects(query);
  }
}

// Make a request to the search API to fetch narratives
function searchObjects(query, sort) {
  const params = {
    indexes: ['narrative'],
    size: 20,
    query
  }
  if (sort) {
    params.sort = sort;
  }
  return fetch(window._env.searchapi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({method: 'search_objects', params}),
    headers: {Authorization: window._env.token}
  })
    .then(resp => resp.json())
    .catch(err => console.error('Failed fetching search results:', err))
}
