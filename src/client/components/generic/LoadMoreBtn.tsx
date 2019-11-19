import React, { Component } from 'react';

interface Props {
  loading: boolean;
  itemCount?: number;
  totalItems?: number;
}

interface State {
  loading: boolean;
}

export class LoadMoreBtn extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: props.loading || false
    };
  }

  handleClick() {
    this.setState({ loading: !this.state.loading });
  }

  render() {
    const { totalItems = 0, itemCount = 0 } = this.props;
    const hasMore = itemCount < totalItems;
    if (!hasMore) {
      return <span className="black-50 pa3 dib tc">No more results.</span>;
    }
    if (this.state.loading) {
      return (
        <span className="black-60 pa3 tc dib">
          <i className="fa fa-cog fa-spin mr2"></i>
          Loading...
        </span>
      );
    }
    return (
      <a
        className="tc pa3 dib pointer blue dim b"
        onClick={this.handleClick.bind(this)}
      >
        Load more ({totalItems - itemCount} remaining)
      </a>
    );
  }
}
