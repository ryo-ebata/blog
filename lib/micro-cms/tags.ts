import type { MicroCMSListResponse, MicroCMSTag } from './types';
import { microCmsClient } from './client';

const MICROCMS_LIST_LIMIT = 100;
const ENDPOINT = 'tags';

export const getAllTags = async (): Promise<string[]> => {
  const allTags: MicroCMSTag[] = [];
  let offset = 0;
  let totalCount = 0;

  do {
    const response: MicroCMSListResponse<MicroCMSTag> = await microCmsClient.getList({
      endpoint: ENDPOINT,
      queries: { limit: MICROCMS_LIST_LIMIT, offset },
    });

    allTags.push(...response.contents);
    totalCount = response.totalCount;
    offset += MICROCMS_LIST_LIMIT;
  } while (offset < totalCount);

  return allTags.map((tag) => tag.name);
};
