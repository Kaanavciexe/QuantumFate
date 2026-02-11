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
            const marginFactor = 0.85; // Kart genişliği ekranın %85'i olsun

            // --- 2. HAYALET KAPSAYICI (TÜM SORUNLARI ÇÖZEN KISIM) ---
            // Genişlik ve yükseklik 0 olduğu için sayfa düzenini ASLA etkilemez.
            // "overflow: hidden" sayesinde içindeki dev resim ekranı büyütmez/kaydırmaz.
            const ghostContainer = document.createElement('div');
            Object.assign(ghostContainer.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '0px',   // KRİTİK: 0 piksel
                height: '0px',  // KRİTİK: 0 piksel
                overflow: 'hidden', // İçindekiler dışarı taşıp ekranı bozmasın
                zIndex: '-9999',
                visibility: 'hidden' // Kullanıcı görmesin
            });
            document.body.appendChild(ghostContainer);

            // --- 3. SANAL STÜDYO (RESMİN ÇEKİLECEĞİ ALAN) ---
            const studio = document.createElement('div');
            Object.assign(studio.style, {
                width: `${targetWidth}px`,
                height: `${targetHeight}px`,
                // visibility: visible yapıyoruz ki üstteki container gizli olsa bile
                // dom-to-image bu alanı render edebilsin.
                visibility: 'visible',
                background: 'linear-gradient(180deg, #050510 0%, #1a1a40 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute', // Container içinde sabitlensin
                top: '0',
                left: '0'
            });
            ghostContainer.appendChild(studio);

            // --- 4. KARTI KOPYALA VE HAZIRLA ---
            const originalElement = cardRef.current;
            const clonedCard = originalElement.cloneNode(true);
            const originalWidth = originalElement.offsetWidth;

            // Ölçekleme Hesabı
            const scale = (targetWidth * marginFactor) / originalWidth;

            // Klon Stilleri
            clonedCard.style.transform = `scale(${scale})`;
            clonedCard.style.transformOrigin = 'center center';
            clonedCard.style.margin = '0';
            // Gölge ekleyerek derinlik katalım
            clonedCard.style.boxShadow = '0 0 80px rgba(0, 0, 0, 0.6)';

            // --- 5. CANVASLARI MANUEL AKTAR (BOŞ ÇIKMAMASI İÇİN) ---
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

            // Not: ghostContainer'ı değil, içindeki studio'yu çekiyoruz.
            const dataUrl = await domtoimage.toPng(studio, config);

            // --- 7. TEMİZLİK VE İNDİRME ---
            document.body.removeChild(ghostContainer);

            const link = document.createElement('a');
            link.download = `Kuantum_Kaderim_${data.seed}.png`;
            link.href = dataUrl;
            link.click();

        } catch (err) {
            console.error("Hata:", err);
            // alert("Hata oluştu"); // Kullanıcıyı rahatsız etmemek için kapattım
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            width: '100%',
            padding: '20px 0',
            minHeight: 'auto'
        }}>
            {/* KART (EKRANDA GÖRÜNEN) */}
            <div
                ref={cardRef}
                className="quantum-card"
                style={{
                    width: '320px',
                    maxWidth: '90vw',
                    minHeight: '568px',
                    background: 'linear-gradient(135deg, rgba(10, 10, 42, 0.95) 0%, rgba(26, 26, 64, 0.95) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    borderRadius: '2px',
                    padding: '25px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
                    position: 'relative',
                    overflow: 'visible',
                    backdropFilter: 'blur(5px)'
                }}
            >
                {/* ... KART İÇERİĞİ AYNEN KALSIN ... */}
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
                    marginBottom: '10px',
                    marginTop: '5px',
                    fontSize: '1.2rem',
                    borderBottom: '1px solid var(--gold-dim)',
                    paddingBottom: '8px',
                    textAlign: 'center'
                }}>KUANTUM KADERİ</h3>

                <div className="status-list" style={{ width: '100%', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.statuses.map((status, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem', color: '#aaa', letterSpacing: '1px' }}>
                                <span>{status.label}</span>
                                <span style={{ color: 'var(--gold)' }}>%{status.value}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px', fontStyle: 'italic' }}>{status.text}</div>
                        </div>
                    ))}
                </div>

                <div className="particle-info" style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '2px', marginBottom: '2px' }}>REZONANS PARÇACIĞI</div>
                    <div style={{ fontSize: '1.4rem', color: data.particle.color, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{data.particle.name}</div>
                </div>

                <div style={{ marginTop: 'auto', marginBottom: '15px' }}>
                    <ParticleMap
                        userPos={data.userPos}
                        closestParticle={data.particle}
                        seed={data.seed}
                        particles={data.allParticles}
                    />
                </div>
            </div>

            {/* BUTONLAR - Mobilde sabit kalmaması için position sticky/fixed kullanmıyoruz */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginTop: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{
                        background: 'var(--gold)',
                        color: 'var(--navy)',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '2px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '0.9rem',
                        opacity: isDownloading ? 0.7 : 1,
                        cursor: isDownloading ? 'wait' : 'pointer'
                    }}>
                    {isDownloading ? 'HAZIRLANIYOR...' : 'KARTI KAYDET'}
                </button>

                <button onClick={handleResetClick} style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 30px',
                    borderRadius: '2px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                }}>
                    SIFIRLA
                </button>
            </div>
        </div>
    );
}