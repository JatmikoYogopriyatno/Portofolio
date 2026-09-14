'use client';

import { useReveal } from '@/hooks/useReveal';

/**
 * Pembungkus tipis untuk animasi scroll-reveal fade-up.
 * Logikanya ada di hooks/useReveal.js (IntersectionObserver, tanpa library).
 *
 * `delay` dalam milidetik dipakai untuk efek berjenjang (stagger) pada grid.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const { ref, revealed } = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal ${revealed ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
