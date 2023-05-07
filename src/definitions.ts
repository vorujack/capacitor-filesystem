export interface FilesystemPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
