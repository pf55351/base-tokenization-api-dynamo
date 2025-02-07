import { IS_OFFLINE, STAGE } from '@/config';
import { Item } from 'dynamoose/dist/Item';
import dynamoose from '@/libs/aws/dynamo';

export interface IFolder extends Item {
  uuid: string;
  name: string;
}

const folderSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      hashKey: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: () => Date.now(),
      index: {
        type: 'global',
        name: 'created_at-index',
      },
    },
    name: {
      type: String,
      required: true,
      index: {
        type: 'global',
        name: 'name-index',
      },
    },
  },
  {
    saveUnknown: false,
  }
);

export const FolderModel = dynamoose.model<IFolder>(`folder-${STAGE}`, folderSchema, {
  create: IS_OFFLINE,
  waitForActive: true,
});
