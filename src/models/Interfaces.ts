export interface Item {
  index: string;
  id: string;
  doc: ItemDoc;
}

export interface ItemDoc {
  narrative_title: string;
  data_objects: Array<DataObjects>;
  cells: Array<Cell>;
  creator: string;
  total_cells: number;
  access_group: number;
  obj_name: string;
  shared_users: Array<string>
  timestamp: number;
  creation_date: string;
  is_public: boolean;
  version: number;
  obj_id: number;
  copied: null | any; // this has to be updated I don't know what this supposed to be
  tags: Array<string>
  obj_type_version: string;
  obj_type_module: string;
  obj_type_name: string;
}

export interface Cell {
  cell_type: string;
  desc: string;
  count: number;
}
export interface DataObjects {
  readableType: string;
  obj_type: string;
  name: string;
}

export interface SearchParams {
  term: string;
  sort: string;
  category: string;
  skip: number;
  pageSize: number;
  musts?: Array<any>;
  mustNots?: Array<any>;
}

export interface Options {
  query: {
    bool: {
      must: Array<object>;
      must_not?: Array<object>;
    };
  };
  pageSize: number;
  auth?: boolean;
  sort?: Array<{ [key: string]: { [key: string]: string } } | string>;
  skip?: number;
}