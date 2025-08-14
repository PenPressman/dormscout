import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Building, MapPin } from 'lucide-react';
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
  school?: {
    name: string;
    primary_color?: string;
  };
}

const FindDorm = () => {
  const { user } = useAuth();
  const [schoolSearch, setSchoolSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [dormSearch, setDormSearch] = useState('');

  // Redirect to auth if not logged in
  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  // Search schools
  const { data: schools } = useQuery({
    queryKey: ['schools', schoolSearch],
    queryFn: async () => {
      if (!schoolSearch || schoolSearch.length < 2) return [];
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .ilike('name', `%${schoolSearch}%`)
        .limit(10);
      
      if (error) throw error;
      return data as School[];
    },
    enabled: schoolSearch.length >= 2
  });

  // Search dorm profiles within selected school
  const { data: dormProfiles } = useQuery({
    queryKey: ['dorm-profiles', selectedSchool?.id, dormSearch],
    queryFn: async () => {
      if (!selectedSchool || !dormSearch || dormSearch.length < 2) return [];
      
      const { data, error } = await supabase
        .from('dorm_profiles')
        .select(`
          *,
          school:schools(name, primary_color)
        `)
        .eq('school_id', selectedSchool.id)
        .or(`dorm_name.ilike.%${dormSearch}%,room_number.ilike.%${dormSearch}%,notes.ilike.%${dormSearch}%`)
        .eq('published', true)
        .limit(20);
      
      if (error) throw error;
      return data as DormProfile[];
    },
    enabled: !!selectedSchool && dormSearch.length >= 2
  });

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setSchoolSearch(school.name);
    setDormSearch('');
  };

  const getSchoolColor = (color?: string) => {
    return color || '#3D9EFF'; // Default to dorm-blue
  };

  return (
    <Layout showBackButton>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-pink to-dorm-blue bg-clip-text text-transparent">
            Find Your Dorm
          </h1>
          <p className="text-lg text-muted-foreground">
            Search for your school and explore dorm rooms
          </p>
        </div>

        {/* School Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              placeholder="Enter your school name..."
              className="pl-10 h-14 text-lg border-2 border-dorm-blue/20 focus:border-dorm-blue"
              style={{
                backgroundColor: selectedSchool ? `${getSchoolColor(selectedSchool.primary_color)}20` : undefined,
              }}
            />
            {selectedSchool && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5" style={{ color: getSchoolColor(selectedSchool.primary_color) }} />
                  <span className="font-medium" style={{ color: getSchoolColor(selectedSchool.primary_color) }}>
                    {selectedSchool.name}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* School Suggestions */}
          {schools && schools.length > 0 && !selectedSchool && (
            <div className="mt-2 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {schools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSchoolSelect(school)}
                  className="w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-center space-x-3"
                >
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{school.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dorm Search (only show when school is selected) */}
        {selectedSchool && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={dormSearch}
                onChange={(e) => setDormSearch(e.target.value)}
                placeholder="Search dorm name, room number, or keywords..."
                className="pl-10 h-12 border-2 border-dorm-green/20 focus:border-dorm-green"
              />
            </div>
          </div>
        )}

        {/* Search Results */}
        {dormProfiles && dormProfiles.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Dorm Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dormProfiles.map((profile) => (
                <Card key={profile.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {(profile.photos_empty?.[0] || profile.photos_decorated?.[0]) && (
                        <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden">
                          <img
                            src={profile.photos_empty?.[0] || profile.photos_decorated?.[0]}
                            alt={`${profile.dorm_name} room`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-bold mb-2">{profile.dorm_name}</h3>
                      {profile.room_number && (
                        <p className="text-sm text-muted-foreground mb-2">Room {profile.room_number}</p>
                      )}
                      {profile.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {profile.notes.substring(0, 120)}...
                        </p>
                      )}
                    </div>
                    <Link to={`/dorm/${profile.id}`}>
                      <Button variant="dorm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty States */}
        {!selectedSchool && (
          <div className="text-center mt-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start by searching for your school</h3>
            <p className="text-muted-foreground">Type your school name in the search bar above</p>
          </div>
        )}

        {selectedSchool && (!dormSearch || dormSearch.length < 2) && (
          <div className="text-center mt-16">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Now search for dorms</h3>
            <p className="text-muted-foreground">Search by dorm name, room number, or any keyword</p>
          </div>
        )}

        {selectedSchool && dormSearch.length >= 2 && (!dormProfiles || dormProfiles.length === 0) && (
          <div className="text-center mt-16">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No dorms found</h3>
            <p className="text-muted-foreground mb-4">Try a different search term or be the first to share a dorm!</p>
            <Link to="/share">
              <Button variant="secondary">Share Your Dorm</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FindDorm;