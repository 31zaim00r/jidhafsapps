
import { Poem, Occasion, PoemCategory } from '../types';
import { supabase } from './supabase';

export const poemService = {
  getLatestPoems: async (limit = 10): Promise<Poem[]> => {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  getAllPoems: async (filters?: { search?: string, category?: PoemCategory, occasionId?: string }): Promise<Poem[]> => {
    let query = supabase.from('poems').select('*');

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,poet_name.ilike.%${filters.search}%`);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.occasionId) {
      query = query.eq('occasion_id', filters.occasionId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getPoemById: async (id: string): Promise<Poem | null> => {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  getMyPoems: async (): Promise<Poem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  addPoem: async (poem: Omit<Poem, 'id' | 'created_at' | 'updated_at' | 'created_by'>, file?: File): Promise<Poem> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('يجب تسجيل الدخول');

    let media_url = poem.media_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('poem-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('poem-media')
        .getPublicUrl(filePath);

      media_url = publicUrl;
    }

    const { data, error } = await supabase
      .from('poems')
      .insert({
        ...poem,
        media_url,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deletePoem: async (id: string) => {
    const { error } = await supabase.from('poems').delete().eq('id', id);
    if (error) throw error;
  },

  // Occasions related
  getOccasions: async (onlyActive = true): Promise<Occasion[]> => {
    let query = supabase.from('occasions').select('*');
    if (onlyActive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  manageOccasion: async (occasion: Partial<Occasion>, file?: File) => {
    let icon = occasion.icon;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('occasion-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('occasion-images')
        .getPublicUrl(filePath);

      icon = publicUrl;
    }

    const { data, error } = await supabase
      .from('occasions')
      .upsert({ ...occasion, icon })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteOccasion: async (id: string) => {
    const { error } = await supabase.from('occasions').delete().eq('id', id);
    if (error) throw error;
  },

  getNewPoemCount: async (): Promise<number> => {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('poems')
      .select('*', { count: 'exact', head: true })
      .gt('created_at', fortyEightHoursAgo);

    if (error) return 0;
    return count || 0;
  },

  // Favorites logic
  getFavorites: async (): Promise<Poem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('poem_id, poems(*)')
      .eq('user_id', user.id);

    if (error) {
      if (error.code === '42P01') return []; // Table doesn't exist yet
      throw error;
    }
    return (data as any[]).map(item => item.poems) as Poem[];
  },

  isFavorite: async (poemId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('poem_id', poemId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  toggleFavorite: async (poemId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('يجب تسجيل الدخول للإضافة للمفضلة');

    const isFav = await poemService.isFavorite(poemId);

    if (isFav) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('poem_id', poemId);
      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, poem_id: poemId });
      if (error) throw error;
      return true;
    }
  }
};
