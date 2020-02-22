export interface Item {
  index: string;
  id: string;
  doc: ItemDoc;
}

export interface ItemDoc {
  narrative_title: string;
  data_objects: Array<any>;
  cells: Array<any>;
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