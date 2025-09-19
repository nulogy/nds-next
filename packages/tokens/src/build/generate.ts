import path from 'node:path'
import fs from 'node:fs/promises'
import { formatTokens, wrapCss, wrapJs } from './format.ts'
import { snakeCase } from 'es-toolkit'
import type { Device } from './constants.ts'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Processes a single token folder.
 * @param folder The name of the token folder.
 * @param tokenDir The root tokens directory.
 * @param devices Array of devices to process.
 * @param deviceBaseUnits The base units for devices.
 * @returns An object with header, cssVars, and jsExports or null if processing fails.
 */
async function processTokenFolder(
  folder: string,
  tokenDir: string,
  devices: Array<Device>,
  deviceBaseUnits: Record<Device, number>,
): Promise<{ header: string; cssVars: string[]; jsExports: string[] } | null> {
  try {
    const module = await import(path.join(tokenDir, folder, 'index.ts'))
    const tokensFn = module.default
    const folderName = snakeCase(folder)

    const formattedForDevices = devices.map((device, index) => {
      const baseUnit = deviceBaseUnits[device]
      const tokens = tokensFn(baseUnit)
      return formatTokens(tokens, folderName, device, [], index === 0)
    })

    const isFormatted = formattedForDevices.length > 0
    const firstFormatted = isFormatted ? formattedForDevices[0] : null

    if (isFormatted && firstFormatted) {
      const header = firstFormatted.header
      const combinedCssVars = formattedForDevices.flatMap((f) => f.cssVars)
      const combinedJsExports = formattedForDevices.flatMap((f) => f.jsExports)
      return {
        header,
        cssVars: combinedCssVars,
        jsExports: combinedJsExports,
      }
    }
    return null
  } catch (err) {
    console.error(`Error processing folder ${folder}:`, err)
    return null
  }
}

async function prepareOutputDir(outputDir: string) {
  try {
    await fs.access(outputDir, fs.constants.F_OK);
    return true;
  } catch (err) {
    await fs.mkdir(outputDir, { recursive: true })
    return true;
  }
}

/**
 * Writes the combined CSS and JS output files to the output directory.
 * @param outputDir The full path of the output directory.
 * @param combinedCss The combined CSS string.
 * @param combinedJs The combined JS string.
 */
async function writeOutputFiles(outputDir: string, combinedCss: string, combinedJs: string) {
  await prepareOutputDir(outputDir)

  await fs.writeFile(path.join(outputDir, 'nds_tokens.css'), combinedCss)
  await fs.writeFile(path.join(outputDir, 'nds_tokens.js'), combinedJs)

  // We generate a TypeScript file because we want to generate type declarations for the tokens.
  await fs.writeFile(path.join(outputDir, 'nds_tokens.ts'), combinedJs)
}

/**
 * Generates tokens by reading token modules from a tokens folder, formatting them, and writing output files.
 * @param deviceBaseUnits The mapping of devices to base units.
 * @param outputDirName The name of the output folder (relative to the project root).
 * @param tokensDir Optional. The tokens directory to use (defaults to ../tokens).
 */
export async function generateTokens(
  deviceBaseUnits: Record<Device, number>,
  outputDirName: string,
  tokensDir: string = path.resolve(__dirname, '../tokens'),
) {
  const tokenFolders = await fs.readdir(tokensDir);
  await Promise.all(tokenFolders.filter(async (folder) => (await fs.stat(path.join(tokensDir, folder))).isDirectory()));

  const folderGroups: Record<string, { header: string; cssVars: string[]; jsExports: string[] }> = {}
  const devices = Object.keys(deviceBaseUnits) as Array<Device>

  await Promise.all(
    tokenFolders.map(async (folder) => {
      const result = await processTokenFolder(folder, tokensDir, devices, deviceBaseUnits)
      if (result) {
        folderGroups[snakeCase(folder)] = result
      }
    }),
  )

  const cssGroupArray = Object.values(folderGroups).map((group) => ({
    header: group.header,
    cssVars: group.cssVars,
  }))

  const jsGroupArray = Object.values(folderGroups).map((group) => ({
    header: group.header,
    jsExports: group.jsExports,
  }))

  const combinedCss = wrapCss(cssGroupArray)
  const combinedJs = wrapJs(jsGroupArray)

  const outputDir = path.join(__dirname, '..', '..', '..', outputDirName)
  await writeOutputFiles(outputDir, combinedCss, combinedJs)

  console.log(`Generated tokens for ${tokenFolders.join(', ')}`)
}