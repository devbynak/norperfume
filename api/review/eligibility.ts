import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { verifyPurchase, getCustomerIdFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = new URL(req.url || '', `https://${req.headers.host || 'www.norperfume.com'}`);
  const product_id = url.searchParams.get('product_id');
  const customer_id = url.searchParams.get('customer_id');

  console.log('🔍 Review Eligibility Check:', { product_id, hasCustomerId: !!customer_id });

  if (!product_id || !customer_id) {
    return res.status(200).json({ eligible: false, reason: 'Auth required' });
  }

  try {
    // 1. Resolve accessToken to GID
    console.log('🔄 Resolving customer token...');
    const resolvedId = await getCustomerIdFromToken(customer_id as string);
    console.log('✅ Resolved ID:', resolvedId);

    if (!resolvedId) {
      return res.status(200).json({ eligible: false, reason: 'Invalid session' });
    }

    // 2. Check for existing review
    console.log('🔎 Checking Supabase for existing review...');
    if (!supabaseAdmin) {
      console.warn('⚠️ Supabase Admin client not initialized (missing env vars)');
      return res.status(200).json({ 
        eligible: true, // Default to eligible if we can't check reviews, or handle as you wish
        hasReviewed: false,
        reason: 'Review system partially unavailable'
      });
    }

    const { data: existingReview, error: supabaseError } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('user_id', resolvedId)
      .eq('product_id', product_id)
      .maybeSingle();

    if (supabaseError) {
      console.error('❌ Supabase Error:', supabaseError);
    }

    // 3. Verify purchase history
    console.log('🛒 Verifying purchase history via Shopify Admin API...');
    const verifiedOrderId = await verifyPurchase(resolvedId, product_id as string);
    console.log('✅ Purchase verification result:', { verifiedOrderId });
    
    return res.status(200).json({
      eligible: !!verifiedOrderId,
      hasReviewed: !!existingReview,
      existingReview,
      resolvedId
    });
  } catch (error: any) {
    console.error('💥 Critical Error in eligibility handler:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
