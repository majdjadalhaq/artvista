import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-9xl font-serif text-[var(--text-primary)] mb-4"
            >
                404
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-sans text-[var(--text-secondary)] mb-8"
            >
                The artwork you are looking for does not exist in our collection.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Link
                    to="/"
                    className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-sans uppercase tracking-widest hover:bg-opacity-90 transition-all"
                >
                    Return Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
