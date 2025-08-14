import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Building, Eye, EyeOff, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DormProfile {
  id: string;
  dorm_name: string;
  room_number?: string;
  photos_empty?: string[];
  photos_decorated?: string[];
  notes?: string;
  published: boolean;
  created_at: string;
  school: {
    name: string;
  };
}

const MyPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's dorm profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['my-dorm-profiles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('dorm_profiles')
        .select(`
          *,
          school:schools(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DormProfile[];
    },
    enabled: !!user
  });

  // Delete profile mutation
  const deleteProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('dorm_profiles')
        .delete()
        .eq('id', profileId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-dorm-profiles'] });
      toast({
        title: "Profile deleted",
        description: "Your dorm profile has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete profile.",
        variant: "destructive",
      });
    }
  });

  // Toggle publish status
  const togglePublishMutation = useMutation({
    mutationFn: async ({ profileId, published }: { profileId: string; published: boolean }) => {
      const { error } = await supabase
        .from('dorm_profiles')
        .update({ published })
        .eq('id', profileId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-dorm-profiles'] });
      toast({
        title: "Profile updated",
        description: "Your profile visibility has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  });

  if (!user) {
    return (
      <Layout showBackButton>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Please sign in to view your posts.</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout showBackButton>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your posts...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-blue to-dorm-green rounded-full mb-6">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-blue to-dorm-green bg-clip-text text-transparent">
            Your Posts
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your dorm profiles
          </p>
        </div>

        {/* Create New Button */}
        <div className="text-center mb-8">
          <Link to="/dorm/create">
            <Button size="lg">
              Create New Dorm Profile
            </Button>
          </Link>
        </div>

        {/* Profiles Grid */}
        {profiles && profiles.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {(profile.photos_empty?.[0] || profile.photos_decorated?.[0]) && (
                      <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden">
                        <img
                          src={profile.photos_empty?.[0] || profile.photos_decorated?.[0]}
                          alt={`${profile.dorm_name} room`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{profile.dorm_name}</h3>
                      <Badge variant={profile.published ? "default" : "secondary"}>
                        {profile.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <Building className="h-4 w-4 inline mr-1" />
                      {profile.school.name}
                    </p>
                    {profile.room_number && (
                      <p className="text-sm text-muted-foreground mb-2">Room {profile.room_number}</p>
                    )}
                    {profile.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {profile.notes.substring(0, 120)}...
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Link to={`/dorm/edit/${profile.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublishMutation.mutate({ 
                          profileId: profile.id, 
                          published: !profile.published 
                        })}
                        disabled={togglePublishMutation.isPending}
                        className="flex-1"
                      >
                        {profile.published ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Publish
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProfileMutation.mutate(profile.id)}
                      disabled={deleteProfileMutation.isPending}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center mt-16">
            <Edit className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first dorm profile to help other students!
            </p>
            <Link to="/dorm/create">
              <Button>Create First Post</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPosts;