import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

// Components
import { TabHeader } from '../../generic/TabHeader';
import { Filters } from './Filters';
import { ItemList } from './ItemList';
import { NarrativeDetails, NarrativeData } from './NarrativeDetails';
import { NarrativeTabPane } from './NarrativeTabPane';

//css
import './foo.css';

// Utils
import {
  searchNarratives,
  SearchParams,
} from '../../../utils/searchNarratives';
import { getUsername } from '../../../utils/auth';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
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
  handleTabChange(idx: number, name: string): void {
    console.log(idx);
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
        if (!resp.result) {
          return;
        }
        const result = resp.result;
        if (result.count) {
          const total = result.count;
          const items = result.hits;
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

  //Bootstrap handleTabChange work around
  bootstrapHandleTabChange(e: string) {
    switch (e) {
      case 'My narratives':
        return this.handleTabChange(0, e);
      case 'Shared with me':
        return this.handleTabChange(1, e);
      case 'Tutorials':
        return this.handleTabChange(2, e);
      case 'Public':
        return this.handleTabChange(3, e);
      default:
        return this.handleTabChange(0, 'My narratives');
    }
  }

  bootstrapTabContainer() {
    return (
      <div className="boostrap-tab-thing">
        <Navbar bg="light" variant="dark" className="justify-content-end">
          {/* <Nav.Link>{this.state.searchParams.sort}</Nav.Link> */}
          <DropdownButton
            title={`Sorted By: ${this.state.searchParams.sort}`}
            id="narrative-sort-dropdown"
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

  //  {
  //   <><div className="flex justify-between">
  //     {/* Tab sections */}
  //     <div className="pt2">
  //       <TabHeader
  //         tabs={['My narratives', 'Shared with me', 'Tutorials', 'Public']}
  //         onSelectTab={this.handleTabChange.bind(this)}
  //         selectedIdx={0}
  //       />
  //     </div>

  //     {/* New narrative button */}
  //     <a
  //       className="pointer dim dib pa2 white br2 b bg-dark-green dib no-underline"
  //       style={{ marginTop: '1rem', height: '2.25rem' }}
  //       href={NEW_NARR_URL}
  //     >
  //       <i className="mr1 fa fa-plus"></i> New Narrative
  //   </a>
  //   </div>

  //   <div className="ba b--black-20">
  //     {/* Search, sort, filter */}
  //     <Filters
  //       onSetSearch={this.handleSearch.bind(this)}
  //       loading={this.state.loading}
  //     />

  //     {/* Narrative listing and side-panel details */}
  //     <div className="flex">
  //       <ItemList
  //         selectedIdx={this.state.activeIdx}
  //         items={this.state.items}
  //         loading={this.state.loading}
  //         totalItems={this.state.totalItems}
  //         onLoadMore={this.handleLoadMore.bind(this)}
  //         onSelectItem={this.handleSelectItem.bind(this)}
  //       />

  //       <NarrativeDetails
  //         framework="vanillaJS"
  //         activeItem={this.state.items[this.state.activeIdx]}
  //       />
  //     </div>
  //   </div></>
  // }

  render() {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '30px',
          }}
        >
          <Form inline onSubmit={(e: any) => this.bootstrapSubmit(e)}>
            <FormControl
              type="text"
              id="narrative-search"
              placeholder="Search narratives"
            />
            <Button type="submit">Search</Button>
          </Form>
        </div>

        <Button className="forcefully-move-button">New Narrative</Button>
        <Tabs
          defaultActiveKey="My narratives"
          id="narrative-tabs"
          onSelect={(e: string) => this.bootstrapHandleTabChange(e)}
        >
          <Tab title="My narratives" key={0} eventKey="My narratives">
            {this.bootstrapTabContainer()}
          </Tab>
          <Tab title="Shared with me" key={1} eventKey="Shared with me">
            {this.bootstrapTabContainer()}
          </Tab>
          <Tab title="Tutorials" key={2} eventKey="Tutorials">
            {this.bootstrapTabContainer()}
          </Tab>
          <Tab title="Public" key={3} eventKey="Public">
            {this.bootstrapTabContainer()}
          </Tab>
        </Tabs>

        <div
          className="sample-tab-and-spinner"
          style={{ marginTop: '30px', visibility: 'hidden' }}
        >
          <h3>Basic Sample 1</h3>
          <p>
            This is how tabs looks like straight out of bootstrap
            <br />
            This doesn't require extra javascript to switch from one tab to the
            other which is nice
            <br />
            Align anything on the tab like this New Narrative button must be
            forced. Not too bad tho.{' '}
          </p>
          <Button className="forcefully-move-button">New Narrative</Button>
          <Tabs defaultActiveKey="My narratives" id="narrative-tabs-demo">
            <Tab title="OMG SPINNERS" eventKey="My narratives">
              <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-danger" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-info" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow text-dark" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </Tab>
            <Tab title="More Spinners!!!" eventKey="Shared with me">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-danger" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-info" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border text-dark" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </Tab>
            <Tab title="Spinners on Buttons" eventKey="Tutorials">
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Loading...</span>
              </button>
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            </Tab>
            <Tab title="Diffferent Sizes!!" eventKey="Public">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div
                className="spinner-grow"
                role="status"
                style={{ width: '4rem', height: '4rem' }}
              >
                <span className="sr-only">Loading...</span>
              </div>
              you can just add in line style to change size, too
            </Tab>
          </Tabs>
          <br />
          <h3>A bit more custom</h3>
          <p>It can be overridden pretty easily like this</p>
          <Tab.Container defaultActiveKey="My narratives">
            <Nav>
              <Nav.Item bsPrefix="fooClass">
                {' '}
                {/* this bsPrefix is dangerous  */}
                <Nav.Link eventKey="My narratives">My narratives</Nav.Link>
              </Nav.Item>
              <Nav.Item bsPrefix="fooClass">
                <Nav.Link eventKey="Shared with me">Shared with me</Nav.Link>
              </Nav.Item>
              <Nav.Item bsPrefix="fooClass">
                <Nav.Link eventKey="Tutorials">Tutorials</Nav.Link>
              </Nav.Item>
              <Nav.Item bsPrefix="fooClass">
                <Nav.Link eventKey="Public">Public</Nav.Link>
              </Nav.Item>
              <Form inline>
                <Button>New Narrative</Button>
              </Form>
            </Nav>
            <div>
              <Navbar
                bg="light"
                variant="dark"
                className="justify-content-between"
              >
                <Form inline>
                  <FormControl type="text" placeholder="Search" />
                  <Button variant="outline-primary">Search</Button>
                </Form>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Navbar>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="My narratives">
                <div>hahaha</div>
              </Tab.Pane>
              <Tab.Pane eventKey="Shared with me">
                <div>Papaapa</div>
              </Tab.Pane>
              <Tab.Pane eventKey="Tutorials">
                <div>lalala</div>
              </Tab.Pane>
              <Tab.Pane eventKey="Public">
                <div>yayayayayay</div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </>
    );
  }
}
