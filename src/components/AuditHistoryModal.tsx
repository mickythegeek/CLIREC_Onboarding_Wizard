import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, FileEdit, Trash2, Lock, Unlock, CheckCircle, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/api';

interface AuditEntry {
    id: number;
    requirementId: number;
    action: string;
    changes: Record<string, any>;
    previousValues: Record<string, any> | null;
    createdAt: string;
    userName: string;
    userEmail: string;
}

interface AuditHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    requirementId: number;
    requirementName: string;
}

const getActionIcon = (action: string) => {
    switch (action) {
        case 'CREATE':
            return <Plus className="w-4 h-4 text-green-400" />;
        case 'UPDATE':
            return <FileEdit className="w-4 h-4 text-blue-400" />;
        case 'DELETE':
            return <Trash2 className="w-4 h-4 text-red-400" />;
        case 'STATUS_CHANGE':
            return <CheckCircle className="w-4 h-4 text-purple-400" />;
        case 'LOCK':
            return <Lock className="w-4 h-4 text-amber-400" />;
        case 'UNLOCK':
            return <Unlock className="w-4 h-4 text-green-400" />;
        default:
            return <Clock className="w-4 h-4 text-gray-400" />;
    }
};

const getActionLabel = (action: string) => {
    switch (action) {
        case 'CREATE':
            return 'Created';
        case 'UPDATE':
            return 'Updated';
        case 'DELETE':
            return 'Deleted';
        case 'STATUS_CHANGE':
            return 'Status Changed';
        case 'LOCK':
            return 'Locked';
        case 'UNLOCK':
            return 'Unlocked';
        default:
            return action;
    }
};

const getActionColor = (action: string) => {
    switch (action) {
        case 'CREATE':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'UPDATE':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'DELETE':
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'STATUS_CHANGE':
            return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'LOCK':
            return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'UNLOCK':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export function AuditHistoryModal({
    isOpen,
    onClose,
    requirementId,
    requirementName,
}: AuditHistoryModalProps) {
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && requirementId) {
            setIsLoading(true);
            adminApi.getAuditHistory(requirementId)
                .then((response) => {
                    setAuditLogs(response.data);
                })
                .catch((error) => {
                    console.error('Failed to load audit history:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen, requirementId]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[80vh] m-4 glass rounded-2xl border border-border/50 shadow-card overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border/50">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Audit History</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {requirementName}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : auditLogs.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No audit history found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {auditLogs.map((log, index) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative pl-8 pb-4 border-l-2 border-border/50 last:pb-0"
                                    >
                                        {/* Timeline dot */}
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                                            {getActionIcon(log.action)}
                                        </div>

                                        {/* Content */}
                                        <div className="glass-light rounded-xl p-4 border border-border/30">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                                                        {getActionLabel(log.action)}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(log.createdAt)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <User className="w-3.5 h-3.5" />
                                                <span>{log.userName}</span>
                                                {log.userEmail && (
                                                    <span className="text-xs opacity-70">({log.userEmail})</span>
                                                )}
                                            </div>

                                            {/* Changes */}
                                            {log.changes && Object.keys(log.changes).length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-border/30">
                                                    <p className="text-xs text-muted-foreground mb-2">Changes:</p>
                                                    <div className="space-y-1">
                                                        {Object.entries(log.changes).map(([key, value]) => {
                                                            if (key === 'responseJson' || key === 'adminEdit') return null;
                                                            const prevValue = log.previousValues?.[key];
                                                            return (
                                                                <div key={key} className="text-xs">
                                                                    <span className="text-muted-foreground capitalize">
                                                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                                    </span>{' '}
                                                                    {prevValue !== undefined && prevValue !== value ? (
                                                                        <>
                                                                            <span className="text-red-400 line-through">{String(prevValue)}</span>
                                                                            {' → '}
                                                                            <span className="text-green-400">{String(value)}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-foreground">{String(value)}</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
