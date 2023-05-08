import path from 'path';
import {
  appendFile,
  copyFile,
  mkdir,
  mkdirSync,
  readdir,
  rename,
  rmdir,
  stat,
  unlink,
  writeFile,
} from 'fs';

import type {
  AppendFileOptions,
  CopyOptions,
  DeleteFileOptions,
  FilesystemPlugin,
  GetUriOptions,
  GetUriResult,
  MkdirOptions,
  PermissionStatus,
  ReaddirOptions,
  ReaddirResult,
  ReadFileOptions,
  ReadFileResult,
  RmdirOptions,
  StatOptions,
  StatResult,
  WriteFileOptions,
  WriteFileResult,
} from '../../src/definitions';

import { convertDirectory, convertEncoding, getCleanPath, readFileAsync } from './utils';


export class Filesystem implements FilesystemPlugin {
  async readFile(options: ReadFileOptions): Promise<ReadFileResult> {
    const cleanPath = getCleanPath(options.path);
    const directory = convertDirectory(options.directory);
    const encoding = convertEncoding(options.encoding ?? null);
    try {
      const data: any = await readFileAsync(path.join(directory, cleanPath), { encoding });
      return { data };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
    return new Promise((resolve, reject) => {
      const cleanPath = getCleanPath(options.path);
      const directory = convertDirectory(options.directory);
      const encoding = convertEncoding(options.encoding ?? null);
      const uri = path.join(directory, cleanPath);
      stat(directory, (error) => {
        if (error) {
          if (options.recursive) {
            mkdirSync(directory, { recursive: true });
          }
        }
        writeFile(uri, options.data, encoding, (error) => {
          if (error) reject(error);
          else resolve({ uri });
        });
      });
    });
  }

  appendFile(options: AppendFileOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const cleanPath = getCleanPath(options.path);
      const directory = convertDirectory(options.directory);
      const encoding = convertEncoding(options.encoding ?? null);
      const uri = path.join(directory, cleanPath);
      appendFile(uri, options.data, encoding, error => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  deleteFile(options: DeleteFileOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const cleanPath = getCleanPath(options.path);
      const directory = convertDirectory(options.directory);
      const uri = path.join(directory, cleanPath);
      unlink(uri, error => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  mkdir(options: MkdirOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const cleanPath = getCleanPath(options.path);
      const directory = convertDirectory(options.directory);
      const uri = path.join(directory, cleanPath);
      mkdir(uri, { recursive: options.recursive }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  rmdir(options: RmdirOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const cleanPath = getCleanPath(options.path);
      const directory = convertDirectory(options.directory);
      const uri = path.join(directory, cleanPath);
      rmdir(uri, { recursive: options.recursive }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  readdir(options: ReaddirOptions): Promise<ReaddirResult> {
    return new Promise((resolve, reject) => {
      const cleanPath = getCleanPath(options.path);
      const directory = convertDirectory(options.directory);
      const uri = path.join(directory, cleanPath);
      readdir(uri, (error, files) => {
        if (error) reject(error);
        else resolve({ files });
      });
    });
  }

  async getUri(options: GetUriOptions): Promise<GetUriResult> {
    const cleanPath = getCleanPath(options.path);
    const directory = convertDirectory(options.directory);
    const uri = path.join(directory, cleanPath);
    return { uri };
  }

  async stat(options: StatOptions): Promise<StatResult> {
    return new Promise((resolve, reject) => {
      const cleanPath = getCleanPath(options.path);
      const directory = convertDirectory(options.directory);
      const uri = path.join(directory, cleanPath);
      stat(uri, (error, result) => {
        if(error) reject(error)
        else{
          resolve({
            type: (result.isDirectory() ? 'directory' : (result.isFile() ? 'file' : 'Not available')),
            size: result.size,
            ctime: result.ctimeMs,
            mtime: result.mtimeMs,
            uri
          })
        }
      })
    });
  }

  async rename(options: CopyOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const fromPath = getCleanPath(options.from);
      const fromDirectory = convertDirectory(options.directory);
      const toPath = getCleanPath(options.to);
      const toDirectory = convertDirectory(options.toDirectory);
      const fromUri = path.join(fromDirectory, fromPath);
      const toUri = path.join(toDirectory, toPath);
      rename(fromUri, toUri, (error) => {
        if(error) reject(error)
        else resolve()
      })
    });
  }

  async copy(options: CopyOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const fromPath = getCleanPath(options.from);
      const fromDirectory = convertDirectory(options.directory);
      const toPath = getCleanPath(options.to);
      const toDirectory = convertDirectory(options.toDirectory);
      const fromUri = path.join(fromDirectory, fromPath);
      const toUri = path.join(toDirectory, toPath);
      copyFile(fromUri, toUri, (error) => {
        if(error) reject(error)
        else resolve()
      })
    });
  }

  async checkPermissions(): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }

  async requestPermissions(): Promise<PermissionStatus> {
    throw new Error('Method not implemented.');
  }
}
