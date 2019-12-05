import React, { Component } from 'react';
import { History, UnregisterCallback } from 'history';

interface RouterProps {
  history: History;
}

interface RouterState {}

// URL routing component
export class Router extends Component<RouterProps, RouterState> {
  history: History;
  historyUnlisten?: UnregisterCallback;

  constructor(props: RouterProps) {
    super(props);
    this.history = props.history;
    this.state = {};
  }

  componentDidMount() {
    this.historyUnlisten = this.history.listen((location, action) => {
      // Re-render
      this.setState({});
    });
  }

  componentWillUnmount() {
    if (this.historyUnlisten) {
      this.historyUnlisten();
    }
  }

  render() {
    if (this.props.children) {
      let route: any = null;
      React.Children.forEach(this.props.children, (child: any, idx) => {
        if (route || !child || !(typeof child === 'object')) {
          return;
        }
        if (child.type && child.type !== Route) {
          throw new Error('Router children must all be `Route` components.');
        }
        let path = child.props.path;
        if (typeof path === 'string') {
          path = new RegExp('^' + path + '$');
        }
        if (this.history.location.pathname.match(path)) {
          route = child;
        }
      });
      if (route && route.props && route.props.children) {
        return route.props.children;
      }
    }
    return '';
  }
}

interface RouteProps {
  path: string | RegExp;
}

interface RouteState {}

export class Route extends Component<RouteProps, RouteState> {}
