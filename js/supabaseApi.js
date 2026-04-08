import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

/**
 * Supabase 初始化
 */
const supabase = createClient(
    'https://avyathbjqrvlpfxdcojh.supabase.co',
    'sb_publishable_hfk_ScBuN_edsbAmAMv-mQ_d6QqgzWf'
);

export async function fetchAllStates() {
    try {
        const { data, error } = await supabase.rpc('get_state_counts');

        if (error) {
            throw new Error(`获取 states 时发生错误: ${error.message}`);
        }

        return { data, error: null };
    } catch (err) {
        console.error('fetchAllStates 错误:', err);
        return { data: null, error: err.message };
    }
}

export async function fetchCityCountsByState(state) {
    try {
        if (!state) {
            throw new Error('state 参数不能为空');
        }

        const { data, error } = await supabase.rpc(
            'get_city_counts_by_state',
            { p_state: state } // ✅ 改这里
        );

        if (error) {
            return {
                data: null,
                error: {
                    message: error.message,
                    code: error.code,
                    details: error.details
                }
            };
        }

        return { data, error: null };
    } catch (err) {
        console.error('fetchCityCountsByState 错误:', err);

        return {
            data: null,
            error: {
                message: err.message || '未知错误'
            }
        };
    }
}