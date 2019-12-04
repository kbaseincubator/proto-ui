import React, { Component } from 'react';

import './profile.css';


interface Props {
  profileId?: string | null;
  profileRealName: string;
  profileData: {}
  gravatarSrc: string;
}

interface State {
}

export class ProfilePlainText extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {

    };

  }
  componentDidMount() {
    console.log('componentDidMount', this.props)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {

  }

  researchInterests() {
    const userdata = this.props.profileData.userdata;
    console.log('researchInterests', userdata.researchInterests)
    if (Array.isArray(userdata.researchInterests)) {
      let otherUl;
      if (userdata.researchInterestsOther !== '') {
        otherUl = (<ul><li>{userdata.researchInterestsOther}</li></ul>)
      }
      const ele = (
        <>
          <h4>Research Interests</h4>
          <ul style={{ textAlign: 'left' }}>
            {userdata.researchInterests.map((interest: string) => (
              <li key={interest}>{interest}</li>
            ))}
            {otherUl}
          </ul>
        </>
      )

      return ele;
    }
  }

  buildAffliations() {
    const affiliationsArray = this.props.profileData.userdata.affiliations;
    // non-empty array
    if (affiliationsArray.length > 0 && affiliationsArray[0]['title'] !== '') {
      return (
        <div id='affiliations'>
          {affiliationsArray.map((position: {}) => {
            if (position.title) {
              return (
                <div className='affiliation-row'>
                  <p style={{ width: '20%', display: 'inline-block', marginRight: '1em', verticalAlign: 'middle' }}>{position.title}</p>
                  <p style={{ width: '45%', display: 'inline-block', marginRight: '1em', verticalAlign: 'middle' }}>{position.organization}</p>
                  <div style={{ width: '29%', display: 'inline-block', verticalAlign: 'text-bottom', whiteSpace: 'nowrap' }}>
                    <p style={{ display: 'inline', marginRight: '1em' }}>{position.started}</p>
                    <p style={{ display: 'inline', marginRight: '1em' }}> - </p>
                    <p style={{ display: 'inline', marginRight: '1em' }}>{position.ended ? position.ended : 'present'}</p>
                  </div>
                </div>
              );
            };
          })}
        </div>
      );
    }
  }

  location(){
    const userdata = this.props.profileData.userdata;
    if (userdata.country || userdata.state || userdata.city) {
      return (
        <>
          <div className="fa fa-map-marker"></div>
          <div className='f6'>{userdata.city ? userdata.city + ', ' : null}{userdata.state ? userdata.state + ', ' : null}{userdata.country ? userdata.country: null}</div>
        </>
      )
    }
  };

  render() {
    const userdata = this.props.profileData.userdata;
    return (
      <>
        <div className='vw30'>
          <div className='kbase-card pa3 ma3 tc'>
            <img src={this.props.gravatarSrc} />
          </div>
          <div className='kbase-card pa3 ma3'>
            {this.buildAffliations()}
            <div>
              {userdata.fundingSource ? (<h4>Primary Funding Source</h4>) : null}
              <p>{userdata.fundingSource}</p>
            </div>
            
          </div>
        </div>
        <div className='vw10'></div> {/* gutter */}
        <div>
          <div className='kbase-card pa3 ma3'>
            <h1>{this.props.profileRealName}</h1>
            <p>{this.props.profileId}</p>
            <p style={{ fontStyle: "italic" }}>{userdata.jobTitle === 'Other' ? userdata.jobTitleOther : userdata.jobTitle}</p>
            <p>{userdata.department}<br />
              {userdata.organization}</p>
            {this.location()}
          </div>
          <div className='kbase-card ma3 pa3'>{this.researchInterests()}<h4>Research or Personal Statement</h4>{userdata.researchStatement}</div>
        </div>
      </>
    )
  }
}

export default ProfilePlainText; 