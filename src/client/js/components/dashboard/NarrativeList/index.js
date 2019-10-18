import {Component, h} from 'preact';

// Components
import {TabHeader} from '../../generic/TabHeader';
import {Filters} from './Filters';
import {ItemList} from './ItemList';
import {NarrativeDetails} from './NarrativeDetails';

// Utils
import {searchNarratives} from '../../../utils/searchNarratives';

// Page length of search results
const PAGE_SIZE = 20;
const NEW_NARR_URL = window._env.narrative + '/#narrativemanager/new';

export class NarrativeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // List of narrative data
      items: props.items || [],
      // Currently active narrative result, selected on the left and shown on the right
      // This is unused if the items array is empty.
      activeIdx: 0,
      // parameters to send to the searchNarratives function
      searchParams: {
        term: '',
        sort: null,
        category: 'own',
        skip: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }

  componentDidMount() {
    this.performSearch();
  }

  // Handle an onSetSearch callback from Filters
  handleSearch({term, sort}) {
    const searchParams = this.state.searchParams;
    searchParams.term = term;
    searchParams.sort = sort;
    searchParams.skip = 0;
    this.setState({searchParams});
    this.performSearch();
  }

  // Handle an onSelectTab callback from TabHeader
  handleTabChange(idx, name) {
    // Reset the search state and results
    const searchParams = this.state.searchParams;
    searchParams.term = '';
    searchParams.skip = 0;
    const categoryMap = {
      'my narratives': 'own',
      'shared with me': 'shared',
      'tutorials': 'tutorials',
      'public': 'public',
    };
    // map from tab text to a more canonical name
    //  filter based on a tab name ("my narratives", "shared with me", etc)
    searchParams.category = categoryMap[name.toLowerCase()];
    // (leaving the searchParams.sort param alone)
    this.setState({
      items: [],
      activeIdx: 0,
      searchParams,
    });
    this.performSearch();
  }

  // Handle the onLoadMore callback from ItemList
  handleLoadMore() {
    const searchParams = this.state.searchParams;
    // Increment the skip size to be a multiple of the page size.
    searchParams.skip += PAGE_SIZE;
    this.setState({searchParams});
    this.performSearch();
  }

  // Handle an onSelectItem callback from ItemList
  // Receives the index of the selected item
  handleSelectItem(idx) {
    this.setState({activeIdx: idx});
  }

  // Perform a search and return the Promise for the fetch
  performSearch() {
    this.setState({loading: true});
    const searchParams = this.state.searchParams;
    return searchNarratives(searchParams)
        .then((resp) => {
          if (resp && resp.hits) {
            const total = resp.hits.total;
            const items = resp.hits.hits;
            // If we are loading a subsequent page, append to items. Otherwise, replace them.
            if (searchParams.skip > 0) {
              this.setState({items: this.state.items.concat(items), totalItems: total});
            } else {
              this.setState({items, totalItems: total});
            }
          }
        })
        .finally(() => {
          this.setState({loading: false, activeIdx: 0});
        });
    // TODO handle error from server
  }

  render(props) {
    return (
      <div>
        <div className='flex justify-between'>
          {/* Tab sections */}
          <div className='pt2'>
            <TabHeader
              tabs={['My narratives', 'Shared with me', 'Tutorials', 'Public']}
              onSelectTab={this.handleTabChange.bind(this)}
              selectedIdx={0} />
          </div>

          {/* New narrative button */}
          <a className='pointer dim dib pa2 white br2 b bg-green dib no-underline'
            style={{marginTop: '1rem', height: '2.25rem'}}
            href={NEW_NARR_URL}>
            <i className="mr1 fas fa-plus"></i> New Narrative
          </a>
        </div>

        <div className='ba b--black-20'>
          {/* Search, sort, filter */}
          <Filters onSetSearch={this.handleSearch.bind(this)} />

          {/* Narrative listing and side-panel details */}
          <div className='flex'>
            <ItemList
              items={this.state.items}
              loading={this.state.loading}
              totalItems={this.state.totalItems}
              onLoadMore={this.handleLoadMore.bind(this)}
              onSelectItem={this.handleSelectItem.bind(this)} />

            <NarrativeDetails activeItem={this.state.items[this.state.activeIdx]} />
          </div>
        </div>
      </div>
    );
  }
}
