import type { IncomingMessage, ServerResponse } from 'http';

// Singapore LTA DataMall CarParkAvailabilityv2 Official Endpoint
const LTA_DATAMALL_ENDPOINT = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

export interface LTACarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // e.g. "1.29375 103.85718" (Lat Lng space-separated)
  AvailableLots: number;
  LotType: 'C' | 'Y' | 'H'; // C: Car, Y: Motorcycle, H: Heavy Vehicle
  Agency: 'HDB' | 'LTA' | 'URA';
}

export interface LTADatamallResponse {
  'odata.metadata'?: string;
  value: LTACarparkItem[];
}

export interface NormalizedCarparkItem {
  id: string;
  name: string;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availableLots: number;
  lotType: string;
  agency: string;
  rawLocation: string;
}

/**
 * Parses LTA "1.29375 103.85718" space-delimited coordinates
 */
function parseLocation(locString: string): { lat: number; lng: number } {
  if (!locString) return { lat: 0, lng: 0 };
  const parts = locString.trim().split(/\s+/);
  if (parts.length >= 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    return {
      lat: isNaN(lat) ? 0 : lat,
      lng: isNaN(lng) ? 0 : lng
    };
  }
  return { lat: 0, lng: 0 };
}

/**
 * Resolves the LTA AccountKey from environment or request headers
 * (strictly no hardcoded keys)
 */
function resolveAccountKey(req: IncomingMessage): string | null {
  // 1. Check environment variables
  const envKey = process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY || process.env.VITE_LTA_ACCOUNT_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }

  // 2. Check incoming request headers (useful for testing or direct client pass-through)
  const headerKey = 
    req.headers['accountkey'] || 
    req.headers['account-key'] || 
    req.headers['x-account-key'];

  if (typeof headerKey === 'string' && headerKey.trim().length > 0) {
    return headerKey.trim();
  }

  // 3. Check query parameters if present
  try {
    const url = new URL(req.url || '', 'http://localhost');
    const queryKey = url.searchParams.get('accountKey') || url.searchParams.get('AccountKey');
    if (queryKey && queryKey.trim().length > 0) {
      return queryKey.trim();
    }
  } catch {
    // Ignore URL parse error
  }

  return null;
}

/**
 * Serverless / Express handler for /api/carparkavailability
 */
export default async function handler(
  req: IncomingMessage & { query?: any; url?: string },
  res: ServerResponse & {
    status?: (code: number) => any;
    json?: (body: any) => any;
    setHeader: (name: string, value: string) => any;
  }
) {
  // CORS & Header setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey, accountkey, x-account-key, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(204).end();
    }
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'GET') {
    const errBody = { error: 'METHOD_NOT_ALLOWED', message: 'Only GET requests are supported' };
    if (typeof res.status === 'function') return res.status(405).json(errBody);
    res.statusCode = 405;
    return res.end(JSON.stringify(errBody));
  }

  // Retrieve AccountKey
  const accountKey = resolveAccountKey(req);

  // Parse query params (skip, agency, area, lotType, format)
  let skip = 0;
  let agencyFilter = '';
  let areaFilter = '';
  let lotTypeFilter = '';
  let normalize = true;

  try {
    const url = new URL(req.url || '', 'http://localhost');
    const skipParam = url.searchParams.get('skip') || url.searchParams.get('$skip');
    if (skipParam) skip = parseInt(skipParam, 10) || 0;
    agencyFilter = (url.searchParams.get('agency') || '').toUpperCase();
    areaFilter = (url.searchParams.get('area') || '').toLowerCase();
    lotTypeFilter = (url.searchParams.get('lotType') || '').toUpperCase();
    if (url.searchParams.get('raw') === 'true') normalize = false;
  } catch {
    // Ignore query parsing errors
  }

  // Handle missing key without crashing
  if (!accountKey) {
    const warningPayload = {
      status: 'warning',
      error: 'MISSING_ACCOUNT_KEY',
      message: 'LTA_ACCOUNT_KEY is not configured yet. Please set LTA_ACCOUNT_KEY in your server environment variables or supply the AccountKey header.',
      documentation: 'Request a free API key at https://datamall.lta.gov.sg/content/datamall/en/request-api.html',
      totalCount: 0,
      value: []
    };

    if (typeof res.status === 'function') {
      return res.status(200).json(warningPayload);
    }
    res.statusCode = 200;
    return res.end(JSON.stringify(warningPayload, null, 2));
  }

  try {
    // Construct LTA URL with optional OData $skip pagination
    const ltaUrl = skip > 0 
      ? `${LTA_DATAMALL_ENDPOINT}?$skip=${skip}`
      : LTA_DATAMALL_ENDPOINT;

    // Call LTA DataMall
    const ltaResponse = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'Accept': 'application/json'
      }
    });

    if (!ltaResponse.ok) {
      const errText = await ltaResponse.text();
      const errorBody = {
        status: 'error',
        error: 'LTA_DATAMALL_ERROR',
        statusCode: ltaResponse.status,
        message: `LTA DataMall responded with HTTP status ${ltaResponse.status}`,
        details: errText
      };

      if (typeof res.status === 'function') {
        return res.status(ltaResponse.status).json(errorBody);
      }
      res.statusCode = ltaResponse.status;
      return res.end(JSON.stringify(errorBody));
    }

    const data: LTADatamallResponse = await ltaResponse.json();
    let items = data.value || [];

    // Optional filters
    if (agencyFilter) {
      items = items.filter(item => item.Agency?.toUpperCase() === agencyFilter);
    }
    if (areaFilter) {
      items = items.filter(item => item.Area?.toLowerCase().includes(areaFilter));
    }
    if (lotTypeFilter) {
      items = items.filter(item => item.LotType?.toUpperCase() === lotTypeFilter);
    }

    // Normalized vs Raw payload
    if (normalize) {
      const normalizedItems: NormalizedCarparkItem[] = items.map(item => ({
        id: item.CarParkID,
        name: item.Development,
        area: item.Area,
        coordinates: parseLocation(item.Location),
        availableLots: Number(item.AvailableLots) || 0,
        lotType: item.LotType,
        agency: item.Agency,
        rawLocation: item.Location
      }));

      const responsePayload = {
        status: 'success',
        source: 'LTA DataMall CarParkAvailabilityv2',
        timestamp: new Date().toISOString(),
        totalCount: normalizedItems.length,
        skip,
        data: normalizedItems
      };

      if (typeof res.status === 'function') {
        return res.status(200).json(responsePayload);
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(responsePayload));
    }

    // Raw LTA format
    const rawPayload = {
      status: 'success',
      source: 'LTA DataMall CarParkAvailabilityv2',
      timestamp: new Date().toISOString(),
      totalCount: items.length,
      skip,
      value: items
    };

    if (typeof res.status === 'function') {
      return res.status(200).json(rawPayload);
    }
    res.statusCode = 200;
    return res.end(JSON.stringify(rawPayload));

  } catch (error: any) {
    const errorBody = {
      status: 'error',
      error: 'SERVERLESS_PROXY_EXCEPTION',
      message: error?.message || 'Failed to connect to LTA DataMall service',
      timestamp: new Date().toISOString()
    };

    if (typeof res.status === 'function') {
      return res.status(502).json(errorBody);
    }
    res.statusCode = 502;
    return res.end(JSON.stringify(errorBody));
  }
}

/**
 * Web Fetch / Next.js / Edge Runtime GET handler
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  
  // Extract key
  const envKey = process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY || process.env.VITE_LTA_ACCOUNT_KEY;
  const headerKey = request.headers.get('accountkey') || request.headers.get('account-key') || request.headers.get('x-account-key');
  const queryKey = url.searchParams.get('accountKey') || url.searchParams.get('AccountKey');
  const accountKey = (envKey || headerKey || queryKey || '').trim();

  if (!accountKey) {
    return new Response(JSON.stringify({
      status: 'warning',
      error: 'MISSING_ACCOUNT_KEY',
      message: 'LTA_ACCOUNT_KEY is not configured yet. Please set LTA_ACCOUNT_KEY in your server environment variables or supply the AccountKey header.',
      documentation: 'Request a free API key at https://datamall.lta.gov.sg/content/datamall/en/request-api.html',
      totalCount: 0,
      value: []
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const skipParam = url.searchParams.get('skip') || url.searchParams.get('$skip');
  const skip = skipParam ? parseInt(skipParam, 10) || 0 : 0;
  const ltaUrl = skip > 0 ? `${LTA_DATAMALL_ENDPOINT}?$skip=${skip}` : LTA_DATAMALL_ENDPOINT;

  try {
    const ltaResponse = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'Accept': 'application/json'
      }
    });

    if (!ltaResponse.ok) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'LTA_DATAMALL_ERROR',
        statusCode: ltaResponse.status
      }), {
        status: ltaResponse.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data: LTADatamallResponse = await ltaResponse.json();
    return new Response(JSON.stringify({
      status: 'success',
      source: 'LTA DataMall CarParkAvailabilityv2',
      timestamp: new Date().toISOString(),
      totalCount: data.value?.length || 0,
      value: data.value || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      status: 'error',
      message: err?.message || 'Connection to LTA DataMall failed'
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
