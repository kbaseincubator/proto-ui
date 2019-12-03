import React, { Component } from 'react';

import TextInput from '../generic/TextInput';
import NumInput from '../generic/NumInput';

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

  render() {
    const profile = this.props.profileData;
    const userdata = this.props.profileData.userdata;
    const hasLocation = () => {
      if (userdata.country || userdata.state || userdata.city) {
        return true;
      } else {
        return false;
      };
    };
    return (
      <>
        <div className='vw30'>
          <NumInput required={true}/>
          <div className='kbase-card pa3 ma3 tc'>
            <img src={this.props.gravatarSrc} />
          </div>
          <div className='kbase-card pa3 ma3'>
            {/* <h2>{this.props.profileRealName}</h2> */}
            <p>{this.props.profileId}</p>
            <div>
              <p>{this.props.profileId}</p>
              <p style={{ fontStyle: "italic" }}>{userdata.jobTitle === 'Other' ? userdata.jobTitleOther : userdata.jobTitle}</p>
              <p>{userdata.organization}<br />
                {userdata.department}</p>
            </div>
            <div>
              {hasLocation() ? (<h4>Location</h4>) : null}
              <p>{userdata.country ? userdata.country + ', ' : null}{userdata.state ? userdata.state + ', ' : null}{userdata.city ? userdata.city : null}</p>
            </div>
            <div>
              {userdata.fundingSource ? (<h4>Primary Funding Source</h4>) : null}
              <p>{userdata.fundingSource}</p>
            </div>
          </div>
        </div>
        <div className='vw10'></div>
        <div>
          <h1>{this.props.profileRealName}</h1>
          <p>{this.props.profileId}</p>
          <div className='kbase-card ma3 pa3'>{this.researchInterests()}</div>
          <div className='kbase-card ma3 pa3'><h4>Research or Personal Statement</h4>{userdata.researchStatement}</div>
        </div>
      </>
    )
  }
}

export default ProfilePlainText; 