/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHELBY_API_KEY: string;
  readonly VITE_APTOS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
