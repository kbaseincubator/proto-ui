import {Component, h} from 'preact';

// Components
import {TabHeader} from '../../TabHeader';
import {Filters} from './Filters';
import {ItemList} from './ItemList';
import {NarrativeDetails} from './NarrativeDetails';

// Utils
import {updateProp} from '../../../utils/updateProp';

export class NarrativeList extends Component {
  static createState() {
    return {
      itemList: ItemList.createState(),
      tabs: TabHeader.createState({
        tabs: [
          'My narratives',
          'Shared with me',
          'Tutorials',
          'Public',
        ],
        selectedIdx: 0,
      }),
      narrativeDetails: NarrativeDetails.createState(),
      filters: Filters.createState(),
    };
  }

  render() {
    const {tabs, itemList, narrativeDetails, filters} = this.props;
    return (
      <div>
        <div className='flex justify-between'>
          {/* Tab sections */}
          <div className='pt2'>
            <TabHeader {...tabs} handleUpdate={updateProp(this, 'tabs')} />
          </div>

          {/* New narrative button */}
          <a className='pointer dim dib pa2 white br2 b bg-green dib'
            style={{marginTop: '1rem', height: '2.25rem'}}>
            <i className="mr1 fas fa-plus"></i> New Narrative
          </a>
        </div>

        <div className='ba b--black-20'>
          {/* Search, sort, filter */}
          <Filters {...filters} handleUpdate={updateProp(this, 'filters')} />

          {/* Narrative listing and side-panel details */}
          <div className='pa3 flex'>
            <ItemList {...itemList} handleUpdate={updateProp(this, 'itemList')} />
            <NarrativeDetails
              {...narrativeDetails}
              handleUpdate={updateProp(this, 'narrativeDetails')} />
          </div>
        </div>
      </div>
    );
  }
}
