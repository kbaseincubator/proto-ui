import {Component, h} from 'preact';

// Components
import {TabHeader} from '../../TabHeader';
import {Filters} from './Filters';
import {ItemList} from './ItemList';
import {NarrativeDetails} from './NarrativeDetails';

// Utils
import {updateProp} from '../../../utils/updateProp';

export class NarrativeList extends Component {
  static createState({update}) {
    const state = {update};
    state.itemList = ItemList.createState({
      update: updateProp(state, 'itemList')
    });
    state.filters = Filters.createState({
      update: updateProp(state, 'filters')
    });
    state.tabs = TabHeader.createState({
      tabs: [
        'My narratives',
        'Shared with me',
        'Tutorials',
        'Public',
      ],
      selectedIdx: 0,
      update: updateProp(state, 'tabs')
    });
    state.narrativeDetails = NarrativeDetails.createState({
      update: updateProp(state, 'narrativeDetails')
    });
    // Whenever the item list fetches, show the first item in narrative details
    state.itemList.emitter.on('fetched', (results) => {
      const items = results.hits.hits;
      NarrativeDetails.activate(items[0], state.narrativeDetails);
    });
    state.itemList.emitter.on('selected', (item) => {
      NarrativeDetails.activate(item, state.narrativeDetails);
    })
    // When a search term is entered in filters, fetch in itemList
    state.filters.emitter.on('searched', (term) => {
      ItemList.searchBy(term, state.itemList);
    });
    // When a sort option is selected in the filters, fetch
    state.filters.emitter.on('sortBy', (sortBy) => {
      ItemList.sortBy(sortBy, state.itemList);
    });
    // When a tab is selected, send the tab name to the itemList to re-fetch items
    state.tabs.emitter.on('tabSelected', (tabState) => {
      const catName = tabState.tabs[tabState.selectedIdx];
      ItemList.applyCategory(catName, state.itemList);
    });
    /*
    // When an author is selected in the filters, re-fetch the item list
    filters.emitter.on('selectedAuthor', author => {
      itemList.searchByAuthor(author);
    });
    // When a filter sort option is selected, then re-fetch the item list
    filters.emitter.on('selectedSort', sortOption => {
      itemList.sortBy(sortOption);
    });
    // When a tab is selected, fetch the item list according to the tab's category
    tabs.emitter.on('selectTab', tab => {
      itemList.searchByCategory(tab);
    });
    */
    return state;
  }

  render(props) {
    const {tabs, itemList, narrativeDetails, filters} = props.state;
    return (
      <div>
        <div className='flex justify-between'>
          {/* Tab sections */}
          <div className='pt2'>
            <TabHeader state={tabs} />
          </div>

          {/* New narrative button */}
          <a className='pointer dim dib pa2 white br2 b bg-green dib'
            style={{marginTop: '1rem', height: '2.25rem'}}>
            <i className="mr1 fas fa-plus"></i> New Narrative
          </a>
        </div>

        <div className='ba b--black-20'>
          {/* Search, sort, filter */}
          <Filters state={filters} />

          {/* Narrative listing and side-panel details */}
          <div className='pa3 flex'>
            <ItemList state={itemList} />
            <NarrativeDetails state={narrativeDetails} />
          </div>
        </div>
      </div>
    );
  }
}
