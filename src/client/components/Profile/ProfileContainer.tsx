import { connect } from 'react-redux';

import { Profile } from './Profile';

import { requestProfile } from '../../redux/actions';

// import { Action, Dispatch } from 'redux';

// import { UserName, ProfileData, StoreState, ProfileView, ErrorMessages } from '../../redux/interfaces';
// import { updateProfile } from '../../redux/actions';
// import WhichComponent from './WhichComponent';

// import { profileFetchStatuses } from '../../redux/fetchStatuses';


// interface PropsWithProfileData {
//     userName: UserName;
//     editEnable: boolean;
//     profileData: ProfileData;
//     gravatarHash: string;
//     profileFetchStatus: string;
// };
// interface PropsWithoutProfileData {
//     profileFetchStatus: string;
// };

// type Props = PropsWithoutProfileData | PropsWithProfileData | ErrorMessages;

// interface DispatchProps {
//     updateProfile: (profileData: ProfileData, userName:UserName) => void;
//     getProfile: (profileID: string) => void;
// };

// interface OwnProps { };

// function mapStateToProps(state: StoreState): Props {


// };


function mapDispatchToProps(dispatch: any) {
  return {
    // updateProfile: (profileData: any, userName:string) => {
    //     return dispatch(updateProfile(profileData, userName) as any);
    // },
    getProfile: (profileID: string) => {
      return dispatch(requestProfile() as any);
    }
  };

};

export default connect(
  // mapStateToProps,
  mapDispatchToProps
)(Profile);