import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('review_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) {
      return res.status(404).json({ valid: false, error: 'Invalid token' });
    }

    if (data.used) {
      return res.status(400).json({ valid: false, error: 'Token already used' });
    }

    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ valid: false, error: 'Token expired' });
    }

    return res.status(200).json({ 
      valid: true, 
      productId: data.product_id,
      orderId: data.order_id,
      userId: data.user_id
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
