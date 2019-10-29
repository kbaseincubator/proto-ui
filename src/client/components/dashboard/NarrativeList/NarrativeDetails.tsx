import React, {Component} from 'react';

// Components
import {MiniTabs} from '../../generic/MiniTabs';

// Utils
import {readableDate} from '../../../utils/readableDate';
import {getWSTypeName} from '../../../utils/getWSTypeName';


interface Props {
  activeItem:{};
  selectedTabIdx: number;
}

interface State {
  selectedTabIdx: number;
}
/**
 * Narrative details side panel in the narrative listing.
 * props:
 * - activeItem - object of detailed narrative data
 * state:
 * - selectedTabIdx - index of which mini-tab is selected
 * callbacks: none
 */
export class NarrativeDetails extends Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.state = {
      // Index of the selected tab within MiniTabs
      selectedTabIdx: props.selectedTabIdx || 0,
    };
  }

  // Handle the onSelect callback from MiniTabs
  handleOnTabSelect(idx) {
    this.setState({selectedTabIdx: idx});
  }

  render(props) {
    const {activeItem} = props;
    if (!activeItem) {
      return (<div></div>);
    }
    const {selectedTabIdx} = this.state;
    const data = activeItem._source;
    const wsid = data.access_group;
    const narrativeHref = window._env.narrative + '/narrative/' + wsid;
    let content = '';
    // Choose which content to show based on selected tab
    if (selectedTabIdx === 0) {
      // Show overview
      content = basicDetailsView(data);
    } else if (selectedTabIdx === 1) {
      content = dataView(data);
    } else if (selectedTabIdx === 2) {
      content = cellPreview(data);
    }
    return (
      <div className='w-60 h-100 bg-white pv2 ph3' style={{top: '1rem', position: 'sticky'}}>

        <div className='flex justify-between mb3'>
          <h4 className='ma0 pa0 pt2 f4'>
            <a className='blue pointer no-underline dim' href={narrativeHref}>
              { data.narrative_title || 'Untitled' }
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
        <MiniTabs
          tabs={['Overview', 'Data', 'Preview']}
          onSelect={this.handleOnTabSelect.bind(this)}
          className='mb3' />
        {content}
      </div>
    );
  }
}

// Basic details, such as author, dates, etc.
// Receives the narrative data from elasticsearch results for a single entry.
function basicDetailsView(data) {
  const sharedWith = data.shared_users.filter((u) => u !== window._env.username);
  return (
    <div className='mb3'>
      {dl('Author', data.creator)}
      {dl('Created on', readableDate(data.creation_date))}
      {dl('Total cells', data.total_cells)}
      {dl('Data objects', data.data_objects.length)}
      {dl('Visibility', data.is_public ? 'Public' : 'Private')}
      {data.is_public || !sharedWith.length ? '' : dl('Shared with', sharedWith.join(', '))}
    </div>
  );
}

// Dictionary term and definition for overview section
function dl(key, val) {
  return (
    <dl className="ma0 flex justify-between bb b--black-20 pv2">
      <dt className="dib b">{key}</dt>
      <dd className="dib ml0 grau tr black-70">{val}</dd>
    </dl>
  );
}

// Preview of all notebook cells in the narrative
function cellPreview(data) {
  const leftWidth = 18;
  const maxLength = 16;
  // TODO move this into its own component class
  const truncated = data.cells.reduce((all, each) => {
    const prev = all[all.length - 1];
    if (each.cell_type === 'widget' || !each.cell_type.trim().length) {
      // Filter out widgets for now
      // Also, filter out blank cell types
      return all;
    } else if (prev && each.cell_type === prev.cell_type && each.desc === prev.desc) {
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
        let desc = each.desc.split('\n').slice(0, 3).join('\n');
        // Append ellipsis if we've shortened it
        if (desc.length < each.desc.length) {
          desc += '...';
        }
        each.desc = desc;
      }
      all.push(each);
    }
    return all;
  }, []).slice(0, maxLength);
  const rows = truncated.map((cell, idx) => {
    const faClass = cellIcons[cell.cell_type];
    return (
      <div key={idx} className='dt-row mb2' style={{justifyContent: 'space-evenly'}}>
        <span className='dtc pv2 pr2' style={{width: leftWidth + '%'}}>
          <i
            style={{width: '1.5rem'}}
            className={(faClass || '') + ' dib mr2 light-blue tc'}></i>
          <span className='b mr1'>
            {cellNames[cell.cell_type] || cell.cell_type || ''}
          </span>
          <span className='black-60 f6'>
            {cell.count ? ' ×' + cell.count : ''}
          </span>
        </span>
        <span className='dtc pa2 truncate black-70' style={{width: (100 - leftWidth) + '%'}}>
          {cell.desc}
        </span>
      </div>
    );
  });
  return (
    <div>
      <p className='black-60'>{data.cells.length} total cells in the narrative:</p>
      <div className='dt dt--fixed'>
        {rows}
      </div>
      {viewFullNarrativeLink(data)}
    </div>
  );
}

// Font-awesome class names for each narrative cell type
const cellIcons = {
  code_cell: 'fas fa-code',
  kbase_app: 'fas fa-cube',
  markdown: 'fas fa-paragraph',
  widget: 'fas fa-wrench',
  data: 'fas fa-database',
};

// Human readable names for each cell type.
const cellNames = {
  code_cell: 'Code',
  markdown: 'Text',
  kbase_app: 'App',
  widget: 'Widget',
  data: 'Data',
};

function viewFullNarrativeLink(data) {
  const wsid = data.access_group;
  const narrativeHref = window._env.narrative + '/narrative/' + wsid;
  return (
    <p><a className='no-underline' href={narrativeHref}>View the full narrative</a></p>
  );
}

// Overview of data objects in the narrative
function dataView(data) {
  const rows = data.data_objects
      .slice(0, 50)
      .map((obj) => {
        obj.readableType = getWSTypeName(obj.obj_type);
        return obj;
      })
      .sort((a, b) => a.readableType.localeCompare(b.readableType))
      .map((obj) => dataViewRow(data, obj));
  return (
    <div>
      <p className='black-60'>{data.data_objects.length} total objects in the narrative:</p>
      <div className='dt dt--fixed'>
        {rows}
      </div>
      {viewFullNarrativeLink(data)}
    </div>
  );
}

// View for each row in the data listing for the narrative
function dataViewRow(data, obj) {
  const key = obj.name + obj.obj_type;
  const leftWidth = 40; // percentage
  return (
    <div key={key} className='dt-row'>
      <span className='dib mr2 dtc b pa2 truncate' style={{width: leftWidth + '%'}}>
        <i className='fas fa-database dib mr2 green'></i>
        {obj.readableType}
      </span>
      <span className='dib dtc pa2 black-60 truncate' style={{width: (100 - leftWidth) + '%'}}>
        {obj.name}
      </span>
    </div>
  );
}
