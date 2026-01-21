import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artInstituteApi } from '../services/artInstituteApi';
import PageTransition from '../components/animations/PageTransition';
import DetailView from '../components/artwork/DetailView';

export default function ArtworkDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                let data;
                if (id.startsWith('europeana-')) {
                    const { europeanaApi } = await import('../services/europeanaApi');
                    data = await europeanaApi.getById(id);
                } else {
                    data = await artInstituteApi.getById(id);
                }
                setArtwork(data);
            } catch (error) {
                console.error("Failed to fetch detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!artwork) return <div className="text-center pt-32">Artwork not found.</div>;

    return (
        <PageTransition>
            <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
                <DetailView
                    artwork={artwork}
                    onClose={() => navigate(-1)}
                />
            </div>
        </PageTransition>
    );
}
