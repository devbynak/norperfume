import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase within the handler or at top level with fallback
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always return JSON
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const product_id = url.searchParams.get('product_id');
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';

  if (!product_id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Graceful fallback if Supabase is not configured
  if (!supabaseAdmin) {
    console.warn('Reviews API Warning: Supabase credentials missing. Returning empty reviews.');
    return res.status(200).json({
      reviews: [],
      pagination: { total: 0, page: 1, limit: 10, pages: 1 },
      stats: { averageRating: 0, totalReviews: 0 }
    });
  }

  const productIdStr = product_id as string;
  const p = parseInt(page as string);
  const l = parseInt(limit as string);
  const from = (p - 1) * l;
  const to = from + l - 1;

  try {
    // 1. Get real reviews from Supabase
    const { data: reviews, error, count } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productIdStr)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Supabase query error:', error);
      // Don't 500, just return empty with error log
      return res.status(200).json({
        reviews: [],
        pagination: { total: 0, page: p, limit: l, pages: 1 },
        stats: { averageRating: 0, totalReviews: 0 },
        warning: 'Database query failed'
      });
    }

    // 2. Get stats
    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('product_id', productIdStr);

    if (statsError) throw statsError;

    const totalRating = statsData?.reduce((acc: number, curr: any) => acc + curr.rating, 0) || 0;
    const averageRating = statsData && statsData.length > 0 ? (totalRating / statsData.length).toFixed(1) : 0;

    return res.status(200).json({
      reviews: reviews || [],
      pagination: {
        total: count || 0,
        page: p,
        limit: l,
        pages: Math.ceil((count || 0) / l)
      },
      stats: {
        averageRating: parseFloat(averageRating as string),
        totalReviews: count || 0
      }
    });
  } catch (error: any) {
    console.error('Reviews API Error:', error);
    // Return a 200 with empty data instead of 500 to keep UI happy
    return res.status(200).json({ 
      reviews: [],
      pagination: { total: 0, page: p, limit: l, pages: 1 },
      stats: { averageRating: 0, totalReviews: 0 },
      error: 'Internal server error handled gracefully'
    });
  }
}
