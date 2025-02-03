export const mimeTypes = [
  'application/pdf',
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'text/plain',
  'application/xml',
  'text/xml',
] as const;

export type ALLOWED_MIMETYPES = (typeof mimeTypes)[number];

export type TokenRequestData = {
  name: string;
  description: string;
  is_file_stored: string;
  folder_uuid?: string;
  file: FileToTokenize;
  withSignature?: boolean;
};

export type FileToTokenize = {
  filename: string;
  mimetype: ALLOWED_MIMETYPES;
  encoding: string;
  truncated: boolean;
  content: Buffer;
};

export type FilePath = {
  fileUUID: string;
};

export type Search = {
  search?: string | undefined;
};
