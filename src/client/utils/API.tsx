async function getBFFServiceUrl(token: string, baseURL: string) {
  // TODO: for dev, the baseUrl will be whatever works for the CRA workflow, which is ''.
  // baseURL = 'https://ci.kbase.us/services'; // for dev
  window.window._env.narrative;
  let versionNum: number | null = null;
  let url = window.window._env.narrative + '/services/service_wizard';
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
  let token = window._env.token;
  let baseURL = window._env.url_prefix;
  const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
  let url = bffServiceUrl + '/fetchUserProfile/' + username;
  console.log(url);
  const response = await fetch(url, {
    method: 'GET',
  });
  if (response.status !== 200) {
    console.warn(response.status, response);
    // return [response.status, response.statusText];
  } else {
    try {
      const profile = await response.json();
      console.log('woot it worked!', profile);
      return profile;
    } catch (err) {
      console.error('profile fetch failed', response);
      // return [response.status, response.statusText];
    }
  }
}
