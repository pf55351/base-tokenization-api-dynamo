import { IS_OFFLINE, STAGE } from '@/config';
import { Item } from 'dynamoose/dist/Item';
import dynamoose from '@/libs/aws/dynamo';
import { v4 as uuidv4 } from 'uuid';

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
      default: () => uuidv4(),
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
    timestamps: true,
    saveUnknown: true,
  }
);

export const FolderModel = dynamoose.model<IFolder>(`folder-${STAGE}`, folderSchema, {
  create: IS_OFFLINE,
  waitForActive: true,
});
