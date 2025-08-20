import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Building, MapPin, Filter, Grid, List, Heart, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface School {
  id: string;
  name: string;
  primary_color?: string;
}

interface DormProfile {
  id: string;
  dorm_name: string;
  room_number?: string;
  photos_empty?: string[];
  photos_decorated?: string[];
  notes?: string;
  created_at: string;
  contact_enabled: boolean;
  contact_first_name?: string;
  contact_last_initial?: string;
  school_name: string;
}

const FindDorm = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Redirect to auth if not logged in
  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  // Get all dorm profiles with search functionality
  const { data: dormProfiles = [], isLoading } = useQuery({
    queryKey: ['browse-dorm-profiles', searchTerm, sortBy],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('search_dorm_profiles_secure', {
          search_term: searchTerm || '',
          filter_school_id: null
        });
      
      if (error) throw error;
      return data as DormProfile[];
    }
  });

  // Sort and filter profiles
  const sortedProfiles = React.useMemo(() => {
    if (!dormProfiles) return [];
    
    const sorted = [...dormProfiles].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.dorm_name.localeCompare(b.dorm_name);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [dormProfiles, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-pink to-dorm-blue bg-clip-text text-transparent">
            Browse Dorms
          </h1>
          <p className="text-lg text-muted-foreground">
            Search for your room, or browse others at your school.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dorms, rooms, schools, or keywords..."
                className="pl-10 h-12 border-2 border-dorm-blue/20 focus:border-dorm-blue"
              />
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'name') => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Dorm Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${sortedProfiles.length} dorms found`}
            </p>
          </div>
        </div>

        {/* Dorm Profiles */}
        {sortedProfiles.length > 0 && (
          <div className="max-w-7xl mx-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProfiles.map((profile) => (
                  <Card key={profile.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 bg-white overflow-hidden">
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative">
                        {(profile.photos_empty?.[0] || profile.photos_decorated?.[0]) ? (
                          <div className="w-full h-48 overflow-hidden">
                            <img
                              src={profile.photos_empty?.[0] || profile.photos_decorated?.[0]}
                              alt={`${profile.dorm_name} room`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-dorm-blue/20 to-dorm-pink/20 flex items-center justify-center">
                            <Building className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 text-xs">
                            {profile.school_name}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold mb-1">{profile.dorm_name}</h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                            {profile.room_number && <span>Room {profile.room_number}</span>}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(profile.created_at)}</span>
                            </div>
                          </div>
                          {profile.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {profile.notes.substring(0, 100)}{profile.notes.length > 100 ? '...' : ''}
                            </p>
                          )}
                          {profile.contact_enabled && profile.contact_first_name && (
                            <div className="flex items-center gap-1 text-xs text-dorm-green font-medium mb-3">
                              <span>Contact: {profile.contact_first_name} {profile.contact_last_initial}.</span>
                            </div>
                          )}
                        </div>
                        <Link to={`/dorm/${profile.id}`}>
                          <Button className="w-full bg-gradient-to-r from-dorm-pink to-dorm-blue hover:from-dorm-pink/90 hover:to-dorm-blue/90">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProfiles.map((profile) => (
                  <Card key={profile.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {(profile.photos_empty?.[0] || profile.photos_decorated?.[0]) ? (
                            <div className="w-24 h-24 rounded-lg overflow-hidden">
                              <img
                                src={profile.photos_empty?.[0] || profile.photos_decorated?.[0]}
                                alt={`${profile.dorm_name} room`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-dorm-blue/20 to-dorm-pink/20 rounded-lg flex items-center justify-center">
                              <Building className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold mb-1">{profile.dorm_name}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{profile.school_name}</span>
                                {profile.room_number && <span>Room {profile.room_number}</span>}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(profile.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <Link to={`/dorm/${profile.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-dorm-pink to-dorm-blue hover:from-dorm-pink/90 hover:to-dorm-blue/90">
                                View Details
                              </Button>
                            </Link>
                          </div>
                          {profile.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {profile.notes.substring(0, 150)}{profile.notes.length > 150 ? '...' : ''}
                            </p>
                          )}
                          {profile.contact_enabled && profile.contact_first_name && (
                            <div className="flex items-center gap-1 text-xs text-dorm-green font-medium">
                              <span>Contact: {profile.contact_first_name} {profile.contact_last_initial}.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedProfiles.length === 0 && (
          <div className="text-center mt-16">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? 'No dorms found' : 'No dorms available yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all available dorms'
                : 'Be the first to share a dorm profile and help others find their perfect room!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
              <Link to="/share">
                <Button className="bg-gradient-to-r from-dorm-pink to-dorm-blue hover:from-dorm-pink/90 hover:to-dorm-blue/90">
                  Share Your Dorm
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FindDorm;