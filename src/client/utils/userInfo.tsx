export {};
import { getToken } from '../utils/auth';

async function getBFFServiceUrl(token: string) {
  // TODO: for dev, the baseUrl will be whatever works for the CRA workflow, which is ''.
  let versionNum: number | null = null;
  console.log('window._env', window.window._env);
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
  const response = await fetch(url, {
    method: 'GET',
  });
  if (response.status !== 200) {
    console.warn(response.status, response);
    // return [response.status, response.statusText];
  } else {
    try {
      const profile = await response.json();
      return profile;
    } catch (err) {
      console.error('Profile fetch failed:', response);
    }
  }
}
