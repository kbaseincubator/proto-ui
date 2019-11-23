import React from 'react';
export const AccuntNav = (props:{navOnClick:()=>void}) => (
  <>
    <ul className="list pa0 ml3" style={{ position: 'sticky', top: 0 }}>
      <li data-hl-nav='profile' className="mv1 pointer bg-dark-blue white b br2 pa2 flex justify-between" onClick={props.navOnClick}>
        <a data-hl-nav='profile' className='dib no-underline black-80 w-100 dim'>
          <span>Profile</span>
        </a>
      </li>
      <li data-hl-nav='account' className="mv1 hover-bg-light-gray br2 pointer pa2 flex justify-between" onClick={props.navOnClick}>
        <a data-hl-nav='account' className='dib no-underline black-80 w-100 dim'>
          <span>Account</span>
        </a>
      </li>
      <li data-hl-nav='linked_accounts' className="mv1 hover-bg-light-gray br2 pointer pa2 flex justify-between" onClick={props.navOnClick}>
        <a data-hl-nav='linked_accounts' className='dib no-underline black-80 w-100 dim'>
          <span>Linked accounts</span>
        </a>
      </li >
      <li data-hl-nav='developer_tokens' className="mv1 hover-bg-light-gray br2 pointer pa2 flex justify-between" onClick={props.navOnClick}>
        <a data-hl-nav='developer_tokens' className='dib no-underline black-80 w-100 dim'>
          <span>Developer tokens</span>
        </a>
      </li >
      <li data-hl-nav='running_jobs' className="mv1 hover-bg-light-gray br2 pointer pa2 flex justify-between" onClick={props.navOnClick}>
        <a data-hl-nav='running_jobs' className='dib no-underline black-80 w-100 dim'>
          <span>Running jobs</span>
        </a>
      </li >
      <li data-hl-nav='usage_agreeements' className="mv1 hover-bg-light-gray br2 pointer pa2 flex justify-between" onClick={props.navOnClick}>
        <a data-hl-nav='usage_agreeements' className='dib no-underline black-80 w-100 dim'>
          <span>Usage agreeements</span>
        </a>
      </li >
    </ul >
  </>
)
