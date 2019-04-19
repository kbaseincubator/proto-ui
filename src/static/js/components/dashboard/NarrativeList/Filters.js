// NPM
import {Component, h} from 'preact';
import mitt from 'mitt';

// Components
import {FilterDropdown} from '../../FilterDropdown';
import {SearchInput} from '../../SearchInput';

// Utils
import {updateProp} from '../../../utils/updateProp';

export class Filters extends Component {
  static createState({update}) {
    const state = {update, searchTerm: '', emitter: mitt()};
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
    state.search = SearchInput.createState({
      update: updateProp(state, 'search')
    });
    state.search.emitter.on('searched', (value) => {
      Filters.handleSearch(value, state);
    });
    state.sort.emitter.on('selected', (sortBy) => {
      // Bubble up the sort selection to the parent (NarrativeList)
      state.emitter.emit('sortBy', sortBy);
    });
    return state;
  }

  static handleSearch (val, state) {
    const updater = () => {
      state.update(Object.assign(state, {searchTerm: val}));
      state.emitter.emit('searched', val);
    };
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(updater, 100);
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
