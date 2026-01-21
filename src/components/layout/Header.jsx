import { Link, useLocation } from 'react-router-dom';
import { useCollection } from '../../context/CollectionContext';
import { motion } from 'framer-motion';

export default function Header() {
    const location = useLocation();
    const { collection } = useCollection();

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'Collection', path: '/collection', count: collection.length },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-8 mix-blend-difference text-white pointer-events-none">
            <Link to="/" className="text-xl font-serif font-bold tracking-widest pointer-events-auto hover:opacity-70 transition-opacity">
                ArtVista
            </Link>

            {/* Desktop Navigation */}
            <ul className="flex items-center gap-8 md:gap-12 pointer-events-auto">
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
        </nav>
    );
}
