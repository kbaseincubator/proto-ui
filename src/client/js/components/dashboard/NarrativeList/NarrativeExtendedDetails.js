import {Component, h} from 'preact';
import mitt from 'mitt';

/**
 * Narrative extended details:
 *  - summary of cells in the narrative
 *  - summary of data in the narrative
 */
export class NarrativeExtendedDetails extends Component {
  static createState({update}) {
    return {narrative: null, update, emitter: mitt()};
  }

  static setNarrative(narrative, state) {
    // Make an item active
    const newState = Object.assign(state, {narrative});
    state.update(newState);
    return newState;
  }

  render() {
    const state = this.props.state;
    const {narrative} = state;
    if (!narrative) {
      return (<div></div>);
    }
    const data = narrative._source;
    console.log('cells', data.cells);
    console.log('data_objects', data.data_objects);
    return (
      <div>
        {cellsView(data.cells, this)}
        {objsView(data.data_objects, this)}
      </div>
    );
  }
}

// Font-awesome class names for each narrative cell type
const cellIcons = {
  code_cell: 'fas fa-terminal f6',
  kbase_app: 'fas fa-cube',
  markdown: 'fas fa-paragraph',
  widget: 'fas fa-wrench',
};

// Human readable names for each cell type.
const cellNames = {
  code_cell: 'Code',
  markdown: 'Text',
  kbase_app: 'App',
  widget: 'Widget',
};

const readableDesc = {
  kbaseGenomeView: 'Genome Viewer',
};

function cellsView(cells, component) {
  const truncated = cells.slice(0, 20);
  const remaining = cells.length - 20;
  const rows = truncated.map((cell) => {
    const key = cell.desc + cell.cell_type;
    const faClass = cellIcons[cell.cell_type];
    return (
      <div key={key} className='mb2 flex'>
        <span className='dib pa2 mr2 tc br-100 bg-blue white w1 h1'>
          <i className={`${faClass} dib`}></i>
        </span>
        <span className='dib mr2 b' style={{width: '2.5rem'}}>
          {cellNames[cell.cell_type]}
        </span>
        <p className='ma0'>{readableDesc[cell.desc] || cell.desc}</p>
      </div>
    );
  });
  let remainingText = '';
  if (remaining > 0) {
    remainingText = (
      <p><a href='#'>{remaining} more cells in the narrative</a></p>
    );
  }
  return (
    <div>
      <h3>Overview</h3>
      {rows}
      {remainingText}
    </div>
  );
}

function objsView(objs, component) {
  const rows = objs.map((obj) => {
    const key = obj.name + obj.obj_type;
    return (
      <tr key={key}>
        <td>{obj.obj_type}</td>
        <td>{obj.name}</td>
      </tr>
    );
  });
  return (
    <table>
      {rows}
    </table>
  );
}
