import React, { Component } from 'react';
import './Header.css';
// import kbase_logo from '../..     /../static/images/kbase_logo.png';

interface State {
  dropdownVisible: boolean;
}
interface Props {
  token: string;
  headerTitle: string;
}

export class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dropdownVisible: true,
    };
  }

  componentDidMount(){
  }
  // i really don't think this is how it works Lolz
  hamburgerOnClick = () => {
    if (this.state.dropdownVisible) {
      // let dropDownMenuHTMLEle:HTMLElement = document.querySelector('.dropdown-menu')
      //     dropDownMenuHTMLEle.style = "display: none;"
      this.setState({ dropdownVisible: false });
      
    } else {
      // document.querySelector('.dropdown-menu').style = "display: block;"
      this.setState({ dropdownVisible: true });
    }
  }
  // Set gravatarURL
  // gravaterSrc() {
  //   if (this.props.profileData['avatarOption'] === 'silhoutte' || !this.props.gravatarHash) {
  //       // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={nouserpic} />;
  //       return nouserpic;
  //   } else if (this.props.gravatarHash) {
  //       return 'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=300&amp;r=pg&d=' + this.props.profileData.gravatarDefault;
  //       // let gravatar = <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={gravaterSrc} />;
  //   };
  // };
  render() {
    return (
      <header className="flex items-center header">
        <div className='hamburger-menu'>
          <button className="hamburger" onClick={this.hamburgerOnClick}>
            <i className="fa fa-navicon fa-2x dib"></i> 
                    </button>
          <ul className="dropdown-menu" role="menu" hidden={this.state.dropdownVisible}>
            <li>
              <a href="#narrativemanager/start"><span className="fa fa-file"></span><span>Narrative Interface</span></a>
            </li>
            <li>
              <a href="#jgi-search"><span className="fa fa-search"></span><span>JGI Search</span></a>
            </li>
            <li>
              <a href="#biochem-search"><span className="fa fa-search"></span><span>Biochem Search</span></a>
            </li>
            <hr />
            <li>
              <a href="#about/services"><span className="fa fa-server"></span><span>KBase Services Status</span></a>
            </li>
            <hr />
            <li>
              <a href="#about"><span className="fa fa-info-circle"></span><span>About</span></a>
            </li>
            <li>
              <a href="https://kbase.us/contact-us" target="_blank"><span className="fa fa-envelope-o"></span><span>Contact KBase</span></a>
            </li>
            <li>
              <a href="https://kbase.us/narrative-guide/" target="_blank"><span className="fa fa-question"></span><span>Help</span></a>
            </li>
          </ul>
        </div>
        {/* <a href="https://kbase.us" className="-logo dib"><img className='header-logo' src={kbase_logo} alt='KBase logo' /></a> */}
        <h1 className='roboto-header'><div>{this.props.headerTitle}</div></h1>
        <div>icon</div>
        {/* <div><img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={this.gravaterSrc()} onClick={(event) => { this.showModal(event, ModalName.AvatarOption) }} /></div> */}
      </header>
    );
  }
}