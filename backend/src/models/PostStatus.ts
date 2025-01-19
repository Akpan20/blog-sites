export const PostStatus = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
    DELETED: 'deleted',
  } as const;
  
  // Type definition for PostStatus
  export type PostStatusType = typeof PostStatus[keyof typeof PostStatus];
  