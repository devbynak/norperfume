import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';
import { getCustomerIdFromToken } from '../../src/lib/shopify/admin-verify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, rating, review, customerId } = req.body;

  if (!id || !customerId) {
    return res.status(400).json({ error: 'Review ID and Customer ID are required' });
  }

  try {
    // 1. Resolve accessToken to GID
    const resolvedId = await getCustomerIdFromToken(customerId);
    if (!resolvedId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // 2. Verify ownership
    const { data: existingReview, error: fetchError } = await supabaseAdmin
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.user_id !== resolvedId) {
      return res.status(403).json({ error: 'You are not authorized to edit this review' });
    }

    // 2. Update
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({ rating, review, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
