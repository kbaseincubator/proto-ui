import {Component, h} from 'preact';
import mitt from 'mitt';

// Utils
import {readableDate} from '../../../utils/readableDate';

/**
 * Narrative details side panel in the narrative listing.
 */
export class NarrativeDetails extends Component {
  static createState({update}) {
    return {activeItem: null, update, emitter: mitt()};
  }

  static activate(item, state) {
    // Make an item active
    const newState = Object.assign(state, {activeItem: item});
    state.update(state);
    state.emitter.emit('activated', item);
  }

  render() {
    const {activeItem} = this.props.state;
    if (!activeItem) {
      return (
        <div className='pa3 pv5'>No results found</div>
      );
    }
    const data = activeItem._source;
    const wsid = data.upa.split(':')[0];
    return (
      <div className='w-60 h-100 bg-white pv2 ph3' style={{position: 'sticky', top: '1rem'}}>
        <h4 className='mt0 pa0 f4'>
          <a className='blue pointer'>
            { data.name }
          </a>
        </h4>

        <div className='flex mb3'>
          <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80 no-underline'
            href={window._env.narrative + '/narrative/' + wsid} >
            <i className="mr1 fas fa-external-link-alt"></i>
            Open
          </a>
          <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
            <i className="mr1 fas fa-share"></i>
            Share
          </a>
          <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
            <i className="mr1 fas fa-copy"></i>
            Copy
          </a>
        </div>

        <div className='mw6'>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Author</dt>
            <dd className="dib ml0 grau tr black-70">{ data.creator }</dd>
          </dl>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Creation date</dt>
            <dd className="dib ml0 grau tr black-70">{ readableDate(data.timestamp) }</dd>
          </dl>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Total cells</dt>
            <dd className="dib ml0 grau tr black-70">{ data.total_cells }</dd>
          </dl>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Visibility</dt>
            <dd className="dib ml0 grau tr black-70">{ data.is_public ? 'Public' : 'Private' }</dd>
          </dl>
          <dl className="ma0 flex justify-between pv2">
            <dt className="dib b">Shared</dt>
            <dd className="dib ml0 grau tr black-70">{ data.shared ? 'Yes' : 'No' }</dd>
          </dl>
        </div>
      </div>
    );
  }
}
