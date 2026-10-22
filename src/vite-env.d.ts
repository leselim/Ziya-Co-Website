/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SIGNUP_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
