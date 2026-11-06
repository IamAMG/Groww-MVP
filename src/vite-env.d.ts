/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No env variables required for localStorage mode
}

interface ImportMeta {
  env: ImportMetaEnv
}
