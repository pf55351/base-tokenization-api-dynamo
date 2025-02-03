import { transpileSchema } from '@middy/validator/transpile';

export const addFolderSchema = transpileSchema({
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      properties: {
        folder_name: {
          type: 'string',
        },
      },
      required: ['folder_name'],
    },
  },
});
