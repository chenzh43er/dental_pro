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

export async function fetchDentists({
                                        state,
                                        city,
                                        page = 1,
                                        pageSize = 8
                                    }) {
    try {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
            .from('dentists')
            .select(`
                id,
                name,
                nake_name,
                state,
                city,
                address,
                phone,
                website,
                img_src,
                detail_url,
                score
            `, { count: 'exact' });

        // ✅ 条件筛选
        if (state) {
            query = query.eq('state', state);
        }

        if (city) {
            query = query.eq('city', city);
        }

        // ✅ 排序（推荐加上）
        query = query.order('id', { ascending: false });

        // ✅ 分页
        const { data, error, count } = await query.range(from, to);

        if (error) {
            return {
                data: null,
                count: 0,
                error: {
                    message: error.message,
                    code: error.code,
                    details: error.details
                }
            };
        }

        return {
            data,
            count,
            page,
            pageSize,
            totalPages: Math.ceil(count / pageSize),
            error: null
        };

    } catch (err) {
        console.error('fetchDentists 错误:', err);

        return {
            data: null,
            count: 0,
            error: {
                message: err.message || '未知错误'
            }
        };
    }
}

/**
 * 根据 nake_name 查询单个 dentist
 * @param {string} nake_name - 唯一标识
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function fetchDentistDetail(nake_name) {
    try {
        const { data, error } = await supabase
            .from('dentists')
            .select('*')
            .eq('nake_name', nake_name)
            .single(); // ✅ 保证只返回一条记录

        if (error) {
            return { data: null, error };
        }

        return { data, error: null };

    } catch (err) {
        console.error('fetchDentistDetail 错误:', err);
        return { data: null, error: { message: err.message || '未知错误' } };
    }
}