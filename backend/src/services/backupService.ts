import { S3 } from 'aws-sdk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createReadStream, statSync } from 'fs';
import { promises as fs } from 'fs';

const execAsync = promisify(exec);

class BackupService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async createBackup() {
    const timestamp = new Date().toISOString();
    const filename = `backup-${timestamp}.sql`;

    try {
      // Create database dump
      await execAsync(`pg_dump ${process.env.DATABASE_URL} > ${filename}`);

      // Upload to S3
      await this.s3
        .upload({
          Bucket: process.env.BACKUP_BUCKET!,
          Key: filename,
          Body: createReadStream(filename),
        })
        .promise();

      // Get file size
      const size = statSync(filename).size;

      // Clean up local file
      await fs.unlink(filename);

      return {
        filename,
        timestamp,
        size,
      };
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup');
    }
  }

  async restoreBackup(filename: string) {
    try {
      // Download from S3
      const { Body } = await this.s3
        .getObject({
          Bucket: process.env.BACKUP_BUCKET!,
          Key: filename,
        })
        .promise();

      // Save the backup file locally
      await fs.writeFile(filename, Body as Buffer);

      // Restore database
      await execAsync(`psql ${process.env.DATABASE_URL} < ${filename}`);

      // Clean up local file
      await fs.unlink(filename);
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error('Failed to restore backup');
    }
  }
}

export default BackupService;