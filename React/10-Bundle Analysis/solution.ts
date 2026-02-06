// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Analyzing Your Bundle
// ------------------------------------------------------------
// Run these commands to analyze your bundle:
// npm install --save-dev webpack-bundle-analyzer
// npx webpack-bundle-analyzer dist/bundle.js

// Open the report and look for:
// - Large libraries (e.g., chart.js, moment, lodash)
// - Duplicates (e.g., two versions of react)
// - Your own code's size

// Example analysis function
function analyzeBundle(): void {
    console.log(`
Bundle Analysis Steps:
1. Install analyzer: npm install --save-dev webpack-bundle-analyzer
2. Build your project: npm run build
3. Run analyzer: npx webpack-bundle-analyzer dist/bundle.js
4. Look for:
   - Large libraries (chart.js, moment, lodash)
   - Duplicate packages
   - Unexpectedly large chunks
    `);
}

// ------------------------------------------------------------
// B. Reducing Bundle Size: Example
// ------------------------------------------------------------

// BEFORE (imports entire lodash library - ~70KB):
// import _ from 'lodash';
// const result = _.debounce(fn, 300);

// AFTER (imports only debounce function - ~2KB):
// import debounce from 'lodash/debounce';
// const result = debounce(fn, 300);

// Example of optimized imports
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

// Example function using optimized lodash imports
function createDebouncedSearch(searchFn: (query: string) => void) {
    // The second form only includes the debounce function, not all of lodash
    return debounce(searchFn, 300);
}

function createThrottledScroll(scrollFn: () => void) {
    return throttle(scrollFn, 100);
}

// ------------------------------------------------------------
// C. TypeScript Config for Better Bundling
// ------------------------------------------------------------
// Recommended tsconfig.json settings for bundle optimization:
/*
{
    "compilerOptions": {
        "module": "esnext",          // Enables tree shaking
        "target": "es2017",          // Modern JavaScript output
        "moduleResolution": "node",  // Standard module resolution
        "esModuleInterop": true,     // Better interop with CommonJS
        "declaration": false,        // No .d.ts files in production
        "removeComments": true       // Remove comments for smaller size
    }
}
*/

// This setup helps bundlers tree shake unused code and reduces output size

const recommendedTsConfig = {
    compilerOptions: {
        module: "esnext",
        target: "es2017",
        moduleResolution: "node",
        esModuleInterop: true,
        declaration: false,
        removeComments: true
    }
};

// ------------------------------------------------------------
// D. Minifying and Compressing
// ------------------------------------------------------------
// Use Terser or esbuild for minification

// Example webpack.config.js with TerserPlugin:
/*
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
*/

// Minification removes whitespace, comments, and dead code

const webpackOptimizationConfig = {
    optimization: {
        minimize: true,
        minimizer: ['TerserPlugin'],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Use Webpack Bundle Analyzer on your project
// ------------------------------------------------------------
function runBundleAnalyzer(): void {
    console.log(`
Steps to analyze your bundle:
1. Install: npm install --save-dev webpack-bundle-analyzer
2. For Webpack: npx webpack-bundle-analyzer dist/bundle.js
3. For Vite: npm install --save-dev rollup-plugin-visualizer
4. For Next.js: npm install @next/bundle-analyzer
    `);
}

// ------------------------------------------------------------
// Challenge 2: Identify the three largest libraries in your bundle
// ------------------------------------------------------------
interface LibrarySize {
    name: string;
    size: string;
    recommendation: string;
}

const commonLargeLibraries: LibrarySize[] = [
    {
        name: 'moment.js',
        size: '~67KB (minified)',
        recommendation: 'Replace with date-fns (~2KB per function) or dayjs (~2KB)',
    },
    {
        name: 'lodash',
        size: '~70KB (full library)',
        recommendation: 'Use lodash-es or import individual functions',
    },
    {
        name: 'chart.js',
        size: '~60KB',
        recommendation: 'Use tree-shakable individual chart imports',
    },
];

// ------------------------------------------------------------
// Challenge 3: Refactor imports to only include what's needed
// ------------------------------------------------------------

// BAD: Imports entire library
// import moment from 'moment';
// const formatted = moment().format('YYYY-MM-DD');

// GOOD: Import only what you need from date-fns
// import { format } from 'date-fns';
// const formatted = format(new Date(), 'yyyy-MM-dd');

// BAD: Import all of lodash
// import _ from 'lodash';
// const unique = _.uniq(array);

// GOOD: Import individual functions
// import uniq from 'lodash/uniq';
// const unique = uniq(array);

function demonstrateOptimizedImports(): void {
    // Example of optimized import usage
    const searchFn = (query: string) => console.log('Searching:', query);
    const debouncedSearch = createDebouncedSearch(searchFn);

    console.log('Optimized lodash import - only debounce function is included');
}

// ------------------------------------------------------------
// Challenge 4: Change tsconfig.json to "module": "esnext"
// ------------------------------------------------------------
const updatedTsConfig = {
    compilerOptions: {
        // Changed from "commonjs" to "esnext" for tree shaking
        module: "esnext",
        target: "es2017",
        lib: ["ES2020", "DOM"],
        moduleResolution: "node",
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        // Remove for production
        declaration: false,
        removeComments: true,
    },
};

// ------------------------------------------------------------
// Challenge 5: Remove an unused library and measure savings
// ------------------------------------------------------------
interface BundleSavings {
    library: string;
    sizeBeforeRemoval: string;
    sizeAfterRemoval: string;
    savings: string;
}

function calculateSavings(before: number, after: number): BundleSavings {
    return {
        library: 'moment.js',
        sizeBeforeRemoval: `${before}KB`,
        sizeAfterRemoval: `${after}KB`,
        savings: `${before - after}KB (${((before - after) / before * 100).toFixed(1)}%)`,
    };
}

// Example: Removing moment.js
// Before: 350KB total bundle
// After: 283KB total bundle
// Savings: 67KB (19.1%)

// ------------------------------------------------------------
// Challenge 6 (Bonus): Add code splitting for admin page
// ------------------------------------------------------------
// See 09-Lazy Loading solution for code splitting implementation

const codeSplittingExample = `
// Before: Admin loaded with main bundle
import AdminPanel from './AdminPanel';

// After: Admin loaded only when needed
const AdminPanel = React.lazy(() => import('./AdminPanel'));

// Usage with Suspense
<Suspense fallback={<Loading />}>
    <AdminPanel />
</Suspense>

// Result: Initial bundle reduced, admin chunk loaded on demand
`;

// Export all utilities and configurations
export {
    analyzeBundle,
    createDebouncedSearch,
    createThrottledScroll,
    recommendedTsConfig,
    webpackOptimizationConfig,
    runBundleAnalyzer,
    commonLargeLibraries,
    demonstrateOptimizedImports,
    updatedTsConfig,
    calculateSavings,
    codeSplittingExample
};
