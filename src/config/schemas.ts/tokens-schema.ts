import { transpileSchema } from '@middy/validator/transpile';

const fileSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'object',
      properties: {
        filenam: { type: 'string' },
        mimetype: { type: 'string' },
        encoding: { type: 'string' },
        truncated: { type: 'boolean' },
        content: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            data: {
              type: 'array',
              items: { type: 'integer', minimum: 0, maximum: 255 },
            },
          },
        },
      },
    },
  },
};

export const createTokenSchema = transpileSchema({
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['name', 'description', 'is_file_stored', 'file'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        is_file_stored: { type: 'string' },
        folder_uuid: { type: 'string' },
        file: { ...fileSchema },
      },
    },
  },
});

export const verifyTokenizationSchema = transpileSchema({
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { ...fileSchema },
      },
    },
  },
});
