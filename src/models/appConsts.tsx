// bit of a cheating way to keep constatns 
// and to make them importable 
// and I also don't know why this has to be 
// tsx for it to work as a module 
// and not with .ts
export class AppConsts {
  constructor() {

  }
  static categoryMap1: { [key: string]: string } = {
    'my narratives': 'own',
    'shared with me': 'shared',
    'tutorials': 'tutorials',
    'public': 'public',
  };
  categoryMap2: { [key: string]: string } = {
    'my narratives': 'own',
    'shared with me': 'shared',
    'tutorials': 'tutorials',
    'public': 'public',
  };
}
