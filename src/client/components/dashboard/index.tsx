import React, { Component } from 'react';
import { History } from 'history';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Components
import { NarrativeList } from './NarrativeList/index';
import { cpus } from 'os';

interface Props {
  history: History;
}

// Parent page component for the dashboard page
export class Dashboard extends Component<Props, {}> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col></Col>
          <Col lg={9} xl={8}><NarrativeList /></Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}
