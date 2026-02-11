import React from 'react';

const ParticleMap = ({ userPos, closestParticle, seed, particles }) => {
    // If no particles passed, fallback to empty or default (though logic ensures they are passed)
    const mapParticles = particles || [];

    return (
        <div style={{
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 16, 50, 0.8) 0%, rgba(5, 5, 20, 0.8) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            position: 'relative',
            marginTop: '20px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
        }}>
            {/* Grid lines */}
            <div style={{
                position: 'absolute', top: '50%', left: '0', right: '0', height: '1px',
                background: 'rgba(255, 255, 255, 0.1)'
            }} />
            <div style={{
                position: 'absolute', left: '50%', top: '0', bottom: '0', width: '1px',
                background: 'rgba(255, 255, 255, 0.1)'
            }} />

            {/* Connection Line to Closest Particle */}
            {closestParticle && (
                <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 4 // Behind particles
                }}>
                    <line
                        x1={`${userPos.x}%`}
                        y1={`${userPos.y}%`}
                        x2={`${closestParticle.x}%`}
                        y2={`${closestParticle.y}%`}
                        stroke="rgba(255, 215, 0, 0.6)"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                    />
                    {/* Glow Effect Duplicate */}
                    <line
                        x1={`${userPos.x}%`}
                        y1={`${userPos.y}%`}
                        x2={`${closestParticle.x}%`}
                        y2={`${closestParticle.y}%`}
                        stroke="rgba(255, 215, 0, 0.3)"
                        strokeWidth="4"
                        filter="blur(2px)"
                    />
                </svg>
            )}

            {/* Static Particles */}
            {mapParticles.map((p, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: p.color,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: '#000',
                    fontWeight: 'bold',
                    boxShadow: `0 0 6px ${p.color}`,
                    opacity: 0.9,
                    cursor: 'default',
                    zIndex: 5
                }} title={p.name}>
                    {p.symbol}
                </div>
            ))}

            {/* User Position - The "Result" */}
            <div style={{
                position: 'absolute',
                left: `${userPos.x}%`,
                top: `${userPos.y}%`,
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: 'white',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px 2px white, 0 0 20px 5px var(--gold)', // Strong static shadow
                zIndex: 10,
                // animation: 'pulse 2s infinite' // Removed animation for reliable capture, or add separate element
            }} />
            {/* Pulse Ring (Separate element for animation, main dot is static for capture) */}
            <div style={{
                position: 'absolute',
                left: `${userPos.x}%`,
                top: `${userPos.y}%`,
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 15px 5px var(--gold)',
                zIndex: 9,
                animation: 'pulse 2s infinite'
            }} />

            <div style={{
                position: 'absolute',
                bottom: '-25px',
                width: '100%',
                textAlign: 'center',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1px'
            }}>
                QHACETTEPE
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ParticleMap;
