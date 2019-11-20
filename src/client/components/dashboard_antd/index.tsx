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
import { getWSTypeName } from '../../utils/getWSTypeName';
import { readableSnakeCase } from '../../utils/readableSnakeCase';

interface NarrativeItem {
  name: string;
  author: string;
  updated: string;
  created: string;
  key: string;
  cell_count: number;
  object_count: number;
  is_public: boolean;
  data: Array<{obj_type: string, name: string}>;
  cells: Array<{cell_type: string, desc: string}>;
}

export interface SearchResult {
  _source: {
    narrative_title: string,
    creator: string,
    creation_date: string,
    timestamp: number,
    access_group: number,
    obj_id: number,
    is_public: boolean;
    data_objects: Array<{obj_type: string, name: string}>;
    cells: Array<{cell_type: string, desc: string}>;
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
  {
    title: 'Updated',
    dataIndex: 'updated',
    sorter: true,
    defaultSortOrder: 'descend' as 'descend',
  }
];
const TABLE_COLS_DATA = [
  {
    title: 'Type',
    dataIndex: 'obj_type'
  },
  {
    title: 'Name',
    dataIndex: 'name'
  }
];
const TABLE_COLS_PREVIEW = [
  {
    title: 'Cell type',
    dataIndex: 'cell_type'
  },
  {
    title: 'Content',
    dataIndex: 'desc'
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
// Mapping of cell type name to readable name

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
            const cells = item._source.cells.map((c: {desc: string, cell_type: string}) => {
              c.cell_type = readableSnakeCase(c.cell_type);
              return c;
            });
            const data = item._source.data_objects.map((c: {obj_type: string, name: string}) => {
              return {
                obj_type: getWSTypeName(c.obj_type),
                name: c.name
              };
            });
            return {
              name: item._source.narrative_title,
              author: item._source.creator,
              created: moment(item._source.creation_date).format(DATE_FORMAT),
              updated: moment(item._source.timestamp).format(DATE_FORMAT),
              key: `${item._source.access_group}/${item._source.obj_id}`,
              cell_count: item._source.cells.length,
              object_count: item._source.data_objects.length,
              is_public: item._source.is_public,
              data,
              cells,
            }
          })
          this.setState({
            items,
            selectedRowIdx: 0,
            totalItems: total
          })
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
      tabIdx: idx,
      searchParams,
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

  handleTableChange(pagination: Object, filters: Object, sorter: {field: string, order?: string}) {
    const searchParams = this.state.searchParams;
    if (sorter.order === 'ascend') {
      searchParams.sort = 'Least recently updated';
    } else {
      searchParams.sort = 'Recently updated';
    }
    searchParams.skip = 0;
    this.setState({searchParams, page: 0});
    this.performSearch();
  }

  handleDetailsTabChange(key: string) {
    const idx = Number(key);
    this.setState({
      detailsTabIdx: idx
    });
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
      <div style={{padding: '2rem', minWidth: '1024px', maxWidth: '1280px' }}>
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
                onChange={this.handleTableChange.bind(this)}
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
    <Col span={12} style={{ position: 'sticky', top: '1rem' }}>
      <h3>{ item.name }</h3>
      <Tabs
        defaultActiveKey="0"
        onChange={cmp.handleDetailsTabChange.bind(cmp)}
      >
        <TabPane tab="Overview" key="0" />
        <TabPane tab="Data" key="1" />
        <TabPane tab="Preview" key="2" />
      </Tabs>
      { cmp.state.detailsTabIdx === 0 ? detailsOverview(item) : '' }
      { cmp.state.detailsTabIdx === 1 ? detailsData(item) : '' }
      { cmp.state.detailsTabIdx === 2 ? detailsPreview(item) : '' }
    </Col>
  );
}

function detailsOverview(item: NarrativeItem) {
  return (
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
  );
}

function detailsData(item: NarrativeItem) {
  console.log({item});
  return (
    <Table
      columns={TABLE_COLS_DATA}
      dataSource={item.data}
    />
  );
}

function detailsPreview(item: NarrativeItem) {
  console.log({item});
  return (
    <Table
      columns={TABLE_COLS_PREVIEW}
      dataSource={item.cells}
    />
  );
}

const mountNode = document.getElementById('dashboard-antd');

if (mountNode) {
  ReactDOM.render(<DashboardAntd />, mountNode);
}
