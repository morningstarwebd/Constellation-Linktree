'use client';

import { useEffect, useRef } from 'react';
import { ConstellationData } from '@/types';

interface Props {
    constellation: ConstellationData | null;
    onClose: () => void;
}

export default function LinkModal({ constellation, onClose }: Props) {
    const modalRef = useRef<HTMLDivElement>(null);
    const firstFocusRef = useRef<HTMLButtonElement>(null);

    // Focus trap & Escape key
    useEffect(() => {
        if (!constellation) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            // Focus trap
            if (e.key === 'Tab' && modalRef.current) {
                const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                    'button, a, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Auto-focus the close button
        setTimeout(() => firstFocusRef.current?.focus(), 100);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [constellation, onClose]);

    if (!constellation) return null;

    const linksToShow = constellation.modalLinks ?? constellation.links;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                zIndex: 50,
                background: 'rgba(0, 5, 20, 0.70)',
                backdropFilter: 'blur(6px)',
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={constellation.label}
        >
            <div
                ref={modalRef}
                style={{
                    background: 'rgba(5, 10, 40, 0.95)',
                    border: '1px solid rgba(100, 160, 255, 0.40)',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '380px',
                    width: '90%',
                    boxShadow: '0 0 60px rgba(80, 140, 255, 0.25)',
                    animation: 'modalIn 0.3s ease forwards',
                }}
            >
                {/* Close button */}
                <button
                    ref={firstFocusRef}
                    onClick={onClose}
                    aria-label="Close modal"
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(150, 180, 255, 0.7)',
                        fontSize: '24px',
                        cursor: 'pointer',
                        lineHeight: 1,
                        transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(150, 180, 255, 0.7)';
                    }}
                >
                    ×
                </button>

                {/* Title */}
                <h2
                    style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '18px',
                        color: 'rgba(200, 225, 255, 0.95)',
                        textShadow: '0 0 12px rgba(100, 160, 255, 0.6)',
                        letterSpacing: '0.12em',
                        textAlign: 'center',
                        marginBottom: '24px',
                    }}
                >
                    {constellation.label}
                </h2>

                {/* Link list */}
                <div className="flex flex-col gap-3">
                    {linksToShow.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 no-underline"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: 'rgba(20, 40, 100, 0.5)',
                                border: '1px solid rgba(100, 160, 255, 0.3)',
                                color: 'rgba(190, 215, 255, 0.9)',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none',
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget;
                                el.style.background = 'rgba(40, 80, 180, 0.6)';
                                el.style.borderColor = 'rgba(150, 200, 255, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget;
                                el.style.background = 'rgba(20, 40, 100, 0.5)';
                                el.style.borderColor = 'rgba(100, 160, 255, 0.3)';
                            }}
                        >
                            {/* Small icon */}
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="rgba(150, 200, 255, 0.8)"
                            >
                                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                            </svg>
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
