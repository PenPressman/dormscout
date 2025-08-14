import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, School, Building, Camera, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface School {
  id: string;
  name: string;
}

const CreateDormProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  if (!user) {
    window.location.href = '/auth';
    return null;
  }
  
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [dormName, setDormName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [emptyPhotos, setEmptyPhotos] = useState<File[]>([]);
  const [decoratedPhotos, setDecoratedPhotos] = useState<File[]>([]);

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

  // Create dorm profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedSchoolId || !dormName.trim()) {
        throw new Error('Missing required information');
      }

      // Upload photos to storage first
      const emptyPhotoUrls: string[] = [];
      const decoratedPhotoUrls: string[] = [];

      // Upload empty room photos
      for (const photo of emptyPhotos) {
        const fileName = `empty_${Date.now()}_${Math.random()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('dorm-photos')
          .upload(fileName, photo);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('dorm-photos')
          .getPublicUrl(uploadData.path);
        
        emptyPhotoUrls.push(publicUrl);
      }

      // Upload decorated room photos
      for (const photo of decoratedPhotos) {
        const fileName = `decorated_${Date.now()}_${Math.random()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('dorm-photos')
          .upload(fileName, photo);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('dorm-photos')
          .getPublicUrl(uploadData.path);
        
        decoratedPhotoUrls.push(publicUrl);
      }

      // Create the dorm profile
      const { data, error } = await supabase
        .from('dorm_profiles')
        .insert({
          user_id: user.id,
          school_id: selectedSchoolId,
          dorm_name: dormName.trim(),
          room_number: roomNumber.trim() || null,
          notes: notes.trim() || null,
          photos_empty: emptyPhotoUrls.length > 0 ? emptyPhotoUrls : null,
          photos_decorated: decoratedPhotoUrls.length > 0 ? decoratedPhotoUrls : null,
          published: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Draft Saved!",
        description: "Your dorm profile has been created. You can publish it when ready.",
      });
      navigate(`/dorm/edit/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create dorm profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating profile:', error);
    }
  });

  const handlePhotoUpload = (files: FileList | null, type: 'empty' | 'decorated') => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (type === 'empty') {
      setEmptyPhotos(prev => [...prev, ...newFiles]);
    } else {
      setDecoratedPhotos(prev => [...prev, ...newFiles]);
    }
  };

  const removePhoto = (index: number, type: 'empty' | 'decorated') => {
    if (type === 'empty') {
      setEmptyPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setDecoratedPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    if (!selectedSchoolId || !dormName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a school and enter a dorm name.",
        variant: "destructive",
      });
      return;
    }

    createProfileMutation.mutate();
  };

  return (
    <Layout showBackButton>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-green to-dorm-blue rounded-full mb-6">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-green to-dorm-blue bg-clip-text text-transparent">
            Create Dorm Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your dorm experience to help future students
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="h-5 w-5 mr-2 text-dorm-blue" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">School *</label>
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools?.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dorm Name *</label>
                <Input
                  value={dormName}
                  onChange={(e) => setDormName(e.target.value)}
                  placeholder="e.g. Thayer Hall, Smith House"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Room Number (Optional)</label>
                <Input
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 204, A15"
                  className="h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Empty Room Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-dorm-pink" />
                Empty Room Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input
                  type="file"
                  id="empty-photos"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files, 'empty')}
                  className="hidden"
                />
                <label
                  htmlFor="empty-photos"
                  className="inline-flex items-center px-4 py-2 bg-dorm-pink text-white rounded-lg cursor-pointer hover:bg-dorm-pink/90 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Empty Room Photos
                </label>
              </div>
              
              {emptyPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {emptyPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Empty room ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index, 'empty')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Decorated Room Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-dorm-orange" />
                Decorated Room Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input
                  type="file"
                  id="decorated-photos"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files, 'decorated')}
                  className="hidden"
                />
                <label
                  htmlFor="decorated-photos"
                  className="inline-flex items-center px-4 py-2 bg-dorm-orange text-white rounded-lg cursor-pointer hover:bg-dorm-orange/90 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Decorated Room Photos
                </label>
              </div>
              
              {decoratedPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {decoratedPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Decorated room ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index, 'decorated')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-dorm-green" />
                Room Notes & Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share helpful information about your room - storage tips, bathroom details, laundry info, what to bring, what not to bring, etc."
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={createProfileMutation.isPending}
              size="lg"
              className="px-12 py-3 text-lg"
            >
              {createProfileMutation.isPending ? 'Creating...' : 'Save Draft'}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              You can review and publish your profile later
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateDormProfile;