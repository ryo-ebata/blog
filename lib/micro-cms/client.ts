import { createClient } from 'microcms-js-sdk';
import { envConfig } from '@/config/env';

export const microCmsClient = createClient({
  serviceDomain: envConfig.microCms.MICROCMS_SERVICE_DOMAIN,
  apiKey: envConfig.microCms.MICROCMS_API_KEY,
});
