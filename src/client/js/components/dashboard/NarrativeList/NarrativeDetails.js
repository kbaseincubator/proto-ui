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
    state.update(newState);
    state.emitter.emit('activated', item);
  }

  render() {
    const state = this.props.state;
    const {activeItem} = state;
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
        {extendedDetailsView(data, state)}
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
        <dt className="dib b">Last saved</dt>
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
  );
}

// Further details about the narratives, such as markdown content and apps
// Receives the NarrativeDetails state object
function extendedDetailsView(data, state) {
  let preview = '';
  if (data.markdown_text && data.markdown_text.length) {
    // Style rules for the text preview box
    const textStyle = {
      whiteSpace: 'pre-wrap',
      maxHeight: '12rem',
      textOverflow: 'ellipsis',
      overflowY: 'auto',
      overflowX: 'hidden',
    };
    preview = (
      <div>
        <h3>Text Preview</h3>
        <div className='f6 pa2 bg-black-05 ba b--black-10' style={textStyle}>
          {data.markdown_text}
        </div>
      </div>
    );
  }
  let appNames = '';
  if (data.app_names && data.app_names.length) {
    let names = data.app_names;
    if (names.length > 20) {
      names = names.slice(0, 20);
      const diff = data.app_names.length - 20;
      names.push(`(and ${diff} more...)`);
    }
    appNames = (
      <div>
        <h3>App Runs</h3>
        <ul>
          { names.map((str) => (<li key={str}>{str}</li>)) }
        </ul>
      </div>
    );
  }
  return (
    <div>
      {preview}
      {appNames}
    </div>
  );
}
