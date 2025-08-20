import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, School, FileImage, MessageSquare, Shield } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Admin access control - only allow specific email
  const isAdmin = user?.email === 'penelope.pressman@gmail.com' || user?.email === 'penelopepressman@college.harvard.edu';

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      if (!isAdmin) throw new Error('Unauthorized');
      
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      
      return data?.[0] || {
        total_users: 0,
        total_schools: 0,
        total_dorms: 0,
        total_posts: 0
      };
    },
    enabled: isAdmin,
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      if (!isAdmin) throw new Error('Unauthorized');
      
      const { data, error } = await supabase.rpc('get_all_profiles_admin');
      if (error) throw error;
      
      // Get school names separately
      const usersWithSchools = await Promise.all(
        (data || []).map(async (user) => {
          if (!user.school_id) return { ...user, schools: null };
          
          const { data: school } = await supabase
            .from('schools')
            .select('name')
            .eq('id', user.school_id)
            .single();
          
          return { ...user, schools: school };
        })
      );
      
      return usersWithSchools;
    },
    enabled: isAdmin,
  });

  const { data: recentDorms } = useQuery({
    queryKey: ['admin-recent-dorms'],
    queryFn: async () => {
      if (!isAdmin) throw new Error('Unauthorized');
      
      const { data, error } = await supabase.rpc('get_all_dorm_profiles_admin');
      if (error) throw error;
      
      // Get school names and profile emails separately
      const dormsWithDetails = await Promise.all(
        (data || []).slice(0, 10).map(async (dorm) => {
          const [schoolResult, profileResult] = await Promise.all([
            supabase.from('schools').select('name').eq('id', dorm.school_id).single(),
            supabase.from('profiles').select('email').eq('user_id', dorm.user_id).single()
          ]);
          
          return {
            ...dorm,
            schools: schoolResult.data,
            profile_email: profileResult.data?.email
          };
        })
      );
      
      return dormsWithDetails;
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage Dorm Scout platform</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Admin Access
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_schools || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dorm Profiles</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_dorms || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_posts || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.schools?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    {user.verified_at ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Dorm Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Dorm Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dorm Name</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDorms?.map((dorm) => (
                <TableRow key={dorm.id}>
                  <TableCell className="font-medium">{dorm.dorm_name}</TableCell>
                  <TableCell>{dorm.room_number || 'N/A'}</TableCell>
                  <TableCell>{dorm.schools?.name}</TableCell>
                  <TableCell>{dorm.profile_email}</TableCell>
                  <TableCell>
                    <Badge variant={dorm.published ? 'default' : 'secondary'}>
                      {dorm.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(dorm.created_at), 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;