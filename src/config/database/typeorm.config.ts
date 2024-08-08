import 'dotenv/config'

import { ConfigService, registerAs } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource, type DataSourceOptions } from 'typeorm'

import { EnvService } from '@config/env'

const envService = new EnvService(new ConfigService())

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envService.get('DATABASE_HOST'),
  port: envService.get('DATABASE_PORT'),
  username: envService.get('DATABASE_USERNAME'),
  password: envService.get('DATABASE_PASSWORD'),
  database: envService.get('DATABASE_NAME'),
  migrationsRun: true,
  autoLoadEntities: true,
  synchronize: false,
}

export const typeorm = registerAs('typeorm', () => typeOrmConfig)
export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions
)
