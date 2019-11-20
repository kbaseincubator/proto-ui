import React, { Component } from 'react';

interface Props {
  // profile data
  // organizations
  // narratives
}

interface State {}

export class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
    this.getProfile = this.getProfile.bind(this);
  }
  componentDidMount() {
    this.getProfile();
  }

  componentDidUpdate() {}

  async getProfile() {}

  render() {
    return <div>"WORKING?"</div>;
  }
}
