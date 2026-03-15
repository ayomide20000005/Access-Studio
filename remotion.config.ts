// PATH: remotion.config.ts

import { Config } from '@remotion/cli/config'

// Disable caching to prevent ENOENT webpack rename errors on Windows
Config.setCachingEnabled(false)