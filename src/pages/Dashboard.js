import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, CheckCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const [sources, setSources] = useState([]);
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSource, setNewSource] = useState({ name: '', url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sourcesRes, rfpsRes] = await Promise.all([
        axios.get(`${API}/rfp-sources`),
        axios.get(`${API}/rfps`)
      ]);
      setSources(sourcesRes.data);
      setRfps(rfpsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/rfp-sources`, newSource);
      setNewSource({ name: '', url: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" data-testid="dashboard-page">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-heading font-bold tracking-tight">RFP Monitoring Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage RFP sources and monitor incoming requests</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-morphism border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Active Sources</p>
                    <p className="text-4xl font-heading font-bold text-primary mt-2">{sources.length}</p>
                  </div>
                  <Globe className="h-12 w-12 text-primary/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-morphism border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Available RFPs</p>
                    <p className="text-4xl font-heading font-bold text-green-400 mt-2">{rfps.length}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-400/30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-morphism border-secondary/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Monitoring Status</p>
                    <p className="text-2xl font-heading font-bold text-secondary mt-2 flex items-center gap-2">
                      <Activity className="h-6 w-6 animate-pulse" />
                      Active
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* RFP Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading">RFP Sources</CardTitle>
                <CardDescription>Active sources being monitored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sources.map((source, idx) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="glass-morphism rounded-lg p-4 space-y-2"
                    data-testid={`source-card-${source.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold">{source.name}</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        {source.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono truncate">{source.url}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Add New Source */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Add RFP Source</CardTitle>
                <CardDescription>Monitor a new RFP portal or website</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSource} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-name" className="text-sm font-mono uppercase tracking-wider">Source Name</Label>
                    <Input
                      id="source-name"
                      placeholder="e.g., Government Procurement Portal"
                      value={newSource.name}
                      onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                      required
                      data-testid="source-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-url" className="text-sm font-mono uppercase tracking-wider">Source URL</Label>
                    <Input
                      id="source-url"
                      type="url"
                      placeholder="https://..."
                      value={newSource.url}
                      onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                      required
                      data-testid="source-url-input"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase tracking-wider"
                    data-testid="add-source-btn"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Source
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}