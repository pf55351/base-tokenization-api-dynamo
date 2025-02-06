import { FolderModel, IFolder } from '@/libs/aws/dynamo/models/folder-model';

export const addFolder = async (name: string) => {
  try {
    const folder = new FolderModel({
      uuid: crypto.randomUUID(),
      name,
    });
    await folder.save();
    return folder;
  } catch (error) {
    console.error(error);
  }
};

export const isFolderExist = async (name: string) => {
  try {
    const result = await FolderModel.query('name').eq(name).count().exec();
    return result.count > 0;
  } catch (error) {
    console.error(error);
  }
};

export const getFolderIdByUUID = async (uuid: string) => {
  try {
    const folder = await FolderModel.query('uuid').eq(uuid).limit(1).exec();
    return folder[0] as IFolder;
  } catch (error) {
    console.error(error);
  }
};

export const getFolders = async () => {
  try {
    return await FolderModel.scan().exec();
  } catch (error) {
    console.error(error);
  }
};
