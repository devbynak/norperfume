import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { verifyPurchase, getCustomerIdFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rating, review, productId, orderId, token, customerId } = req.body;

  if (!rating || !review || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let finalCustomerId = customerId;
    let finalOrderId = orderId;

    // 1. Token-based validation (Non-logged users)
    if (token) {
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from('review_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (tokenError || !tokenData) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      if (tokenData.used) {
        return res.status(401).json({ error: 'Token already used' });
      }

      if (new Date(tokenData.expires_at) < new Date()) {
        return res.status(401).json({ error: 'Token expired' });
      }

      if (tokenData.product_id !== productId) {
        return res.status(400).json({ error: 'Token does not match product' });
      }

      finalCustomerId = tokenData.user_id;
      finalOrderId = tokenData.order_id;
    } 
    // 2. Authenticated user validation
    else if (customerId) {
      // The customerId passed from frontend is the accessToken
      const resolvedId = await getCustomerIdFromToken(customerId);
      if (!resolvedId) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }
      finalCustomerId = resolvedId;

      // Verify purchase using Shopify Admin API
      const verifiedOrderId = await verifyPurchase(finalCustomerId, productId);
      if (!verifiedOrderId) {
        return res.status(403).json({ error: 'No verified purchase found for this product' });
      }
      finalOrderId = verifiedOrderId;
    } else {
      return res.status(401).json({ error: 'Authentication or token required' });
    }

    // 3. Prevent duplicate reviews
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('user_id', finalCustomerId)
      .eq('product_id', productId)
      .single();

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // 4. Store review in Supabase
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([
        {
          user_id: finalCustomerId,
          product_id: productId,
          order_id: finalOrderId,
          rating,
          review,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // 5. Mark token as used if applicable
    if (token) {
      await supabaseAdmin
        .from('review_tokens')
        .update({ used: true })
        .eq('token', token);
    }

    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
