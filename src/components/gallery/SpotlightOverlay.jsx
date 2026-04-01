import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * SpotlightOverlay — museum-mode cursor light
 *
 * A full-screen dark veil with a circular "torch" that follows the cursor.
 * The radius pulses gently to simulate a real light source.
 * pointer-events: none so it never blocks clicks on cards below.
 */
export default function SpotlightOverlay() {
    const overlayRef = useRef(null);

    useEffect(() => {
        const el = overlayRef.current;
        if (!el) return;

        // Proxy object used for GSAP to tween numeric values cleanly
        const pos = { cx: window.innerWidth / 2, cy: window.innerHeight / 2, r: 280 };

        // quickTo gives silky-smooth cursor tracking without layout thrash
        const xTo = gsap.quickTo(pos, 'cx', { duration: 0.15, ease: 'power2.out',
            onUpdate: () => el.style.setProperty('--cx', `${pos.cx}px`) });
        const yTo = gsap.quickTo(pos, 'cy', { duration: 0.15, ease: 'power2.out',
            onUpdate: () => el.style.setProperty('--cy', `${pos.cy}px`) });

        // Subtle radius pulse — feels like a real, slightly unstable torch
        const pulseTween = gsap.to(pos, {
            r: 320,
            duration: 2.2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            onUpdate: () => el.style.setProperty('--r', `${pos.r}px`),
        });

        // Initialise CSS props so there's no flash on first render
        el.style.setProperty('--cx', `${pos.cx}px`);
        el.style.setProperty('--cy', `${pos.cy}px`);
        el.style.setProperty('--r', `${pos.r}px`);

        const onMove = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener('mousemove', onMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            pulseTween.kill();
        };
    }, []);

    return (
        <div
            ref={overlayRef}
            aria-hidden="true"
            style={{
                background: 'radial-gradient(circle var(--r) at var(--cx) var(--cy), transparent 0%, rgba(8,8,8,0.93) 100%)',
            }}
            className="fixed inset-0 z-[35] pointer-events-none"
        />
    );
}
