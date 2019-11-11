import React, { Component } from 'react';
import './Header.css';

import {fetchProfileAPI} from '../../utils/API';
// import nouserpic from '../../../static/images/nouserpic.png'; 

interface State {
  dropdownVisible: boolean;
  gravatarHash: string | undefined;
  avatarOption: string | undefined;
  gravatarDefault: string | undefined;
}
interface Props {
  headerTitle: string;
}

export class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dropdownVisible: true,
      gravatarHash: undefined,
      avatarOption: undefined,
      gravatarDefault: undefined,
    };
  }

  componentDidMount(){
    this.getGravater();
  }
  async getGravater(){
    let res = await fetchProfileAPI();
    let avatarOption = res.profile.userdata.avatarOption;
    let gravatarHash = res.profile.synced.gravatarHash;
    let gravatarDefault = res.profile.userdata.gravatarDefault;
    this.setState({avatarOption, gravatarHash, gravatarDefault})
  }
  // i really don't think this is how it works Lolz
  // hamburgerOnClick = () => {
  //   if (this.state.dropdownVisible) {
  //     // let dropDownMenuHTMLEle:HTMLElement = document.querySelector('.dropdown-menu')
  //     //     dropDownMenuHTMLEle.style = "display: none;"
  //     this.setState({ dropdownVisible: false });
      
  //   } else {
  //     // document.querySelector('.dropdown-menu').style = "display: block;"
  //     this.setState({ dropdownVisible: true });
  //   }
  // }
  // Set gravatarURL
  gravaterSrc() {
    if (this.state.avatarOption === 'silhoutte' || !this.state.gravatarHash) {
        // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={nouserpic} />;
        return nouserpic;
    } else if (this.state.gravatarHash) {
        return 'https://www.gravatar.com/avatar/' + this.state.gravatarHash + '?s=300&amp;r=pg&d=' + this.state.gravatarDefault;
        // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={gravaterSrc} />;
    };
  };
  render() {
    return (
      <header className="flex items-center header">
        <h1 className='roboto-header'><div>{this.props.headerTitle}</div></h1>
        <div><img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={this.gravaterSrc()} onClick={(event) => { this.showModal(event, ModalName.AvatarOption) }} /></div>
      </header>
    );
  }
}