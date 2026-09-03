import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: '/workspace/artifacts/blade-quill/tina/__generated__/.cache/1788411059049', url: 'http://localhost:4001/graphql', token: 'local-build-placeholder', queries,  });
export default client;
  