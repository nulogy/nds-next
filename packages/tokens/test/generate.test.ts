import fs from 'node:fs/promises'
import path from 'node:path'
import { test, suite, afterEach, beforeEach } from 'node:test'
import assert from 'node:assert'
import { generateTokens } from '../src/build/generate.ts'
import { DEVICE_BASE_UNITS } from '../src/build/constants.ts'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

suite('generateTokens', () => {
  const tokensFixtureDir = path.resolve(__dirname, 'fixtures', 'tokens')

  let tmpOutputDir: string

  beforeEach(async () => {
    tmpOutputDir = await fs.mkdtemp(path.join(__dirname, 'temp-tokens-output-'))
  })

  afterEach(async () => {
    await fs.rm(tmpOutputDir, { recursive: true, force: true })
  })

  test('should generate token files from fixture tokens', async (t) => {
    await generateTokens(DEVICE_BASE_UNITS, tmpOutputDir, tokensFixtureDir)

    const tokensCssPath = path.join(tmpOutputDir, 'nds_tokens.css')
    const tokensJsPath = path.join(tmpOutputDir, 'nds_tokens.js')
    const tokensTsPath = path.join(tmpOutputDir, 'nds_tokens.ts')

    assert.doesNotThrow(async () => {
      await fs.access(tokensCssPath, fs.constants.F_OK)
      await fs.access(tokensJsPath, fs.constants.F_OK)
      await fs.access(tokensTsPath, fs.constants.F_OK)
    })

    const cssContent = await fs.readFile(tokensCssPath, 'utf8')
    const jsContent = await fs.readFile(tokensJsPath, 'utf8')

    t.assert.snapshot(cssContent);
    t.assert.snapshot(jsContent);
  })
})