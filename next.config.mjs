import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
export default {turbopack:{root},outputFileTracingRoot:root,experimental:{cpus:2}};
