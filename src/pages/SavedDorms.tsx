import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface SavedDorm {
  id: string;
  dorm_profile: {
    id: string;
    dorm_name: string;
    room_number?: string;
    photos_empty?: string[];
    photos_decorated?: string[];
    notes?: string;
    school: {
      name: string;
    };
  };
}

const SavedDorms = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch saved dorms
  const { data: savedDorms, isLoading } = useQuery({
    queryKey: ['saved-dorms', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_dorms')
        .select(`
          id,
          dorm_profiles!inner(
            id,
            dorm_name,
            room_number,
            photos_empty,
            photos_decorated,
            notes,
            schools!inner(name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Remove from saved
  const removeSavedMutation = useMutation({
    mutationFn: async (savedDormId: string) => {
      const { error } = await supabase
        .from('saved_dorms')
        .delete()
        .eq('id', savedDormId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-dorms'] });
      toast({
        title: "Removed from saved",
        description: "The dorm has been removed from your saved list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove from saved dorms.",
        variant: "destructive",
      });
    }
  });

  if (!user) {
    return (
      <Layout showBackButton>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Please sign in to view your saved dorms.</p>
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
            <p className="text-muted-foreground">Loading saved dorms...</p>
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
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-pink to-dorm-orange rounded-full mb-6">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-pink to-dorm-orange bg-clip-text text-transparent">
            Saved Dorms
          </h1>
          <p className="text-lg text-muted-foreground">
            Your favorite dorm profiles
          </p>
        </div>

        {/* Saved Dorms Grid */}
        {savedDorms && savedDorms.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDorms.map((saved) => (
              <Card key={saved.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {(saved.dorm_profile.photos_empty?.[0] || saved.dorm_profile.photos_decorated?.[0]) && (
                      <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden">
                        <img
                          src={saved.dorm_profile.photos_empty?.[0] || saved.dorm_profile.photos_decorated?.[0]}
                          alt={`${saved.dorm_profile.dorm_name} room`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{saved.dorm_profile.dorm_name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedMutation.mutate(saved.id)}
                        disabled={removeSavedMutation.isPending}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <Building className="h-4 w-4 inline mr-1" />
                      {saved.dorm_profile.school.name}
                    </p>
                    {saved.dorm_profile.room_number && (
                      <p className="text-sm text-muted-foreground mb-2">Room {saved.dorm_profile.room_number}</p>
                    )}
                    {saved.dorm_profile.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {saved.dorm_profile.notes.substring(0, 120)}...
                      </p>
                    )}
                  </div>
                  <Link to={`/dorm/${saved.dorm_profile.id}`}>
                    <Button variant="dorm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center mt-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved dorms yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring and save your favorite dorm profiles!
            </p>
            <Link to="/find">
              <Button>Find Dorms</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedDorms;