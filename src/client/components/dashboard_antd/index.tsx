import React from 'react';
import ReactDOM from 'react-dom';
import { DatePicker, message } from 'antd';
import 'antd/dist/antd.css';

interface State {
  date: Date | null;
}

interface Props {}

// Ant design version of the dashboard
export class DashboardAntd extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { date: null };
  }

  render() {
    const { date } = this.state;
    return (
      <div style={{ width: 400, margin: '100px auto' }}>
        <DatePicker />
        <div style={{ marginTop: 20 }}>
          Selected Date: {date ? String(date) : 'None'}
        </div>
      </div>
    );
  }
}

const mountNode = document.getElementById('dashboard-antd');

if (mountNode) {
  ReactDOM.render(<DashboardAntd />, mountNode);
}
