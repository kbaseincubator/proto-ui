import {Component, h} from 'preact';

// Components
import {TabHeader} from '../../TabHeader';
import {Filters} from './Filters';
import {ItemList} from './ItemList';
import {NarrativeDetails} from './NarrativeDetails';

// Utils
import {updateProp} from '../../../utils/updateProp';
import {searchNarratives} from '../../../utils/searchNarratives';

// Page length of search results
const PAGE_SIZE = 20;

export class NarrativeList extends Component {
  static createState({update}) {
    const state = {update};
    state.itemList = ItemList.createState({update: updateProp(state, 'itemList')});
    state.filters = Filters.createState({update: updateProp(state, 'filters')});
    state.tabs = TabHeader.createState({
      tabs: [
        'My narratives',
        'Shared with me',
        'Tutorials',
        'Public',
      ],
      selectedIdx: 3,
      update: updateProp(state, 'tabs'),
    });
    state.narrativeDetails = NarrativeDetails.createState({
      update: updateProp(state, 'narrativeDetails'),
    });
    // Whenever the user selects an item in the list, activate it in the details
    state.itemList.emitter.on('selected', (item) => {
      NarrativeDetails.activate(item, state.narrativeDetails);
    });
    // Events from the filters or tabs that trigger a new search
    state.filters.emitter.on('searchBy', () => {
      NarrativeList.newSearch(state);
    });
    state.filters.emitter.on('sortBy', () => {
      NarrativeList.newSearch(state);
    });
    state.tabs.emitter.on('tabSelected', () => {
      // Clear the search results before re-fetching for the new tab
      ItemList.setItems([], 0, state.itemList);
      NarrativeDetails.activate(null, state.narrativeDetails);
      NarrativeList.newSearch(state);
    });
    // Handle the ItemList's "load more" click action
    state.itemList.emitter.on('wantsMore', () => {
      NarrativeList.loadMore(state);
    });
    // Perform an initial search on pageload and set data for the itemList
    NarrativeList.newSearch(state);
    return state;
  }

  // After receiving search results, overwrite the itemlist and set the
  // narrative details to the first item. Takes the fetch promise from
  // performSearch.
  static newSearch(state) {
    NarrativeList.performSearch({skip: 0, pageSize: PAGE_SIZE}, state)
        .then((resp) => {
          if (resp && resp.hits) {
            const total = resp.hits.total;
            const items = resp.hits.hits;
            ItemList.setItems(items, total, state.itemList);
            NarrativeDetails.activate(items[0], state.narrativeDetails);
          }
        });
  }

  // Load additional results into the itemList (aka the "load more" button)
  static loadMore(state) {
    const currentPage = state.itemList.currentPage;
    ItemList.loading(state.itemList);
    const skip = currentPage * PAGE_SIZE;
    NarrativeList.performSearch({pageSize: PAGE_SIZE, skip}, state)
        .then((resp) => {
          if (resp && resp.hits) {
            const total = resp.hits.total;
            const items = resp.hits.hits;
            ItemList.appendItems(items, total, state.itemList);
            ItemList.notLoading(state.itemList);
          }
        });
  }

  // Perform a search and return the Promise for the fetch
  static performSearch({skip, pageSize}, state) {
    Filters.toggleLoading(state.filters);
    ItemList.loading(state.itemList);
    // map from tab text to a more canonical name
    const catName = state.tabs.selected;
    const categoryMap = {
      'My narratives': 'own',
      'Shared with me': 'shared',
      'Tutorials': 'tutorials',
      'Public': 'public',
    };
    // Apply a search filter based on a tab name ("my narratives", "shared with me", etc)
    if (!(catName in categoryMap)) {
      throw new Error('Invalid category name: ' + catName);
    }
    const term = state.filters.search.value;
    const sort = state.filters.sort.selected;
    return searchNarratives({term, sort, category: categoryMap[catName], skip, pageSize})
        .finally(() => {
          Filters.toggleLoading(state.filters);
          ItemList.notLoading(state.itemList);
        });
  }

  render(props) {
    const {tabs, itemList, narrativeDetails, filters} = props.state;
    const newNarrativeHref = window._env.narrative + '/#narrativemanager/new';
    return (
      <div>
        <div className='flex justify-between'>
          {/* Tab sections */}
          <div className='pt2'>
            <TabHeader state={tabs} />
          </div>

          {/* New narrative button */}
          <a className='pointer dim dib pa2 white br2 b bg-green dib no-underline'
            style={{marginTop: '1rem', height: '2.25rem'}}
            href={newNarrativeHref}>
            <i className="mr1 fas fa-plus"></i> New Narrative
          </a>
        </div>

        <div className='ba b--black-20'>
          {/* Search, sort, filter */}
          <Filters state={filters} />

          {/* Narrative listing and side-panel details */}
          <div className='flex'>
            <ItemList state={itemList} />
            <NarrativeDetails state={narrativeDetails} />
          </div>
        </div>
      </div>
    );
  }
}
