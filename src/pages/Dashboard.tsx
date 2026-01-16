import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { requirementsApi, adminApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
    Plus,
    Download,
    Trash2,
    Edit,
    FileJson,
    Calendar,
    Building,
    Clock,
    LogOut,
    Shield,
} from 'lucide-react';

interface Requirement {
    id: number;
    userId: number;
    clientName: string;
    clientId: string;
    region: string;
    status: string;
    createdAt: string;
    updatedAt: string | null;
    userEmail?: string;
    userFullName?: string;
}

export default function Dashboard() {
    const { user, logout, isAdmin } = useAuth();
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRequirements();
    }, [isAdmin]);

    const loadRequirements = async () => {
        try {
            const response = isAdmin
                ? await adminApi.getAllRequirements()
                : await requirementsApi.getMyRequirements();
            setRequirements(response.data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load requirements.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (id: number) => {
        try {
            const response = await requirementsApi.downloadRequirement(id);
            const blob = new Blob([response.data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `requirement_${id}.json`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to download requirement.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this requirement?')) return;

        try {
            await requirementsApi.deleteRequirement(id);
            setRequirements((prev) => prev.filter((r) => r.id !== id));
            toast({
                title: 'Deleted',
                description: 'Requirement deleted successfully.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete requirement.',
                variant: 'destructive',
            });
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await adminApi.updateStatus(id, newStatus);
            setRequirements((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
            );
            toast({
                title: 'Updated',
                description: `Status changed to ${newStatus}.`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update status.',
                variant: 'destructive',
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'submitted':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'rejected':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-border/50 glass">
                <div className="container max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/CLIREC_Logo.png" alt="CLIREC Logo" className="h-10" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                    {isAdmin && <Shield className="w-3 h-3" />}
                                    {user?.email}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 container max-w-6xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            {isAdmin ? 'All Submissions' : 'My Submissions'}
                        </h1>
                        <Link to="/wizard">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Requirement
                            </Button>
                        </Link>
                    </div>
                    <p className="text-muted-foreground">
                        {isAdmin
                            ? 'View and manage all account requirement submissions.'
                            : 'View and manage your submitted account requirements.'}
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                ) : requirements.length === 0 ? (
                    <div className="text-center py-12 glass rounded-2xl border border-border/50">
                        <FileJson className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No submissions yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first account requirement to get started.
                        </p>
                        <Link to="/wizard">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Requirement
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {requirements.map((req, index) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass rounded-xl border border-border/50 p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-foreground truncate">
                                                {req.clientName || 'Untitled'}
                                            </h3>
                                            <span
                                                className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(req.status)}`}
                                            >
                                                {req.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Building className="w-4 h-4" />
                                                {req.clientId || 'No ID'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                            {req.updatedAt && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    Updated: {new Date(req.updatedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                            {isAdmin && req.userFullName && (
                                                <span className="text-primary">By: {req.userFullName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isAdmin && (
                                            <select
                                                value={req.status}
                                                onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                                className="text-sm bg-secondary border border-border rounded-lg px-2 py-1"
                                            >
                                                <option value="Draft">Draft</option>
                                                <option value="Submitted">Submitted</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        )}
                                        <Link to={`/wizard/edit/${req.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" onClick={() => handleDownload(req.id)}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(req.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border/50 py-4">
                <div className="container max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        CLIREC Onboarding Wizard — Streamlining Bank Reconciliation
                    </p>
                </div>
            </footer>
        </div>
    );
}
