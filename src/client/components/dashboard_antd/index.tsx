import React from 'react';
import ReactDOM from 'react-dom';
import { List, Avatar, Tabs, Input, Menu, Dropdown, Icon, Col, Row } from 'antd';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;
const { Search } = Input;

import {
  searchNarratives,
  SearchParams,
} from '../../utils/searchNarratives';
import { getUsername } from '../../utils/auth';

interface NarrativeItem {
  title: string;
  desc: string;
}

export interface SearchResult {
  _source: {
    narrative_title: string,
    creator: string,
    creation_date: string
  }
}

interface State {
  searchParams: SearchParams;
  loading: boolean;
  items: Array<NarrativeItem>;
}

interface Props {}

const PAGE_SIZE = 20;

// Ant design version of the dashboard
export class DashboardAntd extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchParams: {
        term: 'test',
        sort: 'Newest',
        category: 'own',
        skip: 0,
        pageSize: PAGE_SIZE,
      },
      items: [],
      loading: false,
    };
  }

  componentDidMount() {
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
            return {
              title: item._source.narrative_title,
              desc: `Created on ${item._source.creation_date} by ${item._source.creator}`
            }
          })
          this.setState({ items: items })
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

  handleTabChange() {
    console.log('tab change');
  }

  render() {
    // const {} = this.state;
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
      <Col span={12} style={{ padding: '2rem' }}>
        <Tabs onChange={this.handleTabChange.bind(this)} type="card">
          <TabPane tab="My narratives" key="1">
          </TabPane>
          <TabPane tab="Shared with me" key="2">
          </TabPane>
          <TabPane tab="Tutorials" key="3">
          </TabPane>
          <TabPane tab="Public" key="4">
          </TabPane>
        </Tabs>

        <Row>
          <Col span={8}>
            <Search placeholder="Search narratives" onSearch={value => console.log(value)} enterButton />
          </Col>

          <Col span={12}/>

          <Col span={4}>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                Sort <Icon type="down" />
              </a>
            </Dropdown>
          </Col>
        </Row>

        <List
            itemLayout="horizontal"
            dataSource={this.state.items}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        title={<a href="http://spacejam.com">{item.title}</a>}
                        description={item.desc}
                    />
                </List.Item>
            )}
        />
      </Col>
    );
  }
}

const mountNode = document.getElementById('dashboard-antd');

if (mountNode) {
  ReactDOM.render(<DashboardAntd />, mountNode);
}
