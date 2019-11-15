import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Avatar, Tabs, Input, Menu, Icon, Col, Row, Descriptions } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';

const { TabPane } = Tabs;
const { Search } = Input;

import {
  searchNarratives,
  SearchParams,
} from '../../utils/searchNarratives';
import { getUsername } from '../../utils/auth';

interface NarrativeItem {
  name: string;
  author: string;
  updated: string;
  created: string;
  key: string;
  cell_count: number;
  object_count: number;
  is_public: boolean;
}

export interface SearchResult {
  _source: {
    narrative_title: string,
    creator: string,
    creation_date: string,
    timestamp: number,
    access_group: number,
    obj_id: number,
    cells: Array<Object>;
    data_objects: Array<Object>;
    is_public: boolean;
  }
}

interface State {
  searchParams: SearchParams;
  loading: boolean;
  items: Array<NarrativeItem>;
  selectedRowIdx: number;
  tabIdx: number;
  detailsTabIdx: number;
  page: number;
  totalItems: number;
}

interface Props {}


// -- Global constants
// Column configuration for the narrative table
const TABLE_COLS = [
  {
    title: 'Narrative',
    dataIndex: 'name'
  },
  {
    title: 'Author',
    dataIndex: 'author'
  },
  /*
  {
    title: 'Created',
    dataIndex: 'created'
  },
  */
  {
    title: 'Updated',
    dataIndex: 'updated'
  }
];
// Localized date format
// eg. 9/4/2019 8:30pm
const DATE_FORMAT = "L LTS"
// Background color for a selected row
const SELECTED_BG_COLOR = "#e6f7ff";
// Tab index to search category mapping
const TAB_CATEGORY_MAPPING = ['own', 'shared', 'tutorials', 'public'];
// Table pagination size
const PAGE_SIZE = 20;

// Ant design version of the dashboard
export class DashboardAntd extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchParams: {
        term: '',
        sort: 'Newest',
        category: 'own',
        skip: 0,
        pageSize: PAGE_SIZE,
      },
      items: [],
      loading: false,
      selectedRowIdx: 0,
      tabIdx: 0,
      detailsTabIdx: 0,
      page: 0,
      totalItems: 0
    };
  }

  componentDidMount() {
    // XXX redundant with client/index.tsx but we need the timing here
    getUsername()
      .then((username) => {
        window._env.username = username;
        this.performSearch();
      });
  }

  // Perform a search and return the Promise for the fetch
  performSearch() {
    this.setState({ loading: true });
    const searchParams = this.state.searchParams;
    return searchNarratives(searchParams)
      .then((resp: any) => {
        if (resp && resp.hits) {
          const total = resp.hits.total;
          const items = resp.hits.hits.map((item: SearchResult) => {
            console.log('item', item);
            return {
              name: item._source.narrative_title,
              author: item._source.creator,
              created: moment(item._source.creation_date).format(DATE_FORMAT),
              updated: moment(item._source.timestamp).format(DATE_FORMAT),
              key: `${item._source.access_group}/${item._source.obj_id}`,
              cell_count: item._source.cells.length,
              object_count: item._source.data_objects.length,
              is_public: item._source.is_public
            }
          })
          this.setState({
            items,
            selectedRowIdx: 0,
            totalItems: total
          })
          // If we are loading a subsequent page, append to items. Otherwise, replace them.
          if (searchParams.skip > 0) {
            /*
            this.setState({
              items: this.state.items.concat(items),
              totalItems: total,
            });
             */
          } else {
            /*
            this.setState({ items, totalItems: total });
            */
          }
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
    // TODO handle error from server
  }

  handleTabChange(key: string) {
    const idx = Number(key);
    console.log('tab change');
    const searchParams = this.state.searchParams;
    searchParams.category = TAB_CATEGORY_MAPPING[idx];
    searchParams.term = '';
    searchParams.skip = 0;
    this.setState({
      // items: [],
      tabIdx: idx,
      searchParams,
      // page: 0,
      // totalItems: 0
    });
    this.performSearch();
  }

  handleClickRow(idx: number) {
    this.setState({
      selectedRowIdx: idx
    })
  }

  handleSearch(term: string) {
    console.log('searching', term);
    const searchParams = this.state.searchParams;
    searchParams.term = term;
    this.setState({ searchParams });
    this.performSearch();
  }

  handlePageChange(page: number) {
    console.log('chagned page to', page);
    const searchParams = this.state.searchParams;
    searchParams.skip = page * PAGE_SIZE;
    this.setState({ page, searchParams });
    this.performSearch()
  }

  render() {
    const selected = this.state.items[this.state.selectedRowIdx];
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer">
            Newest
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer">
            Oldest
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer">
            Recently updated
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer">
            Least recently updated
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div style={{padding: '2rem', minWidth: '1024px' }}>
        <Tabs
          onChange={this.handleTabChange.bind(this)}
          type="card"
        >
          <TabPane tab="My narratives" key="0">
          </TabPane>
          <TabPane tab="Shared with me" key="1">
          </TabPane>
          <TabPane tab="Tutorials" key="2">
          </TabPane>
          <TabPane tab="Public" key="3">
          </TabPane>
        </Tabs>

        <Row>
          <Col span={12} style={{paddingRight: '2rem' }}>
            <Search
              allowClear
              placeholder="Search narratives"
              onSearch={this.handleSearch.bind(this)}
              enterButton
            />
          </Col>
        </Row>

        <Row style={{ marginTop: '2rem' }}>
          <Col span={12} style={{ paddingRight: '2rem' }}>
            <Table
                loading={this.state.loading}
                columns={TABLE_COLS}
                dataSource={this.state.items}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: ev => this.handleClickRow(rowIndex),
                    style: {
                      cursor: 'pointer',
                      backgroundColor: selected && selected.key === record.key ? SELECTED_BG_COLOR : 'white'
                    }
                  };
                }}
                pagination={{
                  current: this.state.page,
                  pageSize: PAGE_SIZE,
                  total: this.state.totalItems,
                  onChange: this.handlePageChange.bind(this)
                }}
            />
          </Col>

          { narrativeDetails(this, selected) }
        </Row>
      </div>
    );
  }
}


function narrativeDetails (cmp: DashboardAntd, item: NarrativeItem) {
  if (!item) {
    return (<div></div>);
  }
  return (
    <Col span={12}>
      <h3>{ item.name }</h3>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1" />
        <TabPane tab="Data" key="2" />
        <TabPane tab="Preview" key="3" />
      </Tabs>
      <Descriptions bordered layout="horizontal" column={1}>
        <Descriptions.Item label="Author">
          { item.author }
        </Descriptions.Item>
        <Descriptions.Item label="Created on">
          { item.created }
        </Descriptions.Item>
        <Descriptions.Item label="Total cells">
          { item.cell_count }
        </Descriptions.Item>
        <Descriptions.Item label="Data objects">
          { item.object_count }
        </Descriptions.Item>
        <Descriptions.Item label="Visibility">
          { item.is_public ? 'public' : 'private' }
        </Descriptions.Item>
      </Descriptions>
    </Col>
  );
}

const mountNode = document.getElementById('dashboard-antd');

if (mountNode) {
  ReactDOM.render(<DashboardAntd />, mountNode);
}
