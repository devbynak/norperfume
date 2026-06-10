import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { verifyPurchase, getCustomerIdFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rating, review, productId, orderId, token, customerId } = req.body;
  console.log('📝 Review Submission:', { productId, rating, hasToken: !!token, hasCustomerId: !!customerId });

  if (!rating || !review || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let finalCustomerId = customerId;
    let finalOrderId = orderId;

    if (!supabaseAdmin) {
      throw new Error('Supabase client not initialized');
    }

    // 1. Token-based validation (Non-logged users)
    if (token) {
      console.log('🎟️ Validating one-time review token...');
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from('review_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (tokenError || !tokenData || tokenData.used) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      finalCustomerId = tokenData.user_id;
      finalOrderId = tokenData.order_id;
    } 
    // 2. Session-based validation (Logged users)
    else if (customerId) {
      console.log('🔄 Resolving customer session...');
      const resolvedId = await getCustomerIdFromToken(customerId);
      if (!resolvedId) {
        return res.status(401).json({ error: 'Invalid customer session' });
      }
      finalCustomerId = resolvedId;
      
      console.log('🛒 Verifying purchase for resolved ID:', finalCustomerId);
      const verifiedOrderId = await verifyPurchase(finalCustomerId, productId);
      if (!verifiedOrderId) {
        return res.status(403).json({ error: 'Purchase not verified for this product' });
      }
      finalOrderId = verifiedOrderId;
    } else {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 3. Submit review
    console.log('🚀 Inserting review into Supabase...');
    const { data, error: insertError } = await supabaseAdmin
      .from('reviews')
      .insert([
        {
          rating,
          review,
          product_id: productId,
          order_id: finalOrderId,
          user_id: finalCustomerId,
          status: 'published'
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 4. Mark token as used if applicable
    if (token) {
      await supabaseAdmin
        .from('review_tokens')
        .update({ used: true })
        .eq('token', token);
    }

    console.log('✅ Review submitted successfully!');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('💥 Submission Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
