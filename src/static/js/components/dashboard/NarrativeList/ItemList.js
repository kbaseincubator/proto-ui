// Narrative list header with tabs
import {Component, h} from 'preact';

// Components
// import {PaginationState} from '../../Pagination';

// Utils
import {sortBy} from '../../../utils/sortBy';

export class ItemList extends Component {
  static createState() {
    // TODO 'show more' style pagination
    return {items: [], activeItem: null};
  }

  fetchItems() {
    if (!this.props.handleUpdate) {
      return;
    }
    const totalItems = Math.floor(5 + Math.random() * 100);
    const items = generateRandomItems(totalItems);
    const activeItem = items[0];
    // Switch item details to the top of the current page
    // this.pagination.setTotalItems(totalItems);
    // this.pagination.jump(0);
    this.handleUpdate((state) => {
      return Object.assign(state, {items, activeItem});
    });
    if (this.props.onFetchItems) {
      this.props.onFetchItems(items);
    }
    if (this.props.onActivateItem) {
      this.props.onActivateItem(activeItem);
    }
  }

  search(term) {
    if (!this.props.handleUpdate) {
      return;
    }
    this.handleUpdate((state) => {
      const items = {state};
      if (term.trim() === '') {
        // Show all items. Clear out search.
        items.forEach((item) => {
          item.hidden = false;
        });
      } else {
        // Simple substring search.
        const t = term.toLowerCase();
        items.forEach((item) => {
          const title = item.data.title;
          item.hidden = title.toLowerCase().indexOf(t) === -1;
        });
      }
      const activeItem = items[0];
      return Object.assign(state, {items, activeItem});
    });
  }

  sortBy(option) {
    if (!this.handleUpdate) {
      return;
    }
    this.handleUpdate((state) => {
      const {items} = state;
      if (option === 'Newest') {
        sortBy(items, (i) => i.data.created_at).reverse();
      } else if (option === 'Oldest') {
        sortBy(items, (i) => i.data.created_at);
      } else if (option === 'Recently updated') {
        sortBy(items, (i) => i.data.saved_at).reverse();
      } else if (option === 'Least recently updated') {
        sortBy(items, (i) => i.data.saved_at);
      } else {
        return;
      }
      const activeItem = items[0];
      return Object.assign(state, {items, activeItem});
    });
  }

  render() {
    const {items} = this.props;
    return (
      <div className='w-40'>
        { items.map((item) => itemView(this, item)) }
      </div>
    );
  }
}

// view for a single narrative item
const itemView = (component, item) => {
  const status = item.isActive ? 'active' : 'inactive';
  const css = itemClasses[status];
  const {data} = item;
  return (
    <div onClick={() => component.selectItem(item)} key={ data.id } className='br b--black-20'>
      <div className={css.outer}>
        <div className={css.inner}>
          <h4 className='ma0 mb2 pa0 f5'>{ data.title }</h4>
          {/* TODO author compute to detect "you" */}
          <p className='ma0 pa0 f6'>Updated { item.savedAgo } by { data.author }</p>
        </div>
      </div>
    </div>
  );
};

// Active and inactive classnames for the item listing
const itemClasses = {
  active: {
    inner: 'pv3 br bw2 b--blue',
    outer: 'bb b--black-20',
  },
  inactive: {
    inner: 'pv3',
    outer: 'bb b--black-20 dim black-70 pointer',
  },
};

function generateRandomItems(count) {
  const items = [];
  const randNum = (max) => Math.floor(Math.random() * max);
  const randTime = () => Date.now() - randNum(1000000000);
  const randString = (len) => Math.random().toString(36).substring(len);
  for (let i = 0; i < count; i++) {
    items.push({
      title: 'Narrative ' + randString(7),
      saved_at: randTime(),
      created_at: randTime(),
      author: 'author-' + randString(7),
      total_cells: randNum(20),
      visibility: Math.random() > 0.5 ? 'public' : 'private',
      share_count: randNum(20),
      id: randNum(1000000),
    });
  }
  return items;
}
