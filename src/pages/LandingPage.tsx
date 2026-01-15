import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
    CheckCircle,
    Shield,
    Download,
    Users,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const LandingPage = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Redirect authenticated users to wizard
    if (!isLoading && isAuthenticated) {
        return <Navigate to="/wizard" replace />;
    }

    const features = [
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: 'Guided Configuration',
            description: 'Step-by-step wizard walks you through complex account setup with ease.'
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Secure & Persistent',
            description: 'Your data is safely stored and accessible anytime from your account.'
        },
        {
            icon: <Download className="w-6 h-6" />,
            title: 'Export Ready',
            description: 'Download configurations as JSON files for seamless integration.'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Admin Dashboard',
            description: 'Track and manage all submissions with powerful admin tools.'
        }
    ];

    const steps = [
        { number: '01', title: 'Create Account', description: 'Sign up in seconds' },
        { number: '02', title: 'Configure Accounts', description: 'Use our guided wizard' },
        { number: '03', title: 'Submit & Download', description: 'Get your JSON config' }
    ];

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header/Navbar */}
            <header className="relative z-10 px-6 py-4">
                <nav className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/CLIREC_Logo.png"
                            alt="CLIREC"
                            className="h-10 w-auto"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link to="/wizard">
                                    <Button className="bg-primary hover:bg-primary/90">
                                        Go to Wizard
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-primary hover:bg-primary/90">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 px-6 pt-20 pb-32">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            Streamline Your Bank Reconciliation
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        Configure Account
                        <br />
                        <span className="text-gradient">Requirements</span>
                        <br />
                        With Ease
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                    >
                        The CLIREC Onboarding Wizard guides you through complex bank reconciliation
                        configurations. No more spreadsheets or confusing documents.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to={isAuthenticated ? '/wizard' : '/register'}>
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto group">
                                {isAuthenticated ? 'Open Wizard' : 'Get Started Free'}
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 px-6 py-24 bg-card/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Powerful features designed to simplify your workflow
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="p-6 rounded-2xl glass hover:bg-card/60 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Three simple steps to get your configuration ready
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="text-center relative"
                            >
                                {/* Connection Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                                )}

                                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full glass mb-6">
                                    <span className="text-3xl font-bold text-primary">{step.number}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="p-12 rounded-3xl glass text-center relative overflow-hidden"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10">
                            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                                Join teams who trust CLIREC for their bank reconciliation configuration needs.
                            </p>
                            <Link to={isAuthenticated ? '/wizard' : '/register'}>
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10 py-6 h-auto">
                                    {isAuthenticated ? 'Open Wizard' : 'Create Free Account'}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-border/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="/CLIREC_Logo.png"
                            alt="CLIREC"
                            className="h-8 w-auto opacity-60"
                        />
                        <span className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} CLIREC. All rights reserved.
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                            Register
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
