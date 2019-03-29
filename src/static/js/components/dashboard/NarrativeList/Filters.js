// Narrative list filters
import {Component, h} from 'preact';

// Components
import {FilterDropdown} from '../../FilterDropdown';
import {SearchInput} from '../../SearchInput';

// Utils
import {updateProp} from '../../../utils/updateProp';

export class Filters extends Component {
  static createState() {
    return {
      searchTerm: '',
      author: FilterDropdown.createState({
        txt: 'Author',
        selected: 'Any',
        items: ['Any', 'user1', 'user2', 'user3'],
      }),
      sort: FilterDropdown.createState({
        txt: 'Sort',
        selected: 'Newest',
        items: [
          'Newest',
          'Oldest',
          'Recently updated',
          'Least recently updated',
        ],
      }),
      search: SearchInput.createState(),
    };
  }

  render() {
    const {author, sort, search} = this.props;
    return (
      <div className='bg-light-gray flex justify-between'>
        {/* Left-aligned actions */}
        <div className='pa3'>
          <SearchInput {...search} handleUpdate={updateProp(this, 'search')} />
        </div>

        {/* Right-aligned actions */}
        <div className='pa2'>
          <FilterDropdown {...author} handleUpdate={updateProp(this, 'author')} />
          <FilterDropdown {...sort} handleUpdate={updateProp(this, 'sort')} />
        </div>
      </div>
    );
  }
}
