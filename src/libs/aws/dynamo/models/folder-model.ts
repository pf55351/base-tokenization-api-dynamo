import { Item } from 'dynamoose/dist/Item';
import { STAGE } from '@/config';
import dynamoose from '@/libs/aws/dynamo';
import { v4 as uuidv4 } from 'uuid';

export interface IFolder extends Item {
  id: number;
  uuid: string;
  name: string;
}

const folderSchema = new dynamoose.Schema(
  {
    id: {
      type: Number,
      hashKey: true,
      required: true,
      default: () => Date.now(),
    },
    uuid: {
      type: String,
      required: true,
      default: () => uuidv4(),
      index: {
        type: 'global',
        name: 'uuid-index',
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
    timestamps: true,
    saveUnknown: true,
  }
);

export const FolderModel = dynamoose.model<IFolder>(`folder-${STAGE}`, folderSchema, {
  create: false,
  waitForActive: true,
});
