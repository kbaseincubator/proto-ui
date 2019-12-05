// below export is needed to avoid
// Error: Augmentations for the global scope can only be directly nested
// in external modules or ambient module declarations.ts(2669)
export {}

declare global {
  interface Window {
    _env: {
      basepath: string;
      url_prefix: string;
      username?: string | null;
      narrative: string;
      kbase_endpoint: string;
      token: string;
      auth_required: boolean;
    }
  }
}

