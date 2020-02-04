import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

// Components
import { NarrativeData } from './NarrativeDetails';
import { NarrativeTabPane } from './NarrativeTabPane';

//css
//import './foo.css';
import '../../../scss/custom.scss';


// Utils
import {
  searchNarratives,
  SearchParams,
} from '../../../utils/searchNarratives';
import { getUsername } from '../../../utils/auth';

// CSS
//import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';

// Page length of search results
const PAGE_SIZE = 20;
const NEW_NARR_URL = window._env.narrative + '/#narrativemanager/new';

interface State {
  // Whether we are loading data from the server
  loading: boolean;
  // List of objects of narrative details
  items: Array<NarrativeData>;
  totalItems: number;
  // Currently activated narrative details
  activeIdx: number;
  // Parameters to send to searchNarratives
  searchParams: SearchParams;
}

interface Props {
  items?: Array<any>;
}

// This is a parent component to everything in the narrative browser (tabs,
// filters, search results, details, etc)
export class NarrativeList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      totalItems: props.items ? props.items.length : 0,
      loading: false,
      // List of narrative data
      items: props.items || [],
      // Currently active narrative result, selected on the left and shown on the right
      // This is unused if the items array is empty.
      activeIdx: 0,
      // parameters to send to the searchNarratives function
      searchParams: {
        term: '',
        sort: 'Newest',
        category: 'own',
        skip: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }

  componentDidMount() {
    // FIXME this is redundant with client/index.tsx
    getUsername(username => {
      window._env.username = username;
      this.performSearch();
    });
  }

  // Handle an onSetSearch callback from Filters
  handleSearch(searchP: { term: string; sort: string }): void {
    const searchParams = this.state.searchParams;
    searchParams.term = searchP.term;
    searchParams.sort = searchP.sort;
    searchParams.skip = 0;
    this.setState({ searchParams });
    this.performSearch();
  }
  // TODO: New function replace this
  // user enums instead of const categoryMap

  // Handle an onSelectTab callback from TabHeader
  handleTabChange(name: string): void {
    // Reset the search state and results
    const searchParams = this.state.searchParams;
    searchParams.term = '';
    searchParams.skip = 0;
    const categoryMap: { [key: string]: string } = {
      'my narratives': 'own',
      'shared with me': 'shared',
      tutorials: 'tutorials',
      public: 'public',
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
    this.setState({ searchParams });
    this.performSearch();
  }

  // Handle an onSelectItem callback from ItemList
  // Receives the index of the selected item
  handleSelectItem(idx: number) {
    this.setState({ activeIdx: idx });
  }

  // Perform a search and return the Promise for the fetch
  performSearch() {
    this.setState({ loading: true });
    const searchParams = this.state.searchParams;
    return searchNarratives(searchParams)
      .then((resp: any) => {
        resp = resp.result;
        console.log(resp)
        if (resp && resp.hits) {
          const total = resp.count;
          const items = resp.hits;
          // If we are loading a subsequent page, append to items. Otherwise, replace them.
          if (searchParams.skip > 0) {
            this.setState({
              items: this.state.items.concat(items),
              totalItems: total,
            });
          } else {
            this.setState({ items, totalItems: total });
          }
        }
      })
      .finally(() => {
        this.setState({ loading: false });
        if (searchParams.skip === 0) {
          this.setState({ activeIdx: 0 });
        }
      });
    // TODO handle error from server
  }

  bootstrapTabContainer() {
    return (
      <div className="boostrap-tab-container">
        <Navbar bg="primary" variant="dark" className="justify-content-between">
            <Nav>
          <Form inline onSubmit={(e: any) => this.bootstrapSubmit(e)}>
            <FormControl
              className="narrative-search-input"
              type="text"
              id="narrative-search"
              placeholder="Search narratives"
              size="sm"
            />
          </Form>
          </Nav>
          <Nav>
          <DropdownButton
            className="justify-content-ene"
            title={`Sorted By: ${this.state.searchParams.sort}`}
            id="narrative-sort-dropdown"
            variant='primary'
            onSelect={(eventKey: string) => {
              this.bootstrapDropDownChange(eventKey);
            }}
          >
            <Dropdown.Item eventKey="Newest">Newest</Dropdown.Item>
            <Dropdown.Item eventKey="Oldest">Oldest</Dropdown.Item>
            <Dropdown.Item eventKey="Recently updated">
              Recently updated
            </Dropdown.Item>
            <Dropdown.Item eventKey="Last recently updated">
              Last recently updated
            </Dropdown.Item>
          </DropdownButton>
          </Nav>
        </Navbar>
        <NarrativeTabPane
          items={this.state.items}
          loading={this.state.loading}
          totalItems={this.state.totalItems}
          selectedIdx={this.state.activeIdx}
          onLoadMore={this.handleLoadMore.bind(this)}
          onSelectItem={this.handleSelectItem.bind(this)}
        />
      </div>
    );
  }
  bootstrapSubmit(e: any) {
    e.preventDefault();
    e.stopPropagation();
    let inputEle = document.getElementById(
      'narrative-search'
    ) as HTMLInputElement;
    this.handleSearch({
      term: inputEle?.value,
      sort: this.state.searchParams.sort,
    });
  }

  bootstrapDropDownChange(eventKey: string) {
    this.handleSearch({ term: this.state.searchParams.term, sort: eventKey });
  }


  render() {
    return (
      <>
        <Tab.Container defaultActiveKey="My narratives" onSelect={(eventKey: string) => this.handleTabChange(eventKey)}>
          <Nav fill variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="My narratives">My narratives</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Shared with me">Shared with me</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Tutorials">Tutorials</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Public">Public</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="white-font" style={{height: "44px"}}><button className="fab-add"><i className="fa fa-plus" style={{width:'1rem'}}></i></button><section style={{display: 'inline', paddingBottom: "10px", verticalAlign: "super"}}>Create narrative</section></Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="My narratives">{this.bootstrapTabContainer()}</Tab.Pane>
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="Shared with me">{this.bootstrapTabContainer()}</Tab.Pane>
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="Tutorials">{this.bootstrapTabContainer()}</Tab.Pane>
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="Public">{this.bootstrapTabContainer()}</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </>
    );
  }
}
