import { FolderModel, IFolder } from '@/libs/aws/dynamo/models/folder-model';

export const addFolder = async (name: string) => {
  const folder = new FolderModel({
    name,
  });
  await folder.save();
  return folder;
};

export const isFolderExist = async (name: string) => {
  const result = await FolderModel.query('name').eq(name).count().exec();
  return result.count > 0;
};

export const getFolderIdByUUID = async (uuid: string) => {
  const folder = await FolderModel.query('uuid').eq(uuid).limit(1).exec();
  return folder[0] as IFolder;
};

export const getFolders = async () => {
  return await FolderModel.scan().exec();
};
