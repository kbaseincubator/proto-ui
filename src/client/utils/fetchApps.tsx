
export async function fetchApps () {
  const params = [{
    include_released: 1,
    include_unreleased: 1,
    include_disabled: 0
  }];
  const url = window._env.kbase_endpoint + '/catalog';
  console.log({ url });
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      method: 'Catalog.list_basic_module_info',
      version: '1.1',
      id: '0',
      params
    }),
  });
  return await response.json();
}
