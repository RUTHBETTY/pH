import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { ph, timestamp } = req.body;

        // Insertar en Supabase
        const { data, error } = await supabase
            .from('ph_readings')
            .insert([
                {
                    ph: ph,
                    timestamp: timestamp
                }
            ]);

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}
