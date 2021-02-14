import React, { Component } from 'react';

// Components
import { MiniTabs } from '../../generic/MiniTabs';

// Utils
import {
  readableEpochDate,
  readableISODate,
} from '../../../utils/readableDate';
import { getWSTypeName } from '../../../utils/getWSTypeName';
import { Cell, Doc } from '../../../utils/narrativeData';

interface Props {
  activeItem: Doc;
  selectedTabIdx?: number;
}

interface State {
  selectedTabIdx: number;
}

interface DataObjects {
  readableType: string;
  obj_type: string;
  name: string;
}

// interface DetailedData {
//   access_group: string | number;
//   cells: Array<Cell>;
//   narrative_title: string;
//   shared_users: Array<string>;
//   creator: string;
//   creation_date: number;
//   total_cells: number;
//   data_objects: Array<DataObjects>;
//   is_public: boolean;
//   sharedWith: Array<string>;
// }

// Narrative details side panel in the narrative listing.
export class NarrativeDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // Index of the selected tab within MiniTabs
      selectedTabIdx: this.props.selectedTabIdx || 0,
    };
  }

  // Handle the onSelect callback from MiniTabs
  handleOnTabSelect(idx: number) {
    this.setState({ selectedTabIdx: idx });
  }
  // Basic details, such as author, dates, etc.
  // Receives the narrative data from elasticsearch results for a single entry.
  basicDetailsView(data: Doc) {
    const sharedWith = data.shared_users.filter(
      (user: string) => user !== window._env.username
    );
    return (
      <div className="mb3">
        {descriptionList('Author', data.creator)}
        {descriptionList('Created on', readableISODate(data.creation_date))}
        {descriptionList('Total cells', data.total_cells)}
        {descriptionList('Data objects', data.data_objects.length)}
        {descriptionList('Visibility', data.is_public ? 'Public' : 'Private')}
        {data.is_public || !sharedWith.length
          ? ''
          : descriptionList('Shared with', sharedWith.join(', '))}
      </div>
    );
  }

  render() {
    const { activeItem } = this.props;
    if (!activeItem) {
      return <div></div>;
    }

    const { selectedTabIdx } = this.state;
    const wsid = activeItem.access_group;
    const narrativeHref = window._env.narrative + '/narrative/' + wsid;
    let content: JSX.Element | string = '';
    // Choose which content to show based on selected tab
    if (selectedTabIdx === 0) {
      // Show overview
      content = this.basicDetailsView(activeItem);
    } else if (selectedTabIdx === 1) {
      content = dataView(activeItem);
    } else if (selectedTabIdx === 2) {
      content = cellPreview(activeItem);
    }
    return (
      <div
        className="w-60 h-100 bg-white pv2 ph3"
        style={{
          top: window._env.legacyNav ? '4.5rem' : '0.75rem',
          position: 'sticky',
        }}
      >
        <div className="flex justify-between mb3">
          <h4 className="ma0 pa0 pt2 f4">
            <a className="blue pointer no-underline dim" href={narrativeHref}>
              {activeItem.narrative_title || 'Untitled'}
              <i className="fa fa-external-link-alt ml2 black-20"></i>
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
        <MiniTabs
          tabs={['Overview', 'Data', 'Preview']}
          onSelect={this.handleOnTabSelect.bind(this)}
          activeIdx={selectedTabIdx}
          className="mb3"
        />
        {content}
      </div>
    );
  }
}

// Dictionary term and definition for overview section
// function dl(key, val) {
function descriptionList(key: string, val: string | number): JSX.Element {
  return (
    <dl className="ma0 flex justify-between bb b--black-20 pv2">
      <dt className="dib b">{key}</dt>
      <dd className="dib ml0 grau tr black-70">{val}</dd>
    </dl>
  );
}

function cellPreviewReducer(all: Array<Cell>, each: Cell): Array<Cell> {
  const prev = all[all.length - 1];
  if (each.cell_type === 'widget' || !each.cell_type.trim().length) {
    // Filter out widgets for now
    // Also, filter out blank cell types
    return all;
  } else if (
    prev &&
    each.cell_type === prev.cell_type &&
    each.desc === prev.desc
  ) {
    // If a previous cell has the same content, increase the previous quantity and don't append
    prev.count = prev.count || 1;
    prev.count += 1;
  } else {
    // Append a new cell
    if (!each.desc.trim().length) {
      // Show some text for empty cells
      each.desc = '(empty)';
    } else {
      // Only take the first 4 lines
      let desc = each.desc
        .split('\n')
        .slice(0, 3)
        .join('\n');
      // Append ellipsis if we've shortened it
      if (desc.length < each.desc.length) {
        desc += '...';
      }
      each.desc = desc;
    }
    all.push(each);
  }
  return all;
}

// Preview of all notebook cells in the narrative
function cellPreview(data: Doc) {
  const leftWidth = 18;
  const maxLength = 16;
  // TODO move this into its own component class
  const truncated = data.cells
    .reduce(cellPreviewReducer, [])
    .slice(0, maxLength);
  const rows = truncated.map((cell, idx) => {
    const faClass = cellIcons[cell.cell_type];
    return (
      <div
        key={idx}
        className="dt-row mb2"
        style={{ justifyContent: 'space-evenly' }}
      >
        <span className="dtc pv2 pr2" style={{ width: leftWidth + '%' }}>
          <i
            style={{ width: '1.5rem' }}
            className={(faClass || '') + ' dib mr2 light-blue tc'}
          ></i>
          <span className="b mr1">
            {cellNames[cell.cell_type] || cell.cell_type || ''}
          </span>
          <span className="black-60 f6">
            {cell.count ? ' ×' + cell.count : ''}
          </span>
        </span>
        <span
          className="dtc pa2 truncate black-70"
          style={{ width: 100 - leftWidth + '%' }}
        >
          {cell.desc}
        </span>
      </div>
    );
  });
  return (
    <div>
      <p className="black-60">
        {data.cells.length} total cells in the narrative:
      </p>
      <div className="dt dt--fixed">{rows}</div>
      {viewFullNarrativeLink(data)}
    </div>
  );
}

// Font-awesome class names for each narrative cell type
const cellIcons: { [key: string]: string } = {
  code_cell: 'fa fa-code',
  kbase_app: 'fa fa-cube',
  markdown: 'fa fa-paragraph',
  widget: 'fa fa-wrench',
  data: 'fa fa-database',
};

// Font-awesome class names for each narrative cell type
enum CellIcons {
  code_cell = 'fa fa-code',
  kbase_app = 'fa fa-cube',
  markdown = 'fa fa-paragraph',
  widget = 'fa fa-wrench',
  data = 'fa fa-database',
}

// Human readable names for each cell type.
const cellNames: { [key: string]: string } = {
  code_cell: 'Code',
  markdown: 'Text',
  kbase_app: 'App',
  widget: 'Widget',
  data: 'Data',
};

function viewFullNarrativeLink(data: Doc) {
  const wsid = data.access_group;
  const narrativeHref = window._env.narrative + '/narrative/' + wsid;
  return (
    <p>
      <a className="no-underline" href={narrativeHref}>
        View the full narrative
      </a>
    </p>
  );
}

// Overview of data objects in the narrative
function dataView(data: Doc) {
  const rows = data.data_objects
    .slice(0, 50)
    .map(obj => {
      obj.readableType = getWSTypeName(obj.obj_type);
      return obj;
    })
    .sort((a, b) => a.readableType.localeCompare(b.readableType))
    .map(obj => dataViewRow(obj));
  return (
    <div>
      <p className="black-60">
        {data.data_objects.length} total objects in the narrative:
      </p>
      <div className="dt dt--fixed">{rows}</div>
      {viewFullNarrativeLink(data)}
    </div>
  );
}

// View for each row in the data listing for the narrative
function dataViewRow(obj: DataObjects) {
  const key = obj.name + obj.obj_type;
  const leftWidth = 40; // percentage
  return (
    <div key={key} className="dt-row">
      <span
        className="dib mr2 dtc b pa2 truncate"
        style={{ width: leftWidth + '%' }}
      >
        <i className="fa fa-database dib mr2 green"></i>
        {obj.readableType}
      </span>
      <span
        className="dib dtc pa2 black-60 truncate"
        style={{ width: 100 - leftWidth + '%' }}
      >
        {obj.name}
      </span>
    </div>
  );
}
