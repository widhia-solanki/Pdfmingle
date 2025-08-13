[23:38:28.495] Running build in Washington, D.C., USA (East) – iad1
[23:38:28.507] Build machine configuration: 2 cores, 8 GB
[23:38:28.563] Cloning github.com/xway-products/Pdfmingle (Branch: main, Commit: 4b2f69a)
[23:38:29.732] Cloning completed: 1.169s
[23:38:30.480] Restored build cache from previous deployment (AGY3JLKiMPRX7JK51wVhX2sRWvv8)
[23:38:32.363] Running "vercel build"
[23:38:32.867] Vercel CLI 44.7.3
[23:38:33.453] Installing dependencies...
[23:38:34.090] Collecting Flask (from -r /vercel/path0/requirements.txt (line 1))
[23:38:34.122]   Downloading flask-3.1.1-py3-none-any.whl.metadata (3.0 kB)
[23:38:34.150] Collecting PyPDF2 (from -r /vercel/path0/requirements.txt (line 2))
[23:38:34.153]   Downloading pypdf2-3.0.1-py3-none-any.whl.metadata (6.8 kB)
[23:38:34.194] Collecting Flask-Cors (from -r /vercel/path0/requirements.txt (line 3))
[23:38:34.199]   Downloading flask_cors-6.0.1-py3-none-any.whl.metadata (5.3 kB)
[23:38:34.238] Collecting blinker>=1.9.0 (from Flask->-r /vercel/path0/requirements.txt (line 1))
[23:38:34.241]   Downloading blinker-1.9.0-py3-none-any.whl.metadata (1.6 kB)
[23:38:34.264] Collecting click>=8.1.3 (from Flask->-r /vercel/path0/requirements.txt (line 1))
[23:38:34.268]   Downloading click-8.2.1-py3-none-any.whl.metadata (2.5 kB)
[23:38:34.284] Collecting itsdangerous>=2.2.0 (from Flask->-r /vercel/path0/requirements.txt (line 1))
[23:38:34.288]   Downloading itsdangerous-2.2.0-py3-none-any.whl.metadata (1.9 kB)
[23:38:34.310] Collecting jinja2>=3.1.2 (from Flask->-r /vercel/path0/requirements.txt (line 1))
[23:38:34.313]   Downloading jinja2-3.1.6-py3-none-any.whl.metadata (2.9 kB)
[23:38:34.368] Collecting markupsafe>=2.1.1 (from Flask->-r /vercel/path0/requirements.txt (line 1))
[23:38:34.372]   Downloading MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (4.0 kB)
[23:38:34.404] Collecting werkzeug>=3.1.0 (from Flask->-r /vercel/path0/requirements.txt (line 1))
[23:38:34.407]   Downloading werkzeug-3.1.3-py3-none-any.whl.metadata (3.7 kB)
[23:38:34.444] Downloading flask-3.1.1-py3-none-any.whl (103 kB)
[23:38:34.451]    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 103.3/103.3 kB 22.1 MB/s eta 0:00:00
[23:38:34.457] Downloading pypdf2-3.0.1-py3-none-any.whl (232 kB)
[23:38:34.462]    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 232.6/232.6 kB 50.3 MB/s eta 0:00:00
[23:38:34.465] Downloading flask_cors-6.0.1-py3-none-any.whl (13 kB)
[23:38:34.470] Downloading blinker-1.9.0-py3-none-any.whl (8.5 kB)
[23:38:34.475] Downloading click-8.2.1-py3-none-any.whl (102 kB)
[23:38:34.479]    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 102.2/102.2 kB 55.1 MB/s eta 0:00:00
[23:38:34.482] Downloading itsdangerous-2.2.0-py3-none-any.whl (16 kB)
[23:38:34.487] Downloading jinja2-3.1.6-py3-none-any.whl (134 kB)
[23:38:34.493]    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 134.9/134.9 kB 44.2 MB/s eta 0:00:00
[23:38:34.496] Downloading MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (23 kB)
[23:38:34.501] Downloading werkzeug-3.1.3-py3-none-any.whl (224 kB)
[23:38:34.507]    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 224.5/224.5 kB 70.4 MB/s eta 0:00:00
[23:38:34.537] Installing collected packages: PyPDF2, markupsafe, itsdangerous, click, blinker, werkzeug, jinja2, Flask, Flask-Cors
[23:38:35.083] Successfully installed Flask-3.1.1 Flask-Cors-6.0.1 PyPDF2-3.0.1 blinker-1.9.0 click-8.2.1 itsdangerous-2.2.0 jinja2-3.1.6 markupsafe-3.0.2 werkzeug-3.1.3
[23:38:35.083] WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
[23:38:35.200] Installing dependencies...
[23:38:52.859] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[23:38:53.254] npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
[23:38:53.948] npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
[23:38:54.015] npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
[23:38:54.016] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[23:38:55.024] npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
[23:38:58.932] 
[23:38:58.933] added 194 packages, removed 104 packages, and changed 11 packages in 23s
[23:38:58.936] 
[23:38:58.936] 153 packages are looking for funding
[23:38:58.937]   run `npm fund` for details
[23:38:58.979] Running "npm run build"
[23:38:59.088] 
[23:38:59.089] > pdfmingle-next@0.0.0 build
[23:38:59.089] > next build
[23:38:59.089] 
[23:38:59.636] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[23:38:59.636] This information is used to shape Next.js' roadmap and prioritize features.
[23:38:59.637] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[23:38:59.638] https://nextjs.org/telemetry
[23:38:59.638] 
[23:38:59.729]   ▲ Next.js 14.2.3
[23:38:59.731] 
[23:38:59.732]    Linting and checking validity of types ...
[23:39:00.055] 
[23:39:00.057]    We detected TypeScript in your project and reconfigured your tsconfig.json file for you. Strict-mode is set to false by default.
[23:39:00.057]    The following suggested values were added to your tsconfig.json. These values can be changed to fit your project's needs:
[23:39:00.057] 
[23:39:00.058]    	- lib was set to dom,dom.iterable,esnext
[23:39:00.058]    	- strict was set to false
[23:39:00.058]    	- noEmit was set to true
[23:39:00.058]    	- incremental was set to true
[23:39:00.059]    	- include was set to ['next-env.d.ts', '**/*.ts', '**/*.tsx']
[23:39:00.059]    	- exclude was set to ['node_modules']
[23:39:00.059] 
[23:39:00.059]    The following mandatory changes were made to your tsconfig.json:
[23:39:00.059] 
[23:39:00.059]    	- module was set to esnext (for dynamic import() support)
[23:39:00.059]    	- esModuleInterop was set to true (requirement for SWC / babel)
[23:39:00.059]    	- moduleResolution was set to node (to match webpack resolution)
[23:39:00.059]    	- resolveJsonModule was set to true (to match webpack resolution)
[23:39:00.059]    	- isolatedModules was set to true (requirement for SWC / Babel)
[23:39:00.059]    	- jsx was set to preserve (next.js implements its own optimized jsx transform)
[23:39:00.060] 
[23:39:07.758] Failed to compile.
[23:39:07.759] 
[23:39:07.759] ./src/components/ToolPageLayout.tsx:46:12
[23:39:07.759] Type error: Type '{}' is missing the following properties from type 'PDFProcessorProps': files, onFilesChange, onProcess, status, and 2 more.
[23:39:07.760] 
[23:39:07.760] [0m [90m 44 |[39m         [0m
[23:39:07.760] [0m [90m 45 |[39m         [33m<[39m[33mdiv[39m className[33m=[39m[32m"mt-8 md:mt-12 w-full"[39m[33m>[39m[0m
[23:39:07.761] [0m[31m[1m>[22m[39m[90m 46 |[39m           [33m<[39m[33mPDFProcessor[39m [33m/[39m[33m>[39m[0m
[23:39:07.761] [0m [90m    |[39m            [31m[1m^[22m[39m[0m
[23:39:07.761] [0m [90m 47 |[39m         [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m[0m
[23:39:07.761] [0m [90m 48 |[39m         [0m
[23:39:07.762] [0m [90m 49 |[39m         [33m<[39m[33msection[39m className[33m=[39m[32m"text-left max-w-3xl mx-auto mt-16 md:mt-24"[39m[33m>[39m[0m
[23:39:07.825] Error: Command "npm run build" exited with 1
