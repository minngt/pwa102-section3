/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
import path from "path";
import fs from "fs";
import merge from "lodash.merge";


/**
 * Loads and merges config for a test case by priority:
 * 1. by_env.case_config[caseId]
 * 2. by_env.suite_config
 * 3. common.case_config[caseId]
 * 4. common.suite_config
 * @param testFilePath Path to the test file (e.g. /path/to/login.spec.ts)
 * @param caseId The case ID (e.g. 'AUTH_001')
 * @param env The environment (e.g. 'dev')
 * @returns { data: object, expect: object }
 * @throws if config file or required config not found
 */
export function loadMergedConfig(testFilePath: string, caseId: string, env: string): any {
    const testDir = path.dirname(testFilePath);
    const testBase = path.basename(testFilePath, '.spec.ts');
    const jsonFile = path.join(testDir, `${testBase}.json`);
    if (!fs.existsSync(jsonFile)) {
        throw new Error(`Config file not found: ${jsonFile}`);
    }
    let configRaw;
    try {
        configRaw = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    } catch (e) {
        throw new Error(`Failed to parse config file ${jsonFile}: ${(e as Error).message}`);
    }
    // Helper to safely get nested config
    const get = (obj: any, ...keys: string[]) => keys.reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    const merged = {};

    const global = get(configRaw, 'global', 'global_config') || {};
    merge(merged, global || {})
    // 1. common.suite_config
    const commonSuite = get(configRaw, 'common', 'suite_config') || {};
    merge(merged, commonSuite || {});

    // 2. common.case_config[caseId]
    const commonCase = get(configRaw, 'common', 'case_config', caseId) || {};
    merge(merged, commonCase || {});

    // 3. by_env.suite_config
    const envSuite = get(configRaw, 'by_env', env, 'suite_config') || {};
    merge(merged, envSuite || {});

    // 4. by_env.case_config[caseId]
    const envCase = get(configRaw, 'by_env', env, 'case_config', caseId) || {};
    merge(merged, envCase || {});

    // If nothing was merged, throw
    if (Object.keys(merged).length === 0) {
        throw new Error(`No config found for case '${caseId}' in file ${jsonFile} (env: ${env})`);
    }

    return merged;
}