// Return type of fetchApps; aggregated data about every app
// Details is an array of app info, while runs is an object where the keys are app IDs
export interface CombinedResult {
  runs: Runs;
  details: Array<DetailsResult>;
  categories: Array<string>;
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

// Object representing each result we get from narrative_method_store.list_apps
export interface DetailsResult {
  categories: Array<string>;
  module_name: string;
  name: string;
  id: string;
  input_types: Array<string>;
  output_types: Array<string>;
  tooltip: string;
  icon?: { url: string };
}

// Result from fetchAppDetails (NarrativeMethodStore.get_method_full_info)
export interface AppFullDetails {
  app_type: string;
  authors: Array<string>;
  categories: Array<string>;
  contact: string;
  description: string;
  git_commit_hash: string;
  icon: {url: string},
  id: string,
  module_name: string,
  name: string,
  namespace: string,
  publications: Array<string>;
  screenshots: Array<string>;
  subtitle: string;
  suggestions: {
    related_methods: Array<string>, 
    next_methods: Array<string>,
    related_apps: Array<string>,
    next_apps: Array<string>
  },
  technical_description: string,
  tooltip: string,
  ver: string
}

const NMS_URL = window._env.kbase_endpoint + '/narrative_method_store/rpc';

// Fetch the full app/method information from the NarrativeMethodStore
export async function fetchAppDetails(id: string) {
  const resp = await fetch(NMS_URL, {
    method: 'POST',
    body: JSON.stringify({
      method: 'NarrativeMethodStore.get_method_full_info',
      params: [{ids: [id]}],
      version: '1.1',
      id: String(Number(new Date()))
    })
  });
  const json = await resp.json();
  if (!json.result || !json.result.length) {
    throw new Error('Invalid response: ' + String(json));
  }
  return json.result[0][0];
}

// Fetch app data from the backends.
// Makes these requests:
// - to the catalog to get the run counts for every app
// - to the narrative method store to get the title/desc/etc for every app
// For some reason, list_favorite_counts returns the module name as lowercased >x
// So to have a canonical app id, we need module_name/app_id where module_name is always lowercased
export async function fetchApps(tag = 'release') {
  const catalogUrl = window._env.kbase_endpoint + '/catalog';
  const runs = fetch(catalogUrl, {
    method: 'POST',
    body: JSON.stringify({
      method: 'Catalog.get_exec_aggr_stats',
      version: '1.1',
      id: String(Number(new Date())),
      params: [{ tag: 'release' }],
    }),
  });
  const details = await fetch(NMS_URL, {
    method: 'POST',
    body: JSON.stringify({
      method: 'NarrativeMethodStore.list_methods',
      version: '1.1',
      id: String(Number(new Date())),
      params: [{ tag: tag }],
    }),
  });
  const [runsResult, detailsResult] = await Promise.all([runs, details]);
  // TODO error handling cases
  // Extract and reduce the size of the data
  // Turn runs into an object of {id: count}
  let runsJson = await runsResult.json();
  runsJson = runsJson.result[0].reduce((acc: Runs, res: RunsResult) => {
    acc[res.full_app_id.toLowerCase()] = res.number_of_calls;
    return acc;
  }, {});
  let detailsJson = await details.json();
  detailsJson = detailsJson.result[0];
  // Reduce all the details data into an array of category names
  const categories: Array<string> = detailsJson.reduce(
    (cats: Array<string>, det: DetailsResult) => {
      for (let catName of det.categories) {
        if (cats.indexOf(catName) === -1) {
          cats.push(catName);
        }
      }
      return cats;
    },
    []
  );
  // Combine all of the above into a single result of type CombinedResult
  return {
    runs: runsJson,
    details: detailsJson,
    categories,
  };
}
