/**
 * Backend API Client
 * 
 * This file contains all API calls to the ZedKr backend server.
 * The backend handles:
 * - API creation/management
 * - Endpoint management
 * - Public stats
 * - Proxy routing (handled automatically)
 * 
 * Auth is handled on frontend via Supabase.
 * Backend reads user data from Supabase.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zedkr-api.railway.app';

/**
 * Get current user's wallet address from Stacks session
 * 
 * Why: Backend needs wallet address to identify user
 * Used in: All authenticated backend API calls
 * 
 * Location: Called before every backend API request
 */
async function getWalletAddress(): Promise<string | null> {
  try {
    // Import userSession dynamically to avoid circular dependencies
    const { userSession } = await import('@/lib/stacks-auth');
    if (userSession && userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      return data.profile?.stxAddress?.testnet || data.profile?.stxAddress?.mainnet || null;
    }
  } catch (error) {
    console.error('Error getting wallet address:', error);
  }
  return null;
}

/**
 * Create authenticated fetch with wallet address header
 * 
 * Why: Backend needs wallet address to identify user
 * Used in: All authenticated backend API calls
 * 
 * Location: Called before every backend API request
 */
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const walletAddress = await getWalletAddress();
  
  if (!walletAddress) {
    throw new Error('Wallet not connected');
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-wallet-address': walletAddress,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * API Routes
 */

// ============================================
// APIs Management
// ============================================

/**
 * Get user's APIs
 * GET /api/apis/my
 * 
 * Why: Fetch all APIs created by the current user
 * Used in: MyAPIs page, Dashboard
 */
export async function getUserAPIs() {
  return authenticatedFetch('/api/apis/my');
}

/**
 * Create new API
 * POST /api/apis
 * 
 * Why: Create a new API project with endpoints
 * Used in: CreateAPI page
 */
export async function createAPI(data: {
  apiName: string;
  apiNameSlug: string;
  endpoints: Array<{
    endpointName: string;
    endpointPath: string;
    originalUrl: string;
    price: string;
  }>;
}) {
  return authenticatedFetch('/api/apis', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update API
 * PUT /api/apis/:id
 * 
 * Why: Update API name and endpoints
 * Used in: EditAPI page
 */
export async function updateAPI(id: string, data: {
  apiName?: string;
  endpoints?: Array<{
    endpointName: string;
    endpointPath: string;
    originalUrl: string;
    price: string;
  }>;
}) {
  return authenticatedFetch(`/api/apis/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete API
 * DELETE /api/apis/:id
 * 
 * Why: Delete an API project and all its endpoints
 * Used in: MyAPIs page, APIStats page
 */
export async function deleteAPI(id: string) {
  return authenticatedFetch(`/api/apis/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// Public Stats
// ============================================

/**
 * Get public stats for landing page
 * GET /api/public/stats
 * 
 * Why: Display network-wide stats and top APIs
 * Used in: Landing page
 * Note: No auth required - public endpoint
 */
export async function getPublicStats() {
  const response = await fetch(`${API_BASE_URL}/api/public/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch public stats');
  }
  return response.json();
}

// ============================================
// Health Check
// ============================================

/**
 * Check backend health
 * GET /health
 * 
 * Why: Verify backend is running and get network info
 * Used in: Development, error handling
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Backend is not responding');
  }
  return response.json();
}

// ============================================
// STX Price (USD Conversion)
// ============================================

/**
 * Get current STX price in USD
 * GET /api/public/stx-price
 * 
 * Why: Convert STX amounts to USD for display
 * Used in: All pages showing prices/revenue
 */
export async function getSTXPriceUSD(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/stx-price`);
    if (!response.ok) {
      throw new Error('Failed to fetch STX price');
    }
    const data = await response.json();
    return data.price || 1.50; // Fallback to $1.50 if price unavailable
  } catch (error) {
    console.error('Error fetching STX price:', error);
    return 1.50; // Fallback price
  }
}

