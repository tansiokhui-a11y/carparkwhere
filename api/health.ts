import type { IncomingMessage, ServerResponse } from 'http';

interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  service: string;
  environment: {
    ltaAccountKeyConfigured: boolean;
    nodeEnv: string;
  };
  endpoints: {
    health: string;
    carparkAvailability: string;
  };
  uptimeSeconds: number;
}

/**
 * Health check handler for serverless and Express environments.
 * Returns operational status and verifies if LTA_ACCOUNT_KEY is configured.
 */
export default async function handler(
  req: IncomingMessage & { query?: any; url?: string },
  res: ServerResponse & {
    status?: (code: number) => any;
    json?: (body: any) => any;
    setHeader: (name: string, value: string) => any;
  }
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(204).end();
    }
    res.statusCode = 204;
    return res.end();
  }

  const hasLtaKey = Boolean(
    process.env.LTA_ACCOUNT_KEY || 
    process.env.ACCOUNT_KEY || 
    process.env.VITE_LTA_ACCOUNT_KEY
  );

  const payload: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SG ParkSense Serverless API',
    environment: {
      ltaAccountKeyConfigured: hasLtaKey,
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    endpoints: {
      health: '/api/health',
      carparkAvailability: '/api/carparkavailability'
    },
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0)
  };

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(payload);
  }

  res.statusCode = 200;
  return res.end(JSON.stringify(payload, null, 2));
}

/**
 * Web Fetch / Next.js / Edge Runtime GET handler
 */
export async function GET() {
  const hasLtaKey = Boolean(
    process.env.LTA_ACCOUNT_KEY || 
    process.env.ACCOUNT_KEY || 
    process.env.VITE_LTA_ACCOUNT_KEY
  );

  const payload: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SG ParkSense Serverless API',
    environment: {
      ltaAccountKeyConfigured: hasLtaKey,
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    endpoints: {
      health: '/api/health',
      carparkAvailability: '/api/carparkavailability'
    },
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0)
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
