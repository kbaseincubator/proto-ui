import React, { Component } from 'react';

interface Props {
  // profile data
  // organizations
  // narratives
}

interface State {

}

interface Options {
  query: {
    bool: {
      must: Array<object>;
      must_not?: Array<object>;
    };
  };
  pageSize: number;
  auth?: boolean;
  sort?: Array<{ [key: string]: { [key: string]: string } } | string>;
  skip?: number;
  index_name: string;
}

export class Account extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      
    };
    this.getProfile = this.getProfile.bind(this);
  }
  componentDidMount(){
    this.getProfile()
  }

  componentDidUpdate(){
  }

  async getProfile(){

  }

  render() {
    return (
      <div>
        "WORKING?"
      </div>
    );
  }
}