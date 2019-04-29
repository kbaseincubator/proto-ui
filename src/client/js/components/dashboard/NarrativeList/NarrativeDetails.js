import {Component, h} from 'preact';
import mitt from 'mitt';

// Components
import {NarrativeExtendedDetails} from './NarrativeExtendedDetails';

// Utils
import {readableDate} from '../../../utils/readableDate';
import {updateProp} from '../../../utils/updateProp';

/**
 * Narrative details side panel in the narrative listing.
 */
export class NarrativeDetails extends Component {
  static createState({update}) {
    const state = {
      activeItem: null,
      update,
      emitter: mitt(),
    };
    state.extendedDetails = NarrativeExtendedDetails.createState({
      update: updateProp(state, 'extendedDetails'),
    });
    return state;
  }

  static activate(narrative, state) {
    // Make an item active
    const extendedDetails = NarrativeExtendedDetails.setNarrative(narrative, state.extendedDetails);
    const newState = Object.assign(state, {
      activeItem: narrative,
      extendedDetails,
    });
    state.update(newState);
  }

  render() {
    const state = this.props.state;
    const {activeItem, extendedDetails} = state;
    if (!activeItem) {
      return (<div></div>);
    }
    const data = activeItem._source;
    const wsid = data.upa.split(':')[0];
    const narrativeHref = window._env.narrative + '/narrative/' + wsid;
    return (
      <div className='w-60 h-100 bg-white pv2 ph3' style={{position: 'sticky', top: '1rem'}}>

        <div className='flex justify-between mb3'>
          <h4 className='ma0 pa0 pt2 f4'>
            <a className='blue pointer no-underline dim' href={narrativeHref}>
              { data.name }
              <i className='fas fa-external-link-alt ml2 black-20'></i>
            </a>
          </h4>
        </div>

        {/*
          <div className='flex mb3'>
           * Left out for now because this functionality is a pain.
           *  - Share button needs to make a call to the workspace, and we'd have
           *    to build a UI around searching and selecting users.
           *  - Copy button needs to make a call to the "Narrative Service"
           *  dynamic service, which has a copy narrative method. To get the
           *  dyn service url, we'd need to make a call first to the service
           *  wizard. Blech.
           *
           *  A better way to do all this would be to have narrative urls for
           *  copy and share that open up their respective modals.
          <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
            <i className="mr1 fas fa-share"></i>
            Share
          </a>
          <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
            <i className="mr1 fas fa-copy"></i>
            Copy
          </a>
          </div>
        */}
        {basicDetailsView(data)}
        <NarrativeExtendedDetails state={extendedDetails} />
      </div>
    );
  }
}

// Basic details, such as author, dates, etc.
// Receives the narrative data from elasticsearch results for a single entry.
function basicDetailsView(data) {
  return (
    <div className='mb3'>
      <dl className="ma0 flex justify-between bb b--black-20 pv2">
        <dt className="dib b">Author</dt>
        <dd className="dib ml0 grau tr black-70">{ data.creator }</dd>
      </dl>
      <dl className="ma0 flex justify-between bb b--black-20 pv2">
        <dt className="dib b">Created on</dt>
        <dd className="dib ml0 grau tr black-70">{ readableDate(data.creation_date) }</dd>
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
        <dd className="dib ml0 grau tr black-70">{ data.shared_users.length ? 'Yes' : 'No' }</dd>
      </dl>
    </div>
  );
}
