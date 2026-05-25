import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { verifyPurchase, getCustomerIdFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const product_id = url.searchParams.get('product_id');
  const customer_id = url.searchParams.get('customer_id');

  if (!product_id || !customer_id) {
    return res.status(200).json({ eligible: false, reason: 'Auth required' });
  }

  try {
    // 1. Resolve accessToken to GID
    const resolvedId = await getCustomerIdFromToken(customer_id as string);
    if (!resolvedId) {
      return res.status(200).json({ eligible: false, reason: 'Invalid session' });
    }

    // 2. Check for existing review
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('user_id', resolvedId)
      .eq('product_id', product_id)
      .maybeSingle();

    // 3. Verify purchase history
    const verifiedOrderId = await verifyPurchase(resolvedId, product_id as string);
    
    return res.status(200).json({
      eligible: !!verifiedOrderId,
      hasReviewed: !!existingReview,
      existingReview,
      resolvedId // Return the GID so frontend can use it for edit/delete checks
    });
  } catch (error: any) {
    console.error('Eligibility check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
