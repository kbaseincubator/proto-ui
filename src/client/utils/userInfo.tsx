export {};
import { getToken } from '../utils/auth';

async function getBFFServiceUrl(token: string) {
  // TODO: for dev, the baseUrl will be whatever works for the CRA workflow, which is ''.
  let versionNum: number | null = null;
  let url: string;
  if (window._env.kbase_endpoint.includes('localhost')) {
    url = 'https://ci.kbase.us/services/service_wizard';
  } else {
    url = window._env.kbase_endpoint + '/service_wizard';
  }
  const body = {
    id: 0,
    method: 'ServiceWizard.get_service_status',
    version: '1.1',
    params: [
      {
        module_name: 'bff',
        version: versionNum,
      },
    ],
  };
  const stringBody = JSON.stringify(body);
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: token,
    },
    body: stringBody,
  });
  if (response.status !== 200) {
    // return empty string so that the fetch API called this function
    // can generate error messages.
    return '';
  } else {
    const responseJson = await response.json();
    return responseJson.result[0]['url'];
  }
}

export async function fetchProfileAPI(username: string) {
  let token = getToken();
  const bffServiceUrl = await getBFFServiceUrl(token);
  let url = bffServiceUrl + '/fetchUserProfile/' + username;
  console.log(url);
  const response = await fetch(url, {
    method: 'GET',
  });
  if (response.status !== 200) {
    console.warn(response.status, response);
    return { status: response.status, statusText: response.statusText };
    // return [response.status, response.statusText];
  } else {
    try {
      let res = await response.json();
      return {status: response.status, response: res}
    } catch (err) {
      console.error('profile fetch failed', response);
      return { status: response.status, statusText: response.statusText };
      // return [response.status, response.statusText];
    }
  }
}

/**
 * update profile
 * method 'UserProfile.update_user_profile' takes top level key of profile object.
 * @param userdata
 * @param user
 */
export async function updateProfileAPI(
  userdata: any,
  user: { name: string; userID: string }
) {
  let token = getToken();
  let newParam = [
    {
      profile: {
        user: { realname: user.name, username: user.userID },
        profile: { userdata: userdata },
      },
    },
  ];
  const body = {
    version: '1.1',
    method: 'UserProfile.update_user_profile',
    params: newParam,
  };
  const stringBody = JSON.stringify(body);
  const url = window._env.url_prefix + '/services/user_profile/rpc';
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: stringBody,
  });
  if (response.status === 200) {
    return response.status;
  } else {
    let responseJSON = await response.json();
    let responseArray: Array<number | string> = [
      response.status,
      responseJSON.error.message,
    ];
    return responseArray;
  }
}
