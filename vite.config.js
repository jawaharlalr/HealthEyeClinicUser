import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'api-serverless-dev',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/api')) {
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const apiName = urlObj.pathname.split('/')[2]; // e.g. "doctors" from "/api/doctors"
            // remove file extension or query string if present
            const apiBase = apiName ? apiName.split('?')[0] : '';
            const apiPath = path.join(process.cwd(), 'api', `${apiBase}.js`);
            
            if (fs.existsSync(apiPath)) {
              try {
                // Read request body if needed
                let body = {};
                if (req.method === 'POST' || req.method === 'PUT') {
                  const buffers = [];
                  for await (const chunk of req) {
                    buffers.push(chunk);
                  }
                  const rawBody = Buffer.concat(buffers).toString();
                  if (rawBody) {
                    try {
                      body = JSON.parse(rawBody);
                    } catch (e) {
                      body = rawBody;
                    }
                  }
                }

                // Import API handler dynamically
                const modulePath = apiPath.replace(/\\/g, '/');
                const { default: handler } = await import(`file://${modulePath}?t=${Date.now()}`);
                
                // Mock Vercel response object
                const vercelRes = {
                  status(code) {
                    res.statusCode = code;
                    return vercelRes;
                  },
                  json(data) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return vercelRes;
                  }
                };

                // Mock Vercel request object
                const query = Object.fromEntries(urlObj.searchParams);
                const vercelReq = {
                  method: req.method,
                  query,
                  body
                };

                await handler(vercelReq, vercelRes);
                return;
              } catch (e) {
                console.error("Local API Handler Error:", e);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
                return;
              }
            }
          }
          next();
        });
      }
    }
  ],
})
