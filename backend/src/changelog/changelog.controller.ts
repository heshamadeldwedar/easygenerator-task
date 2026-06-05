import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'
import { Public } from '@/common/decorators/public.decorator'
import { ChangelogService } from './changelog.service'

@ApiTags('Changelog')
@Controller('changelog')
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get application changelog' })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['json', 'raw'],
    description:
      'Response format: json (default, wrapped in envelope) or raw (plain markdown)',
  })
  @ApiResponse({
    status: 200,
    description: 'Changelog content',
  })
  async getChangelog(
    @Query('format') format?: 'json' | 'raw',
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    const content = await this.changelogService.getChangelog()

    if (format === 'raw') {
      response?.type('text/markdown; charset=utf-8')
      return content
    }

    return { content }
  }
}
