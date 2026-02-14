/**
 * Supabase API Client
 * 
 * This file contains all direct Supabase database operations.
 * Frontend uses Supabase directly for:
 * - User registration (wallet + username)
 * - Reading user data
 * - Reading public stats (via RLS policies)
 * 
 * Why Supabase instead of backend:
 * - Real-time subscriptions possible
 * - Direct database access (faster)
 * - RLS policies handle security
 * - Frontend can read public data without backend
 */

import { supabase, type User, type API, type Endpoint, type APICall } from './supabase';

// ============================================
// User Management
// ============================================

/**
 * Register or get user by wallet address
 * 
 * Why: Create user account when wallet connects
 * Used in: WalletButton component
 * 
 * Location: Called when user connects wallet
 */
export async function registerUserByWallet(walletAddress: string): Promise<User | null> {
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      wallet_address: walletAddress,
      username: null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return newUser;
}

/**
 * Set username for current user
 * 
 * Why: Register username after wallet connection
 * Used in: WalletButton component (username modal)
 * 
 * Location: Called when user submits username form
 */
export async function setUsername(walletAddress: string, username: string): Promise<User | null> {
  // Validate username format
  const usernameRegex = /^[a-z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    throw new Error('Username can only contain lowercase letters, numbers, and underscores');
  }

  // Check if username is taken
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (existingUser) {
    throw new Error('Username already taken');
  }

  // Update username
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({ username })
    .eq('wallet_address', walletAddress)
    .select()
    .single();

  if (error) {
    console.error('Error updating username:', error);
    throw new Error('Failed to update username');
  }

  return updatedUser;
}

/**
 * Get user by wallet address
 * 
 * Why: Fetch current user data
 * Used in: Dashboard, profile components
 * 
 * Location: Called throughout app to get user info
 */
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

// ============================================
// Public Stats (Read from Supabase)
// ============================================

/**
 * Get total network revenue
 * 
 * Why: Display on landing page
 * Used in: Landing page
 * 
 * Location: Landing page stats section
 * Note: Uses RLS policy to allow public read
 */
export async function getTotalNetworkRevenue(): Promise<number> {
  const { data, error } = await supabase
    .from('api_calls')
    .select('amount_paid');

  if (error) {
    console.error('Error fetching revenue:', error);
    return 0;
  }

  const totalMicroSTX = data.reduce((sum, call) => sum + Number(call.amount_paid || 0), 0);
  return totalMicroSTX / 1000000; // Convert to STX
}

/**
 * Get top APIs by revenue
 * 
 * Why: Display top 4 APIs on landing page
 * Used in: Landing page
 * 
 * Location: Landing page top APIs section
 * Note: Uses RLS policy to allow public read
 */
export async function getTopAPIs(limit: number = 4) {
  // Get all APIs with their endpoints and call data
  const { data: apis, error } = await supabase
    .from('apis')
    .select(`
      id,
      api_name,
      api_name_slug,
      users!inner (
        username
      ),
      endpoints (
        id,
        api_calls (
          amount_paid
        )
      )
    `)
    .eq('endpoints.active', true)
    .limit(100);

  if (error) {
    console.error('Error fetching top APIs:', error);
    return [];
  }

  // Calculate revenue for each API
  const apisWithRevenue = (apis || [])
    .map((api: any) => {
      const revenue = (api.endpoints || [])
        .flatMap((e: any) => e.api_calls || [])
        .reduce((sum: number, call: any) => sum + Number(call.amount_paid || 0), 0);

      const totalCalls = (api.endpoints || [])
        .flatMap((e: any) => e.api_calls || [])
        .length;

      return {
        id: api.id,
        name: api.api_name,
        username: api.users?.username || null,
        revenue: revenue / 1000000, // Convert to STX
        totalCalls,
      };
    })
    .filter((api: any) => api.revenue > 0)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((api: any) => ({
      id: api.id,
      name: api.name,
      username: api.username,
      revenue: api.revenue, // In STX
      totalCalls: api.totalCalls,
    }));

  return apisWithRevenue;
}

// ============================================
// User's APIs (Read from Supabase)
// ============================================

/**
 * Get user's APIs with endpoints
 * 
 * Why: Display user's APIs in dashboard
 * Used in: MyAPIs page, Dashboard
 * 
 * Location: MyAPIs page, Dashboard component
 * Note: RLS policy ensures user only sees their own APIs
 */
export async function getUserAPIsFromSupabase(userId: string) {
  const { data: apis, error } = await supabase
    .from('apis')
    .select(`
      *,
      endpoints (
        id,
        endpoint_name,
        endpoint_path,
        original_url,
        monetized_url,
        price_microstx,
        active
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching APIs:', error);
    return [];
  }

  return apis || [];
}

/**
 * Create new API with endpoints
 * 
 * Why: Frontend writes directly to Supabase (backend reads from there)
 * Used in: CreateAPI page
 * 
 * Location: CreateAPI page form submit
 * Note: Frontend has no knowledge of x402 - just writes data to Supabase
 */
export async function createAPIInSupabase(
  userId: string,
  data: {
    apiName: string;
    apiNameSlug: string;
    imageUrl?: string | null;
    endpoints: Array<{
      endpointName: string;
      endpointPath: string;
      originalUrl: string;
      price: string; // In STX, will convert to microSTX
    }>;
  }
) {
  // Validate API name slug format
  const slugRegex = /^[a-z0-9_-]+$/;
  if (!slugRegex.test(data.apiNameSlug)) {
    throw new Error('API name slug can only contain lowercase letters, numbers, hyphens, and underscores');
  }

  // Check if API name slug already exists for this user
  const { data: existingApi } = await supabase
    .from('apis')
    .select('id')
    .eq('user_id', userId)
    .eq('api_name_slug', data.apiNameSlug)
    .single();

  if (existingApi) {
    throw new Error('API name already exists');
  }

  // Create API
  const { data: api, error: apiError } = await supabase
    .from('apis')
    .insert({
      user_id: userId,
      api_name: data.apiName,
      api_name_slug: data.apiNameSlug,
      image_url: data.imageUrl || null,
    })
    .select()
    .single();

  if (apiError) {
    console.error('Error creating API:', apiError);
    throw new Error('Failed to create API');
  }

  // Create endpoints if provided
  if (data.endpoints && data.endpoints.length > 0) {
    // Validate endpoint paths
    const pathRegex = /^[a-z0-9_-]+$/;
    for (const endpoint of data.endpoints) {
      if (!pathRegex.test(endpoint.endpointPath)) {
        // Rollback API creation
        await supabase.from('apis').delete().eq('id', api.id);
        throw new Error(`Invalid endpoint path: ${endpoint.endpointPath}. Only lowercase letters, numbers, hyphens, and underscores allowed.`);
      }
    }

    const endpointsData = data.endpoints.map((e) => ({
      api_id: api.id,
      endpoint_name: e.endpointName,
      endpoint_path: e.endpointPath,
      original_url: e.originalUrl,
      price_microstx: Math.round((parseFloat(e.price) || 0) * 1000000), // Convert STX to microSTX
      active: true,
    }));

    const { error: endpointsError } = await supabase
      .from('endpoints')
      .insert(endpointsData);

    if (endpointsError) {
      console.error('Error creating endpoints:', endpointsError);
      // Rollback API creation
      await supabase.from('apis').delete().eq('id', api.id);
      throw new Error('Failed to create endpoints');
    }
  }

  return { success: true, api };
}

/**
 * Update API and endpoints
 * 
 * Why: Frontend writes directly to Supabase
 * Used in: EditAPI page
 * 
 * Location: EditAPI page form submit
 */
export async function updateAPIInSupabase(
  userId: string,
  apiId: string,
  data: {
    apiName?: string;
    imageUrl?: string | null;
    endpoints?: Array<{
      endpointName: string;
      endpointPath: string;
      originalUrl: string;
      price: string;
    }>;
  }
) {
  // Verify API belongs to user
  const { data: api, error: apiCheckError } = await supabase
    .from('apis')
    .select('id')
    .eq('id', apiId)
    .eq('user_id', userId)
    .single();

  if (apiCheckError || !api) {
    throw new Error('API not found or unauthorized');
  }

  // Update API name and/or image URL if provided
  const updateData: any = {};
  if (data.apiName !== undefined) {
    updateData.api_name = data.apiName;
  }
  if (data.imageUrl !== undefined) {
    updateData.image_url = data.imageUrl || null;
  }

  if (Object.keys(updateData).length > 0) {
    const { error: updateError } = await supabase
      .from('apis')
      .update(updateData)
      .eq('id', apiId);

    if (updateError) {
      throw new Error('Failed to update API');
    }
  }

  // Note: Endpoint updates are now handled individually via updateEndpointInSupabase()
  // This function only updates the API name
  // Individual endpoints should be updated/deleted using:
  // - updateEndpointInSupabase() for updating original_url and price
  // - deleteEndpointFromSupabase() for deleting individual endpoints

  return { success: true };
}

/**
 * Delete API
 * 
 * Why: Frontend deletes directly from Supabase
 * Used in: MyAPIs page, APIStats page
 * 
 * Location: Delete button click
 * Note: Cascade delete will remove endpoints and API calls
 */
export async function deleteAPIFromSupabase(userId: string, apiId: string) {
  // Verify API belongs to user
  const { data: api, error: apiCheckError } = await supabase
    .from('apis')
    .select('id')
    .eq('id', apiId)
    .eq('user_id', userId)
    .single();

  if (apiCheckError || !api) {
    throw new Error('API not found or unauthorized');
  }

  // Delete API (cascade will delete endpoints and API calls)
  const { error } = await supabase
    .from('apis')
    .delete()
    .eq('id', apiId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to delete API');
  }

  return { success: true };
}

// ============================================
// Individual Endpoint Management
// ============================================

/**
 * Update a single endpoint (original_url and price only)
 * 
 * Why: Users can update original_url and price, but NOT monetized_url or endpoint_path
 * Used in: EditAPI page (individual endpoint updates)
 * 
 * Location: EditAPI page when user updates an endpoint
 * Note: monetized_url is set by backend, endpoint_path cannot be changed (must delete and recreate)
 */
export async function updateEndpointInSupabase(
  userId: string,
  apiId: string,
  endpointId: string,
  data: {
    endpointName?: string;
    originalUrl?: string;
    price?: string; // In STX, will convert to microSTX
  }
) {
  // Verify API belongs to user
  const { data: api, error: apiCheckError } = await supabase
    .from('apis')
    .select('id')
    .eq('id', apiId)
    .eq('user_id', userId)
    .single();

  if (apiCheckError || !api) {
    throw new Error('API not found or unauthorized');
  }

  // Verify endpoint belongs to API
  const { data: endpoint, error: endpointCheckError } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', endpointId)
    .eq('api_id', apiId)
    .single();

  if (endpointCheckError || !endpoint) {
    throw new Error('Endpoint not found or unauthorized');
  }

  // Build update object (only allowed fields)
  const updateData: any = {};
  if (data.endpointName !== undefined) {
    updateData.endpoint_name = data.endpointName;
  }
  if (data.originalUrl !== undefined) {
    if (!data.originalUrl.startsWith('http')) {
      throw new Error('Original URL must start with http:// or https://');
    }
    updateData.original_url = data.originalUrl;
  }
  if (data.price !== undefined) {
    updateData.price_microstx = Math.round((parseFloat(data.price) || 0) * 1000000);
  }

  // Update endpoint
  const { error } = await supabase
    .from('endpoints')
    .update(updateData)
    .eq('id', endpointId)
    .eq('api_id', apiId);

  if (error) {
    throw new Error('Failed to update endpoint');
  }

  return { success: true };
}

/**
 * Delete a single endpoint
 * 
 * Why: Users can delete individual endpoints without deleting the whole API
 * Used in: EditAPI page
 * 
 * Location: Delete endpoint button click
 * Note: Other endpoints remain active
 */
export async function deleteEndpointFromSupabase(
  userId: string,
  apiId: string,
  endpointId: string
) {
  // Verify API belongs to user
  const { data: api, error: apiCheckError } = await supabase
    .from('apis')
    .select('id')
    .eq('id', apiId)
    .eq('user_id', userId)
    .single();

  if (apiCheckError || !api) {
    throw new Error('API not found or unauthorized');
  }

  // Verify endpoint belongs to API
  const { data: endpoint, error: endpointCheckError } = await supabase
    .from('endpoints')
    .select('id')
    .eq('id', endpointId)
    .eq('api_id', apiId)
    .single();

  if (endpointCheckError || !endpoint) {
    throw new Error('Endpoint not found or unauthorized');
  }

  // Delete endpoint (other endpoints remain active)
  const { error } = await supabase
    .from('endpoints')
    .delete()
    .eq('id', endpointId)
    .eq('api_id', apiId);

  if (error) {
    throw new Error('Failed to delete endpoint');
  }

  return { success: true };
}

/**
 * Get API call statistics for user's endpoints
 * 
 * Why: Calculate revenue and call counts
 * Used in: Dashboard, APIStats page
 * 
 * Location: Dashboard stats, APIStats component
 * 
 * Note: RLS ensures users can only see calls for their own endpoints
 */
export async function getAPICallStats(endpointIds: string[]) {
  if (endpointIds.length === 0) return [];

  const { data, error } = await supabase
    .from('api_calls')
    .select('endpoint_id, amount_paid')
    .in('endpoint_id', endpointIds); // RLS will filter to only user's endpoints

  if (error) {
    console.error('Error fetching call stats:', error);
    return [];
  }

  return data || [];
}

/**
 * Get recent API calls for an endpoint
 * 
 * Why: Display call history
 * Used in: APIStats page
 * 
 * Location: APIStats page call history section
 * 
 * Note: RLS ensures users can only see calls for their own endpoints
 */
export async function getRecentAPICalls(endpointId: string, limit: number = 20) {
  const { data, error } = await supabase
    .from('api_calls')
    .select('*')
    .eq('endpoint_id', endpointId) // RLS will filter to only user's endpoints
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching API calls:', error);
    return [];
  }

  return data || [];
}

// ============================================
// Analytics Data (Per User)
// ============================================

/**
 * Get revenue vs calls data for analytics (last 30 days)
 * 
 * Why: Display revenue vs calls correlation chart
 * Used in: Analytics page
 * 
 * Location: Analytics page revenue vs calls chart
 */
export async function getRevenueVsCallsData(userId: string) {
  // Get user's endpoints
  const { data: apis } = await supabase
    .from('apis')
    .select('id, endpoints(id)')
    .eq('user_id', userId);

  const endpointIds = apis?.flatMap((api: any) => 
    (api.endpoints || []).map((e: any) => e.id)
  ) || [];

  if (endpointIds.length === 0) {
    return [];
  }

  // Get calls from last 30 days, grouped by month
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: calls, error } = await supabase
    .from('api_calls')
    .select('amount_paid, timestamp')
    .in('endpoint_id', endpointIds)
    .gte('timestamp', thirtyDaysAgo.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching revenue vs calls data:', error);
    return [];
  }

  // Group by month
  const monthlyData: Record<string, { revenue: number; calls: number }> = {};
  
  (calls || []).forEach((call: any) => {
    const date = new Date(call.timestamp);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, calls: 0 };
    }
    
    monthlyData[monthKey].revenue += Number(call.amount_paid || 0) / 1000000; // Convert to STX
    monthlyData[monthKey].calls += 1;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    revenue: data.revenue,
    calls: data.calls,
  }));
}

/**
 * Get traffic distribution by API (pie chart data)
 * 
 * Why: Display traffic distribution pie chart
 * Used in: Analytics page
 * 
 * Location: Analytics page traffic distribution chart
 */
export async function getTrafficDistributionData(userId: string) {
  // Get user's APIs with call counts
  const { data: apis, error } = await supabase
    .from('apis')
    .select(`
      id,
      api_name,
      endpoints (
        id,
        api_calls (
          id
        )
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching traffic distribution:', error);
    return [];
  }

  return (apis || []).map((api: any) => {
    const callCount = (api.endpoints || []).reduce((sum: number, endpoint: any) => {
      return sum + (endpoint.api_calls?.length || 0);
    }, 0);

    return {
      name: api.api_name,
      value: callCount,
    };
  }).filter((item: any) => item.value > 0); // Only show APIs with calls
}

/**
 * Get daily call volume (last 7 days)
 * 
 * Why: Display daily call volume bar chart
 * Used in: Analytics page
 * 
 * Location: Analytics page daily call volume chart
 */
export async function getDailyCallVolumeData(userId: string) {
  // Get user's endpoints
  const { data: apis } = await supabase
    .from('apis')
    .select('id, endpoints(id)')
    .eq('user_id', userId);

  const endpointIds = apis?.flatMap((api: any) => 
    (api.endpoints || []).map((e: any) => e.id)
  ) || [];

  if (endpointIds.length === 0) {
    return [];
  }

  // Get calls from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: calls, error } = await supabase
    .from('api_calls')
    .select('timestamp')
    .in('endpoint_id', endpointIds)
    .gte('timestamp', sevenDaysAgo.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching daily call volume:', error);
    return [];
  }

  // Group by day
  const dailyData: Record<string, number> = {};
  
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
    dailyData[dayKey] = 0;
  }
  
  (calls || []).forEach((call: any) => {
    const date = new Date(call.timestamp);
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    if (dailyData[dayKey] !== undefined) {
      dailyData[dayKey] += 1;
    }
  });

  return Object.entries(dailyData).map(([day, calls]) => ({
    day,
    calls,
  }));
}

