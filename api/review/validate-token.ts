import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/lib/supabase.js';

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

  const { token } = req.body;
  console.log('🎟️ Validating Review Token:', { hasToken: !!token });

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabaseAdmin
      .from('review_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) {
      console.warn('🚫 Invalid review token attempt:', token);
      return res.status(404).json({ valid: false, error: 'Invalid token' });
    }

    if (data.used) {
      return res.status(400).json({ valid: false, error: 'Token already used' });
    }

    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ valid: false, error: 'Token expired' });
    }

    console.log('✅ Token validated successfully for product:', data.product_id);
    return res.status(200).json({ 
      valid: true, 
      productId: data.product_id,
      orderId: data.order_id,
      userId: data.user_id
    });
  } catch (error: any) {
    console.error('💥 Token Validation Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
