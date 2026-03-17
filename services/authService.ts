
import { Profile, UserRole } from '../types';
import { supabase } from './supabase';

export const authService = {
  getCurrentUser: async (): Promise<Profile | null> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    // Fetch role first
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authUser.id)
      .maybeSingle();

    const userRole = (roleData?.role as UserRole) || UserRole.USER;

    // Fetch profile from database
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (pError) console.error('Error fetching profile:', pError);

    if (profile) {
      return {
        ...profile,
        role: userRole,
        can_upload: !!profile.can_upload
      };
    }

    // Auto-create profile if missing in database
    console.log('Profile missing in DB, auto-creating for user:', authUser.id);
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: authUser.id,
        name: authUser.user_metadata?.full_name || 'مستخدم جديد',
        email: authUser.email,
        can_upload: userRole === UserRole.ADMIN,
        phone_number: authUser.user_metadata?.phone_number || authUser.phone || null
      })
      .select()
      .maybeSingle();

    if (newProfile) {
      return { ...newProfile, role: userRole };
    }

    // Ultimate Fallback
    return {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || 'مستخدم جديد',
      email: authUser.email || '',
      phone_number: authUser.user_metadata?.phone_number || authUser.phone || null,
      profile_image: authUser.user_metadata?.avatar_url || null,
      can_upload: userRole === UserRole.ADMIN,
      created_at: authUser.created_at,
      updated_at: new Date().toISOString(),
      role: userRole
    };
  },

  login: async (email: string, password: string): Promise<Profile> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('فشل تسجيل الدخول');

    // Attempt to get the profile
    let profile = await authService.getCurrentUser();

    // Safety check: ensure the record exists in the 'profiles' table
    // If we're using a fallback (id matches) but it's not in DB, it's still workable
    if (!profile) throw new Error('فشل في استرداد بيانات المستخدم');

    return profile;
  },

  register: async (name: string, email: string, password: string, phone: string = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone_number: phone
        }
      }
    });

    if (error) throw error;
    return data;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  // Admin tools
  getAllUsers: async (): Promise<Profile[]> => {
    try {
      // Step 1: Fetch all profiles
      console.log('Fetching all profiles...');
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*');

      if (pError) throw pError;
      if (!profiles || profiles.length === 0) {
        console.warn('No profiles found in database.');
        return [];
      }

      // Step 2: Fetch all roles
      const { data: roles, error: rError } = await supabase
        .from('user_roles')
        .select('*');

      // Step 3: Combine them
      const combined = profiles.map(p => {
        const userRole = roles?.find(r => r.user_id === p.id);
        return {
          ...p,
          role: (userRole?.role as UserRole) || UserRole.USER
        };
      });

      console.log(`Found ${combined.length} users successfully.`);
      return combined;
    } catch (e) {
      console.error('getAllUsers failed completely:', e);
      return [];
    }
  },

  updateUserPermissions: async (userId: string, updates: { can_upload?: boolean, role?: UserRole, password?: string, phone_number?: string }) => {
    console.log('Admin: Updating permissions for user:', userId, updates);
    let success = true;

    if (updates.can_upload !== undefined || updates.phone_number !== undefined) {
      const dbUpdates: any = {};
      if (updates.can_upload !== undefined) dbUpdates.can_upload = updates.can_upload;
      if (updates.phone_number !== undefined) dbUpdates.phone_number = updates.phone_number;

      const { data, error, status } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Database Error:', error);
        throw new Error(`خطأ في قاعدة البيانات: ${error.message}`);
      }

      if (!data || data.length === 0) {
        // If update failed, try upsert as a last resort (id is required for upsert)
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ id: userId, ...dbUpdates });

        if (upsertError) {
          console.error('Upsert Error:', upsertError);
          throw new Error('فشل تحديث البيانات، قد لا تملك الصلاحية الكافية أو السجل غير موجود');
        }
      }
    }

    if (updates.role !== undefined) {
      const { error } = await supabase.from('user_roles').upsert({ user_id: userId, role: updates.role });
      if (error) success = false;
    }

    // For password reset, we'll use a secure RPC call that would trigger a backend update
    if (updates.password) {
      const { error } = await supabase.rpc('admin_reset_password', {
        target_user_id: userId,
        new_password: updates.password
      });
      if (error) throw error;
    }

    return success;
  }
};
