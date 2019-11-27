// Return type of fetchApps; aggregated data bout every app
// Details is an array of app info, while runs and stars are objects where the keys are app IDs
export interface CombinedResult {
  runs: Runs;
  stars: Stars;
  details: Array<DetailsResult>;
}

// Object of app ID mapped to number of runs
export interface Runs {
  [key: string]: number;
}

// Object for each runs result from the server (Catalog.get_exec_aggr_stats)
export interface RunsResult {
  full_app_id: string;
  number_of_calls: number;
}

// Object of app ID mapped to number of list_favorite_counts
export interface Stars {
  [key: string]: number;
}

// Object for each result from the server (Catalog.get_favo
export interface StarsResult {
  count: number;
  id: string;
  module_name_lc: string;
}

// Object representing each result we get from narrative_method_store.list_apps
export interface DetailsResult {
  categories: Array<string>;
  module_name: string;
  name: string;
  id: string;
  input_types: Array<string>;
  output_types: Array<string>;
  tooltip: string;
}

// Fetch app data from the backends.
// Makes three requests:
// - to the catalog to get the stars for every app
// - to the catalog to get the run counts for every app
// - to the narrative method store to get the title/desc/etc for every app
// For some reason, list_favorite_counts returns the module name as lowercased >x
// So to have a canonical app id, we need module_name/app_id where module_name is always lowercased
export async function fetchApps () {
  const catalogUrl = window._env.kbase_endpoint + '/catalog';
  const runs = fetch(catalogUrl, {
    method: 'POST',
    body: JSON.stringify({
      method: 'Catalog.get_exec_aggr_stats',
      version: '1.1',
      id: '0',
      params: [{tag: "release"}],
    }),
  });
  const stars = fetch(catalogUrl, {
    method: 'POST',
    body: JSON.stringify({
      method: 'Catalog.list_favorite_counts',
      version: '1.1',
      id: '0',
      params: [{}],
    }),
  });
  const [runsResult, starsResult] = await Promise.all([runs, stars])
  // Extract and reduce the size of the data
  // Turn runs into an object of {id: count}
  let runsJson = await runsResult.json();
  runsJson = runsJson.result[0].reduce((acc: Runs, res: RunsResult) => {
    acc[res.full_app_id.toLowerCase()] = res.number_of_calls;
    return acc;
  }, {});
  // Extract and reduce the size of the data
  // Turn stars into an object of {id: count}
  let starsJson = await starsResult.json();
  starsJson = starsJson.result[0].reduce((acc: Stars, res: StarsResult) => {
    const id = (res.module_name_lc + '/' + res.id).toLowerCase();
    acc[id] = res.count;
    return acc;
  }, {});
  const nmsUrl = window._env.kbase_endpoint + '/narrative_method_store/rpc';
  const details = await fetch(nmsUrl, {
    method: 'POST',
    body: JSON.stringify({
      method: 'NarrativeMethodStore.list_methods',
      version: '1.1',
      id: '0',
      params: [{tag: "release"}]
    })
  });
  let detailsJson = await details.json();
  detailsJson = detailsJson.result[0];
  // Combine all of the above into a single result of type CombinedResult
  return {
    runs: runsJson,
    stars: starsJson,
    details: detailsJson
  };
}
