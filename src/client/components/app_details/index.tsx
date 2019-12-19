import React, { Component } from 'react';
import { History } from 'history';

interface Props {
  history: History;
}

interface State {}

export class AppDetails extends Component<Props, State> {
  history: History;

  constructor(props: Props) {
    super(props);
    this.history = props.history;
  }

  render() {
    return <p>App Details placeholder</p>;
  }
}
