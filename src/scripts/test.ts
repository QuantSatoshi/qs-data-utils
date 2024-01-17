import { mkdirp } from 'mkdirp';
import { createFoldersRecursive } from '../utils/dataPathUtils';

export async function main() {
  console.log(`createFoldersRecursive`);
  await createFoldersRecursive(`./market-data/abc/def/aaa.gz`);
}
main();
