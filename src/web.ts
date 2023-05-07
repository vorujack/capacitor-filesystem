import { WebPlugin } from '@capacitor/core';

import type { FilesystemPlugin } from './definitions';

export class FilesystemWeb extends WebPlugin implements FilesystemPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
