import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Users, Building } from 'lucide-react';

interface School {
  id: string;
  name: string;
}

interface Building {
  id: string;
  name: string;
  address: string;
}

interface Room {
  id: string;
  room_number: string;
  floor: number;
  room_type: string;
  bed_type: string;
  dimensions: string;
  notes: string;
}

const DormExplorer = () => {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Fetch schools
  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as School[];
    }
  });

  // Fetch buildings for selected school
  const { data: buildings } = useQuery({
    queryKey: ['buildings', selectedSchool],
    queryFn: async () => {
      if (!selectedSchool) return [];
      
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('school_id', selectedSchool)
        .order('name');
      
      if (error) throw error;
      return data as Building[];
    },
    enabled: !!selectedSchool
  });

  // Fetch rooms for selected building
  const { data: rooms } = useQuery({
    queryKey: ['rooms', selectedBuilding],
    queryFn: async () => {
      if (!selectedBuilding) return [];
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('building_id', selectedBuilding)
        .order('room_number');
      
      if (error) throw error;
      return data as Room[];
    },
    enabled: !!selectedBuilding
  });

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId);
    setSelectedBuilding('');
    setSelectedRoom(null);
  };

  const handleBuildingChange = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setSelectedRoom(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Home className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-foreground">DormScout</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover what your dorm room really looks like before you move in
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* School Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Select School
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSchool} onValueChange={handleSchoolChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your school" />
              </SelectTrigger>
              <SelectContent>
                {schools?.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Building Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Select Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedBuilding} 
              onValueChange={handleBuildingChange}
              disabled={!selectedSchool}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose building" />
              </SelectTrigger>
              <SelectContent>
                {buildings?.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Room Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Select Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedRoom?.id || ''} 
              onValueChange={(roomId) => {
                const room = rooms?.find(r => r.id === roomId);
                setSelectedRoom(room || null);
              }}
              disabled={!selectedBuilding}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose room" />
              </SelectTrigger>
              <SelectContent>
                {rooms?.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.room_number}
                    {room.floor && ` (Floor ${room.floor})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Room Details */}
      {selectedRoom && (
        <Card>
          <CardHeader>
            <CardTitle>Room {selectedRoom.room_number} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {selectedRoom.room_type && (
                <div>
                  <Badge variant="secondary">{selectedRoom.room_type}</Badge>
                </div>
              )}
              {selectedRoom.bed_type && (
                <div>
                  <span className="text-sm font-medium">Bed Type:</span>
                  <p className="text-sm text-muted-foreground">{selectedRoom.bed_type}</p>
                </div>
              )}
              {selectedRoom.dimensions && (
                <div>
                  <span className="text-sm font-medium">Dimensions:</span>
                  <p className="text-sm text-muted-foreground">{selectedRoom.dimensions}</p>
                </div>
              )}
              {selectedRoom.floor && (
                <div>
                  <span className="text-sm font-medium">Floor:</span>
                  <p className="text-sm text-muted-foreground">{selectedRoom.floor}</p>
                </div>
              )}
            </div>
            
            {selectedRoom.notes && (
              <div>
                <span className="text-sm font-medium">Notes:</span>
                <p className="text-sm text-muted-foreground">{selectedRoom.notes}</p>
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={() => window.location.href = `/room/${selectedRoom.id}`}
                className="w-full"
              >
                View Room Photos & Tips
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
            <p className="text-sm">Select your school from the dropdown above</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
            <p className="text-sm">Choose your residence hall or building</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
            <p className="text-sm">Find your room number to see photos and tips from previous residents</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DormExplorer;