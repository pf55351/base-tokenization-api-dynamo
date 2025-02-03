import { addFolder, getFolderIdByUUID, getFolders, isFolderExist } from '@/repositories/folder';

export const addFolderService = async (folderName: string) => {
  const newFolder = await addFolder(folderName);
  const { uuid, name } = newFolder;
  return { uuid, name };
};

export const findFolderByNameService = async (folderName: string) => {
  return await isFolderExist(folderName);
};

export const getFolderIdService = async (folderUUID: string) => {
  return await getFolderIdByUUID(folderUUID);
};

export const getFoldersService = async () => {
  const res = await getFolders();
  return res.map((item) => ({ name: item.name, uuid: item.uuid }));
};
