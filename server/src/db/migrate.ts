import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

async function main() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL não foi definida no .env')
  }

  const migrationClient = postgres(connectionString, { max: 1 })
  const db = drizzle(migrationClient)

  console.log('Executando migrations...')
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  console.log('Migrations executadas com sucesso.')

  await migrationClient.end()
  process.exit(0)
}

main().catch((error) => {
  console.error('Falha ao executar migrations:', error)
  process.exit(1)
})
