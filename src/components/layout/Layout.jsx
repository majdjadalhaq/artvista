import { Outlet } from 'react-router-dom';
import Header from './Header';
import NoiseOverlay from '../ui/NoiseOverlay';
import ToastContainer from '../ui/ToastContainer';
import DetailView from '../artwork/DetailView';

export default function Layout() {
    return (
        <div className="min-h-screen w-full relative">
            <NoiseOverlay />
            <Header />
            <main className="relative z-10">
                <Outlet />
            </main>
            <DetailView />
            <ToastContainer />
        </div>
    );
}
