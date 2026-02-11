import { useRef, useState } from 'react';
import ParticleMap from './ParticleMap';
import domtoimage from 'dom-to-image-more';

export default function ResultCard({ data, onReset }) {
    const cardRef = useRef(null);
    const [exiting, setExiting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current || isDownloading) return;

        try {
            setIsDownloading(true);

            // --- 1. AYARLAR ---
            const targetWidth = 1080;
            const targetHeight = 1920;
            const marginFactor = 0.85;

            // --- 2. HAYALET KAPSAYICI ---
            const ghostContainer = document.createElement('div');
            Object.assign(ghostContainer.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '0px',
                height: '0px',
                overflow: 'hidden',
                zIndex: '-9999',
                visibility: 'hidden'
            });
            document.body.appendChild(ghostContainer);

            // --- 3. SANAL STÜDYO ---
            const studio = document.createElement('div');
            Object.assign(studio.style, {
                width: `${targetWidth}px`,
                height: `${targetHeight}px`,
                visibility: 'visible',
                background: 'linear-gradient(180deg, #050510 0%, #1a1a40 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '0',
                left: '0'
            });
            ghostContainer.appendChild(studio);

            // --- 4. KARTI KOPYALA ---
            const originalElement = cardRef.current;
            const clonedCard = originalElement.cloneNode(true);
            const originalWidth = originalElement.offsetWidth;
            const scale = (targetWidth * marginFactor) / originalWidth;

            clonedCard.style.transform = `scale(${scale})`;
            clonedCard.style.transformOrigin = 'center center';
            clonedCard.style.margin = '0';
            clonedCard.style.boxShadow = '0 0 80px rgba(0, 0, 0, 0.6)';

            // --- 5. CANVASLARI AKTAR ---
            const originalCanvases = originalElement.querySelectorAll('canvas');
            const clonedCanvases = clonedCard.querySelectorAll('canvas');

            originalCanvases.forEach((origCanvas, index) => {
                const cloneCanvas = clonedCanvases[index];
                if (cloneCanvas) {
                    cloneCanvas.width = origCanvas.width;
                    cloneCanvas.height = origCanvas.height;
                    const ctx = cloneCanvas.getContext('2d');
                    ctx.drawImage(origCanvas, 0, 0);
                }
            });

            studio.appendChild(clonedCard);

            // --- 6. FOTOĞRAFI ÇEK ---
            const config = {
                width: targetWidth,
                height: targetHeight,
                style: {
                    transform: 'none',
                    transformOrigin: 'top left',
                    width: `${targetWidth}px`,
                    height: `${targetHeight}px`
                },
                quality: 0.95
            };

            const dataUrl = await domtoimage.toPng(studio, config);

            // --- 7. İNDİRME ---
            document.body.removeChild(ghostContainer);
            const link = document.createElement('a');
            link.download = `Kuantum_Kaderim_${data.seed}.png`;
            link.href = dataUrl;
            link.click();

        } catch (err) {
            console.error("Hata:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleResetClick = () => {
        setExiting(true);
        setTimeout(onReset, 500);
    };

    return (
        <div className={`result-container ${exiting ? 'fade-out' : 'fade-in'}`} style={{
            // --- EKRANA ÇİVİLEME AYARLARI ---
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100dvh',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            zIndex: 100,
            backgroundColor: '#050510',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
        }}>
            {/* KART (EKRANDA GÖRÜNEN) */}
            <div
                ref={cardRef}
                className="quantum-card"
                style={{
                    width: '320px',
                    maxWidth: '90vw',
                    height: 'auto',
                    maxHeight: '75vh',
                    aspectRatio: '9/16',
                    background: 'linear-gradient(135deg, rgba(10, 10, 42, 0.95) 0%, rgba(26, 26, 64, 0.95) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    borderRadius: '2px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
                    position: 'relative',
                    overflow: 'visible',
                    backdropFilter: 'blur(5px)'
                }}
            >
                {/* ... KART İÇERİĞİ ... */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
                    opacity: '0.4',
                    pointerEvents: 'none'
                }} />

                <h3 style={{
                    color: 'var(--gold)',
                    letterSpacing: '6px',
                    marginBottom: '8px',
                    marginTop: '0px',
                    fontSize: '1.1rem',
                    borderBottom: '1px solid var(--gold-dim)',
                    paddingBottom: '5px',
                    textAlign: 'center'
                }}>KUANTUM KADERİ</h3>

                <div className="status-list" style={{ width: '100%', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.statuses.map((status, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: '#aaa', letterSpacing: '1px' }}>
                                <span>{status.label}</span>
                                <span style={{ color: 'var(--gold)' }}>%{status.value}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '1px', fontStyle: 'italic' }}>{status.text}</div>
                        </div>
                    ))}
                </div>

                <div className="particle-info" style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#888', letterSpacing: '2px', marginBottom: '1px' }}>REZONANS PARÇACIĞI</div>
                    <div style={{ fontSize: '1.2rem', color: data.particle.color, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{data.particle.name}</div>
                </div>

                <div style={{ marginTop: 'auto', marginBottom: '10px', width: '100%', height: '100%', maxHeight: '180px', display: 'flex', justifyContent: 'center' }}>
                    {/* ParticleMap'i bir kutu içine aldım ki taşmasın */}
                    <div style={{ transform: 'scale(0.9)' }}>
                        <ParticleMap
                            userPos={data.userPos}
                            closestParticle={data.particle}
                            seed={data.seed}
                            particles={data.allParticles}
                        />
                    </div>
                </div>
            </div>

            {/* BUTONLAR */}
            <div style={{
                display: 'flex',
                gap: '15px',
                marginTop: '15px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                zIndex: 101
            }}>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{
                        background: 'var(--gold)',
                        color: 'var(--navy)',
                        border: 'none',
                        padding: '12px 25px',
                        borderRadius: '2px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '0.85rem',
                        opacity: isDownloading ? 0.7 : 1,
                        cursor: isDownloading ? 'wait' : 'pointer'
                    }}>
                    {isDownloading ? 'HAZIRLANIYOR...' : 'KARTI KAYDET'}
                </button>

                <button onClick={handleResetClick} style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 25px',
                    borderRadius: '2px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                }}>
                    SIFIRLA
                </button>
            </div>
        </div>
    );
}