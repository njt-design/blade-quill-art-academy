import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: '/workspace/artifacts/blade-quill/tina/__generated__/.cache/1787239743062', url: 'http://localhost:4001/graphql', token: 'skip-cloud-checks-local-build', queries,  });
export default client;
  