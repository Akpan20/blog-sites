declare module 'pg-backup' {
    export function backup(options: any): Promise<void>;
  }