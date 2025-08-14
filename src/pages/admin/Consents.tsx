import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Download, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AdminConsents = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  // Note: This is a simplified admin check - in a real app you'd have proper role-based access
  const isAdmin = user?.email === 'penelope.pressman@gmail.com';

  const { data: consents, isLoading, error } = useQuery({
    queryKey: ['admin-consents', searchEmail],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Unauthorized access');
      }

      let query = supabase
        .from('user_consents')
        .select(`
          id,
          user_id,
          tos_version,
          privacy_version,
          consented_at,
          ip_address,
          user_agent
        `)
        .order('consented_at', { ascending: false });

      const { data: consentsData, error } = await query;
      if (error) throw error;

      // Get user emails separately
      const userIds = consentsData?.map(c => c.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, email')
        .in('user_id', userIds);

      // Combine data
      const result = consentsData?.map(consent => ({
        ...consent,
        email: profilesData?.find(p => p.user_id === consent.user_id)?.email || 'Unknown'
      })) || [];

      // Filter by email if needed
      if (searchEmail.trim()) {
        return result.filter(item => 
          item.email.toLowerCase().includes(searchEmail.trim().toLowerCase())
        );
      }

      return result;
    },
    enabled: isAdmin,
  });

  const exportToCsv = () => {
    if (!consents?.length) {
      toast({
        title: "No data to export",
        description: "There are no consent records to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Email', 'TOS Version', 'Privacy Version', 'Consented At', 'IP Address', 'User Agent'];
    const csvContent = [
      headers.join(','),
      ...consents.map(consent => [
        consent.email || 'Unknown',
        consent.tos_version,
        consent.privacy_version,
        new Date(consent.consented_at).toISOString(),
        consent.ip_address || '',
        consent.user_agent || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dorm-scout-consents-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export completed",
      description: `Exported ${consents.length} consent records to CSV.`,
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Consents Administration</CardTitle>
          <p className="text-muted-foreground">
            Search and export user consent records for legal compliance.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search-email">Search by Email</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-email"
                  type="email"
                  placeholder="Enter email address..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={exportToCsv} disabled={!consents?.length}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-destructive text-sm">
              Error loading consents: {error.message}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading consent records...</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>TOS Version</TableHead>
                    <TableHead>Privacy Version</TableHead>
                    <TableHead>Consented At</TableHead>
                    <TableHead className="hidden md:table-cell">IP Address</TableHead>
                    <TableHead className="hidden lg:table-cell">User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consents && consents.length > 0 ? (
                    consents.map((consent) => (
                      <TableRow key={consent.id}>
                        <TableCell className="font-medium">
                          {consent.email || 'Unknown'}
                        </TableCell>
                        <TableCell>{consent.tos_version}</TableCell>
                        <TableCell>{consent.privacy_version}</TableCell>
                        <TableCell>
                          {new Date(consent.consented_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {consent.ip_address || 'N/A'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-xs truncate">
                          {consent.user_agent || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchEmail ? 'No consents found for this email.' : 'No consent records found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {consents && consents.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing {consents.length} consent record{consents.length !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConsents;