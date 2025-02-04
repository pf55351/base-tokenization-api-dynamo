import { IS_OFFLINE, STAGE } from '@/config';
import { Item } from 'dynamoose/dist/Item';
import dynamoose from '@/libs/aws/dynamo';

export interface IFile extends Item {
  id: number;
  uuid: string;
  name: string;
  description: string;
  file_name: string;
  size: number;
  sha256: string;
  mimetype: string;
  s3: boolean;
  folder_id?: number;
  asset_id: number;
  metadata_cid: string;
  wallet: string;
  created_at: Date;
}

const fileSchema = new dynamoose.Schema(
  {
    id: {
      type: Number,
      hashKey: true,
      default: () => Date.now(),
    },
    uuid: {
      type: String,
      required: true,
      default: () => crypto.randomUUID(),
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
    description: {
      type: String,
      required: true,
    },
    file_name: {
      type: String,
      required: true,
      index: {
        type: 'global',
        name: 'file_name-index',
      },
    },
    size: {
      type: Number,
    },
    sha256: {
      type: String,
      required: true,
      index: {
        type: 'global',
        name: 'sha256-index',
      },
    },
    mimetype: {
      type: String,
      required: true,
    },
    s3: {
      type: Boolean,
    },
    folder_id: {
      type: Number,
      index: {
        type: 'global',
        name: 'folder_id-index',
      },
    },
    asset_id: {
      type: Number,
      required: true,
    },
    metadata_cid: {
      type: String,
      required: true,
    },
    wallet: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
    saveUnknown: true,
  }
);

export const FileModel = dynamoose.model<IFile>(`file-${STAGE}`, fileSchema, {
  create: IS_OFFLINE,
  waitForActive: true,
});
