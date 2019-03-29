import {Component, h} from 'preact';

// Utils
import {readableDate} from '../../../utils/readableDate';

/**
 * Narrative details side panel in the narrative listing.
 */
export class NarrativeDetails extends Component {
  static createState() {
    return {activeItem: null};
  }

  render() {
    const {activeItem} = this.props;
    if (!activeItem) {
      return (
        <div className='pa3'>No results found</div>
      );
    }
    const {data} = activeItem;
    return (
      <div className='w-60 h-100 bg-white pv2 ph3' style={{position: 'sticky', top: '1rem'}}>
        <h4 className='mt0 pa0 f4'>
          <a className='blue pointer'>
            { data.title }
          </a>
        </h4>

        <div className='flex mb3'>
          <a className='pointer dim ba b--black-30 pa2 br2 dib mr2 black-80'>
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
            <dd className="dib ml0 grau tr black-70">{ data.author }</dd>
          </dl>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Creation date</dt>
            <dd className="dib ml0 grau tr black-70">{ readableDate(data.created_at) }</dd>
          </dl>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Last updated</dt>
            <dd className="dib ml0 grau tr black-70">{ readableDate(data.saved_at) }</dd>
          </dl>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Total cells</dt>
            <dd className="dib ml0 grau tr black-70">{ data.total_cells }</dd>
          </dl>
          <dl className="ma0 flex justify-between bb b--black-20 pv2">
            <dt className="dib b">Visibility</dt>
            <dd className="dib ml0 grau tr black-70">{ data.visibility }</dd>
          </dl>
          <dl className="ma0 flex justify-between pv2">
            <dt className="dib b">Share count</dt>
            <dd className="dib ml0 grau tr black-70">{ data.share_count }</dd>
          </dl>
        </div>
      </div>
    );
  }
}
