// Endpoint para obtener el último valor de pH registrado
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Obtener el último valor de pH
        const { data, error } = await supabase
            .from('ph_readings')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(1);

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        res.status(200).json({ ph: data[0].ph, timestamp: data[0].timestamp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
