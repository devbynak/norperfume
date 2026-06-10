import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { getCustomerIdFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, rating, review, customerId } = req.body;
  console.log('update Review Request:', { id, rating, hasCustomerId: !!customerId });

  if (!id || !customerId) {
    return res.status(400).json({ error: 'Review ID and Customer ID are required' });
  }

  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not initialized');
    }

    // 1. Resolve accessToken to GID
    console.log('🔄 Resolving customer session...');
    const resolvedId = await getCustomerIdFromToken(customerId);
    if (!resolvedId) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    console.log('✅ Resolved ID:', resolvedId);

    // 2. Verify ownership
    console.log('🔎 Verifying review ownership...');
    const { data: existingReview, error: fetchError } = await supabaseAdmin
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.user_id !== resolvedId) {
      console.warn('🚫 Authorization failure: Review user_id mismatch', { reviewOwner: existingReview.user_id, requester: resolvedId });
      return res.status(403).json({ error: 'You are not authorized to edit this review' });
    }

    // 3. Update
    console.log('🚀 Updating review in Supabase...');
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({ rating, review, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Review updated successfully!');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('💥 Update Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
