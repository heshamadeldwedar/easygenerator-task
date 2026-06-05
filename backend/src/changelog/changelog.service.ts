import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { readFile } from 'fs/promises'
import { join } from 'path'

@Injectable()
export class ChangelogService implements OnModuleInit {
  private readonly logger = new Logger(ChangelogService.name)
  private cachedChangelog: string | null = null
  private readonly changelogPath = join(process.cwd(), 'CHANGELOG.md')

  async onModuleInit() {
    await this.loadChangelog()
  }

  async getChangelog(): Promise<string> {
    if (this.cachedChangelog !== null) {
      return this.cachedChangelog
    }
    return this.loadChangelog()
  }

  private async loadChangelog(): Promise<string> {
    try {
      this.cachedChangelog = await readFile(this.changelogPath, 'utf-8')
      this.logger.log(`Changelog loaded from ${this.changelogPath}`)
      return this.cachedChangelog
    } catch {
      this.logger.warn(
        `CHANGELOG.md not found at ${this.changelogPath}, using placeholder`,
      )
      this.cachedChangelog = '# Changelog\n\nNo changelog available yet.'
      return this.cachedChangelog
    }
  }
}
