import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { ArrowLeft, RefreshCw, Users, Mail } from 'lucide-react';

interface Signup {
  name: string;
  email: string;
  timestamp: number;
  date: string;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSignups = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ff533cce/signups`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signups');
      }

      // Sort by timestamp descending (newest first)
      const sortedSignups = (data.signups || []).sort(
        (a: Signup, b: Signup) => b.timestamp - a.timestamp
      );

      setSignups(sortedSignups);
    } catch (err) {
      console.error('Error fetching signups:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch signups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignups();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Site
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Dr. Spill - Signup Management</p>
            </div>
            <Button
              onClick={fetchSignups}
              disabled={isLoading}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Signups
              </CardTitle>
              <Users className="w-5 h-5 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{signups.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Latest Signup
              </CardTitle>
              <Mail className="w-5 h-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-white">
                {signups.length > 0 ? signups[0].email : 'No signups yet'}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Signups Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">All Signups</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                  <p className="mt-2 text-gray-400">Loading signups...</p>
                </div>
              ) : signups.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No signups yet. Share your coming soon page!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 font-semibold text-gray-400">#</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-400">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-400">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-400">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signups.map((signup, index) => (
                        <motion.tr
                          key={signup.timestamp}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-zinc-800 hover:bg-teal-500/5 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                          <td className="py-3 px-4 font-medium text-white">{signup.name}</td>
                          <td className="py-3 px-4 text-gray-300">{signup.email}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {formatDate(signup.date)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Export section */}
        {signups.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <Button
              onClick={() => {
                const csv = [
                  ['Name', 'Email', 'Date'],
                  ...signups.map(s => [s.name, s.email, s.date]),
                ]
                  .map(row => row.join(','))
                  .join('\\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dr-spill-signups-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              variant="outline"
              className="border-teal-600 text-teal-400 hover:bg-teal-500/10"
            >
              Export to CSV
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}