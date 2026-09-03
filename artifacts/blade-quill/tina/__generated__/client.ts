import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: '/workspace/artifacts/blade-quill/tina/__generated__/.cache/1788406580175', url: 'http://localhost:4001/graphql', token: 'b03e66d84d16ae681e13d514e082ec19ab18244c', queries,  });
export default client;
  