// NPM
import {Component, h} from 'preact';
import mitt from 'mitt';

// Components
import {FilterDropdown} from '../../FilterDropdown';
import {SearchInput} from '../../SearchInput';

// Utils
import {updateProp} from '../../../utils/updateProp';

// Filter bar for searching and sorting data results
// methods:
//   searchBy - set the search value
//   sortBy - set the sort value
// emits:
//  - sortBy (val)
//  - searchBy (val)
export class Filters extends Component {
  static createState({update}) {
    const state = {update, emitter: mitt()};
    state.sort = FilterDropdown.createState({
      txt: 'Sorting',
      selected: 'Newest',
      items: [
        'Newest',
        'Oldest',
        'Recently updated',
        'Least recently updated',
      ],
      update: updateProp(state, 'sort')
    });
    state.search = SearchInput.createState({update: updateProp(state, 'search')});
    // Bubble up the search event
    state.search.emitter.on('searched', (value) => {
      state.emitter.emit('searchBy', value);
    });
    // Bubble up the sort selection event
    state.sort.emitter.on('selected', (sortBy) => {
      state.emitter.emit('sortBy', sortBy);
    });
    return state;
  }

  static searchBy(val, state) {
    SearchInput.setVal(val, state.search);
  }

  static toggleLoading(state) {
    SearchInput.toggleLoading(state.search);
  }

  render() {
    const {author, sort, search} = this.props.state;
    return (
      <div className='bg-light-gray flex justify-between'>
        {/* Left-aligned actions */}
        <div className='pa3'>
          <SearchInput state={search} />
        </div>

        {/* Right-aligned actions */}
        <div className='pa2'>
          <FilterDropdown state={sort} />
        </div>
      </div>
    );
  }
}
