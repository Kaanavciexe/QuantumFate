import { useEffect, useState } from 'react';

export default function QuantumAnimation({ onComplete }) {
    const [exiting, setExiting] = useState(false);
    const [particles, setParticles] = useState([]);

    // Initialize random parameters for each particle
    useEffect(() => {
        const newParticles = Array.from({ length: 6 }).map((_, i) => ({
            angle: i * 60, // Fixed 60 degree separation
            speed: 0.5 + Math.random() * 1.5, // Random speed
            offset: Math.random() * Math.PI * 2, // Random starting phase
            baseRadius: 100,
            currentRadius: 100
        }));
        setParticles(newParticles);
    }, []);

    // Animation Loop
    useEffect(() => {
        let animationFrameId;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000; // seconds

            setParticles(prev => prev.map(p => ({
                ...p,
                // Oscillate radius. 70 is base, +/- 30 variance.
                // We want "to and from center", so radius changes.
                // Random speed and offset makes it chaotic/atomic.
                currentRadius: 70 + Math.sin(elapsed * p.speed + p.offset) * 30
            })));

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onComplete, 500);
        }, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    // Calculate positions for rendering
    // Center is 150, 150 (half of 300x300 container)
    // Guard against empty particles state
    const renderedParticles = particles.length > 0 ? particles.map(p => {
        const rad = (p.angle - 90) * (Math.PI / 180);
        return {
            x: 150 + p.currentRadius * Math.cos(rad),
            y: 150 + p.currentRadius * Math.sin(rad)
        };
    }) : [];

    // Generate Polygon Points string for the connecting line
    // This creates a closed loop (hexagon-ish but distorted)
    const pointsString = renderedParticles.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div className={`animation-overlay ${exiting ? 'fade-out' : 'fade-in'}`} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            background: 'rgba(0,0,0,0.8)', // Ensure dark backdrop
            backdropFilter: 'blur(5px)'
        }}>
            <style>{`
                @keyframes pulse-core {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.7; box-shadow: 0 0 20px var(--gold); }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; box-shadow: 0 0 50px var(--gold), 0 0 80px rgba(255, 215, 0, 0.4); }
                    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.7; box-shadow: 0 0 20px var(--gold); }
                }
                @keyframes rotate-group {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div className="animation-inner-container" style={{ position: 'relative', width: '300px', height: '300px' }}>

                {/* 1. Center Flashing Yellow Light */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '50px',
                    background: 'var(--gold)',
                    borderRadius: '50%',
                    animation: 'pulse-core 1.2s infinite ease-in-out',
                    zIndex: 10
                }} />

                {/* 2. Dynamic Particles Container (Rotates slowly for extra effect) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    animation: 'rotate-group 12s linear infinite'
                }}>
                    <svg width="300" height="300" style={{ position: 'absolute', top: 0, left: 0 }}>
                        {/* Dynamic Connections (The "Hexagon" perimeter) */}
                        <polygon
                            points={pointsString}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.3)"
                            strokeWidth="1"
                        />
                        {/* Connections to center */}
                        {renderedParticles.map((p, i) => (
                            <line
                                key={i}
                                x1="150" y1="150"
                                x2={p.x} y2={p.y}
                                stroke="rgba(255, 255, 255, 0.1)"
                                strokeWidth="1"
                            />
                        ))}
                    </svg>

                    {/* Render Particles */}
                    {renderedParticles.map((p, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: '12px',
                            height: '12px',
                            background: 'white',
                            borderRadius: '50%',
                            top: `${p.y}px`,
                            left: `${p.x}px`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 10px white, 0 0 20px rgba(255, 255, 255, 0.5)'
                        }} />
                    ))}
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    width: '100%',
                    textAlign: 'center',
                    color: 'var(--gold)',
                    fontSize: '1rem',
                    letterSpacing: '3px',
                    opacity: 0.8
                }}>
                    HESAPLANIYOR...
                </div>
            </div>
        </div>
    );
}
