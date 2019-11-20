
// Get the URL for the "backend-for-frontend" service
async function getBFFServiceUrl(token: string, baseURL: string) {
  const versionNum: number | null = null;
  const url = window._env.kbase_endpoint + '/services/service_wizard';
  const body = {
    id: 0,
    method: 'ServiceWizard.get_service_status',
    version: '1.1',
    params: [
      {
        module_name: 'bff',
        version: versionNum
      }
    ]
  };
  const stringBody = JSON.stringify(body);
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: token
    },
    body: stringBody
  });
  if(response.status !== 200){
    // return empty string so that the fetch API called this function
    // can generate error messages.
    return  '';
  } else {
    const responseJson = await response.json();
    return responseJson.result[0]['url'];
  };
};

export async function fetchProfileAPI() {
  const id = window._env.username;
  const token = window._env.token;
  const baseURL =  window._env.url_prefix;
  const bffServiceUrl = await getBFFServiceUrl(token, baseURL);
  const url = bffServiceUrl + '/fetchUserProfile/' + id;
  const response = await fetch(url, { method: 'GET' });
  if (response.status !== 200) {
    console.warn(response.status, response);
    // return [response.status, response.statusText];
  } else {
    try {
      const profile = await response.json();
      return profile;
    } catch (err) {
      console.error('Profile fetch failed:', response);
    };
  };
};
