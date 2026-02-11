import { useState } from 'react';

export default function InputForm({ onConfirm }) {
    const [name, setName] = useState('');
    const [sentence, setSentence] = useState('');
    const [exiting, setExiting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && sentence) {
            setExiting(true);
            setTimeout(() => onConfirm(name, sentence), 500);
        }
    };

    return (
        <div className={`input-container ${exiting ? 'fade-out' : 'fade-in'}`} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '2rem',
            boxSizing: 'border-box',
            minHeight: '100vh',
            overflow: 'hidden'
        }}>
            {/* Glass Card */}
            <div className="glass-card" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '3rem 2.5rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 215, 0, 0.1)',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.1)',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                {/* Subtle inner shine */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }} />

                <h1 style={{
                    color: 'var(--gold)',
                    marginBottom: '2.5rem',
                    letterSpacing: '6px',
                    fontSize: '2rem',
                    textShadow: '0 0 15px rgba(255,215,0,0.4)',
                    position: 'relative'
                }}>
                    QUANTUM<br />KİMLİĞİ
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', width: '100%' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Adınız"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: 'none',
                                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '5px 5px 0 0',
                                color: 'white',
                                padding: '15px 15px',
                                fontSize: '1.2rem',
                                outline: 'none',
                                letterSpacing: '0px',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Aklınıza ilk gelen kelime"
                            value={sentence}
                            onChange={(e) => setSentence(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: 'none',
                                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '5px 5px 0 0',
                                color: 'white',
                                padding: '15px 15px',
                                fontSize: '1.2rem',
                                outline: 'none',
                                letterSpacing: '0px',
                                transition: 'all 0.3s ease',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button type="submit" style={{
                        marginTop: '1.5rem',
                        background: 'transparent',
                        color: 'var(--gold)',
                        border: '1px solid var(--gold)',
                        padding: '16px 40px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        position: 'relative',
                        overflow: 'hidden',
                        alignSelf: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.1)'
                    }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'var(--gold)';
                            e.target.style.color = 'var(--navy)';
                            e.target.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--gold)';
                            e.target.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.1)';
                        }}
                    >
                        Başlat
                    </button>
                </form>
            </div>
        </div>
    );
}