import { supabase } from './supabase/client';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export async function logEvent(level: LogLevel, message: string, details?: Record<string, any>) {
    try {
        const { error } = await supabase.from('system_logs').insert({
            level,
            message,
            details,
        });

        if (error) {
            console.error('Failed to write log to Supabase:', error);
        }
    } catch (err) {
        console.error('Exception writing log:', err);
    }
}
