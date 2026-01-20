import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useCollections } from '../context/CollectionsContext';

const Navbar = () => {
    const location = useLocation();
    const { savedArtworks } = useCollections();

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'Collections', path: '/collections', count: savedArtworks.length },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter">
                AV.
            </Link>

            <ul className="flex items-center gap-8">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <li key={link.name}>
                            <Link to={link.path} className="relative group block">
                                <motion.span
                                    className={clsx(
                                        "text-sm uppercase tracking-widest font-medium transition-colors duration-300",
                                        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                                    )}
                                    whileHover={link.name === 'Explore' ? { scale: 1.2 } : {}}
                                >
                                    {link.name}
                                    {link.count !== undefined && link.count > 0 && (
                                        <sup className="ml-1 text-[10px] text-art-accent">{link.count}</sup>
                                    )}
                                </motion.span>

                                {isActive && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute -bottom-2 left-0 right-0 h-[1px] bg-art-accent"
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navbar;
