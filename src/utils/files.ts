import { extname } from 'path';
import { readdirSync } from 'fs';

/**
 * Get all of the .ts and .graphql files in a given folder
 * @param folder to get files from
 * @returns Dirent[]: .ts and .graphql files in the folder
 */
export function getFiles(folder: string) {
  //Read all .ts and .graphql files from a folder
  const filenames = readdirSync(folder, { withFileTypes: true });
  return filenames.filter((file) => {
    const extension = extname(file.name).toLowerCase();

    return extension === '.ts' || extension === '.graphql';
  });
}
