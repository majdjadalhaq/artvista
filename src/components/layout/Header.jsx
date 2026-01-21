import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCollection } from '../../context/CollectionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../common/Logo';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const location = useLocation();
    const { collection } = useCollection();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'Collection', path: '/collection', count: collection.length },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 md:py-8 mix-blend-difference text-white pointer-events-none">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-xl font-serif font-bold tracking-widest pointer-events-auto hover:opacity-70 transition-opacity z-[110]">
                <Logo className="w-8 h-8" />
                <span>ArtVista</span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8 md:gap-12 pointer-events-auto">
                {links.map(l => (
                    <li key={l.name} className="relative group">
                        <Link
                            to={l.path}
                            className={`text-[10px] uppercase tracking-[0.25em] font-sans font-medium hover:opacity-70 transition-opacity ${location.pathname === l.path ? 'opacity-100' : 'opacity-50'}`}
                        >
                            {l.name}
                            {l.count > 0 && <sup className="ml-1 text-[8px]">{l.count}</sup>}
                        </Link>
                        {location.pathname === l.path && (
                            <motion.div
                                layoutId="dot"
                                className="absolute -bottom-2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2"
                            />
                        )}
                    </li>
                ))}
            </ul>

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden pointer-events-auto z-[110] p-2 hover:opacity-70 transition-opacity"
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-charcoal-ink pointer-events-auto md:hidden flex flex-col items-center justify-center z-[100]"
                    >
                        <ul className="flex flex-col items-center gap-8">
                            {links.map((l, i) => (
                                <motion.li
                                    key={l.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (i * 0.1) }}
                                >
                                    <Link
                                        to={l.path}
                                        className={`text-3xl font-serif font-bold hover:text-turquoise-core transition-colors flex items-start gap-2 ${location.pathname === l.path ? 'text-turquoise-core' : 'text-white'}`}
                                    >
                                        {l.name}
                                        {l.count > 0 && <span className="text-xs font-sans mt-1 bg-white text-charcoal-ink px-1.5 py-0.5 rounded-full">{l.count}</span>}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
