import React from 'react';

const VriSALogo = ({ size = 'md', variant = 'full', color = 'default' }) => {
    // Tamaños
    const sizes = {
        sm: { width: 100, fontSize: '1.5rem', iconSize: 24 },
        md: { width: 140, fontSize: '2rem', iconSize: 32 },
        lg: { width: 180, fontSize: '2.5rem', iconSize: 40 },
        xl: { width: 220, fontSize: '3rem', iconSize: 48 }
    };

    // Colores
    const colors = {
        default: { primary: '#11998e', secondary: '#38ef7d', text: '#1a1a1a' },
        white: { primary: '#ffffff', secondary: '#f0f0f0', text: '#ffffff' },
        dark: { primary: '#0d6efd', secondary: '#0dcaf0', text: '#1a1a1a' }
    };

    const currentSize = sizes[size];
    const currentColors = colors[color];

    // Logo con icono
    const IconLogo = () => (
        <svg
            width={currentSize.iconSize}
            height={currentSize.iconSize}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Nube estilizada con gradiente */}
            <defs>
                <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={currentColors.primary} />
                    <stop offset="100%" stopColor={currentColors.secondary} />
                </linearGradient>
            </defs>
            
            {/* Forma de nube */}
            <path
                d="M38 20C38 14.477 33.523 10 28 10C26.376 10 24.846 10.44 23.517 11.21C21.842 7.68 18.234 5 14 5C8.477 5 4 9.477 4 15C4 15.685 4.071 16.355 4.207 17H4C1.791 17 0 18.791 0 21C0 23.209 1.791 25 4 25H38C41.866 25 45 21.866 45 18C45 14.134 41.866 11 38 11C38 11 38 20 38 20Z"
                fill="url(#cloudGradient)"
                opacity="0.2"
            />
            
            {/* Onda de aire/viento */}
            <path
                d="M10 30C10 30 15 28 20 30C25 32 30 30 35 32C40 34 45 32 45 32"
                stroke="url(#cloudGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M8 36C8 36 13 34 18 36C23 38 28 36 33 38C38 40 43 38 43 38"
                stroke="url(#cloudGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            
            {/* Círculo central (monitoreo) */}
            <circle
                cx="24"
                cy="18"
                r="6"
                fill={currentColors.primary}
            />
            <circle
                cx="24"
                cy="18"
                r="3"
                fill="white"
            />
        </svg>
    );

    // Texto VriSA con tipografía
    const LogoText = () => (
        <div 
            style={{
                fontFamily: '"Poppins", "Segoe UI", sans-serif',
                fontSize: currentSize.fontSize,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.secondary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                lineHeight: 1
            }}
        >
            VriSA
        </div>
    );

    // Variantes del logo
    if (variant === 'icon') {
        return <IconLogo />;
    }

    if (variant === 'text') {
        return <LogoText />;
    }

    // Variante completa (icono + texto)
    return (
        <div 
            className="d-flex align-items-center justify-content-center gap-2"
            style={{ width: currentSize.width, margin: '0 auto' }}
        >
            <IconLogo />
            <LogoText />
        </div>
    );
};

export default VriSALogo;
