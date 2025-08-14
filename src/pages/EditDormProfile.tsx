import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Upload, Camera, FileText, Contact, Save, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

const EditDormProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [dormName, setDormName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [contactEnabled, setContactEnabled] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastInitial, setContactLastInitial] = useState('');
  const [emptyPhotos, setEmptyPhotos] = useState<File[]>([]);
  const [decoratedPhotos, setDecoratedPhotos] = useState<File[]>([]);
  const [existingEmptyPhotos, setExistingEmptyPhotos] = useState<string[]>([]);
  const [existingDecoratedPhotos, setExistingDecoratedPhotos] = useState<string[]>([]);

  // Fetch dorm profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['dorm-profile', id],
    queryFn: async () => {
      if (!id || !user) return null;
      
      const { data, error } = await supabase
        .from('dorm_profiles')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user
  });

  // Load profile data when fetched
  useEffect(() => {
    if (profile) {
      setDormName(profile.dorm_name || '');
      setRoomNumber(profile.room_number || '');
      setNotes(profile.notes || '');
      setContactEnabled(profile.contact_enabled || false);
      setContactEmail(profile.contact_email || '');
      setContactFirstName(profile.contact_first_name || '');
      setContactLastInitial(profile.contact_last_initial || '');
      setExistingEmptyPhotos(profile.photos_empty || []);
      setExistingDecoratedPhotos(profile.photos_decorated || []);
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ publish = false }: { publish?: boolean } = {}) => {
      if (!user || !id) throw new Error('Missing required information');

      // Upload new photos
      const newEmptyPhotoUrls: string[] = [];
      const newDecoratedPhotoUrls: string[] = [];

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
        
        newEmptyPhotoUrls.push(publicUrl);
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
        
        newDecoratedPhotoUrls.push(publicUrl);
      }

      // Combine existing and new photos
      const allEmptyPhotos = [...existingEmptyPhotos, ...newEmptyPhotoUrls];
      const allDecoratedPhotos = [...existingDecoratedPhotos, ...newDecoratedPhotoUrls];

      // Update the profile
      const { data, error } = await supabase
        .from('dorm_profiles')
        .update({
          dorm_name: dormName.trim(),
          room_number: roomNumber.trim() || null,
          notes: notes.trim() || null,
          contact_enabled: contactEnabled,
          contact_email: contactEnabled ? contactEmail.trim() || null : null,
          contact_first_name: contactEnabled ? contactFirstName.trim() || null : null,
          contact_last_initial: contactEnabled ? contactLastInitial.trim() || null : null,
          photos_empty: allEmptyPhotos.length > 0 ? allEmptyPhotos : null,
          photos_decorated: allDecoratedPhotos.length > 0 ? allDecoratedPhotos : null,
          published: publish ? true : profile?.published || false
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dorm-profile', id] });
      queryClient.invalidateQueries({ queryKey: ['my-dorm-profiles'] });
      
      toast({
        title: variables.publish ? "Profile Published!" : "Profile Updated!",
        description: variables.publish 
          ? "Your dorm profile is now live and visible to other students."
          : "Your changes have been saved.",
      });
      
      if (variables.publish) {
        navigate(`/dorm/${id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
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

  const removePhoto = (index: number, type: 'empty' | 'decorated', isExisting: boolean = false) => {
    if (isExisting) {
      if (type === 'empty') {
        setExistingEmptyPhotos(prev => prev.filter((_, i) => i !== index));
      } else {
        setExistingDecoratedPhotos(prev => prev.filter((_, i) => i !== index));
      }
    } else {
      if (type === 'empty') {
        setEmptyPhotos(prev => prev.filter((_, i) => i !== index));
      } else {
        setDecoratedPhotos(prev => prev.filter((_, i) => i !== index));
      }
    }
  };

  const handleSaveDraft = () => {
    updateProfileMutation.mutate({});
  };

  const handlePublish = () => {
    updateProfileMutation.mutate({ publish: true });
  };

  if (!user) {
    return (
      <Layout showBackButton>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Please sign in to edit profiles.</p>
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
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout showBackButton>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Profile not found or you don't have permission to edit it.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-green to-dorm-blue bg-clip-text text-transparent">
            Edit Dorm Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Update your dorm information
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Contact className="h-5 w-5 mr-2 text-dorm-blue" />
                Contact Information (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={contactEnabled}
                  onCheckedChange={setContactEnabled}
                  id="contact-enabled"
                />
                <Label htmlFor="contact-enabled">
                  Allow other students to contact me about this dorm
                </Label>
              </div>

              {contactEnabled && (
                <div className="space-y-4 pl-6 border-l-2 border-dorm-blue/20">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@university.edu"
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input
                        value={contactFirstName}
                        onChange={(e) => setContactFirstName(e.target.value)}
                        placeholder="e.g. Sarah"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Initial</label>
                      <Input
                        value={contactLastInitial}
                        onChange={(e) => setContactLastInitial(e.target.value.substring(0, 1).toUpperCase())}
                        placeholder="e.g. M"
                        className="h-12"
                        maxLength={1}
                      />
                    </div>
                  </div>
                </div>
              )}
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
                  Add More Photos
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing photos */}
                {existingEmptyPhotos.map((photo, index) => (
                  <div key={`existing-empty-${index}`} className="relative">
                    <img
                      src={photo}
                      alt={`Empty room ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index, 'empty', true)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* New photos */}
                {emptyPhotos.map((photo, index) => (
                  <div key={`new-empty-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`New empty room ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index, 'empty', false)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                      NEW
                    </div>
                  </div>
                ))}
              </div>
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
                  Add More Photos
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing photos */}
                {existingDecoratedPhotos.map((photo, index) => (
                  <div key={`existing-decorated-${index}`} className="relative">
                    <img
                      src={photo}
                      alt={`Decorated room ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index, 'decorated', true)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* New photos */}
                {decoratedPhotos.map((photo, index) => (
                  <div key={`new-decorated-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`New decorated room ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index, 'decorated', false)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                      NEW
                    </div>
                  </div>
                ))}
              </div>
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

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleSaveDraft}
              disabled={updateProfileMutation.isPending || !dormName.trim()}
              variant="outline"
              size="lg"
              className="px-8"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={updateProfileMutation.isPending || !dormName.trim()}
              size="lg"
              className="px-8"
            >
              <Eye className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditDormProfile;
