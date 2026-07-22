import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting) {
          e.target.classList.add('in');
        }
      });
    }, { threshold: 0.2 });

    revealEls.forEach(el => io.observe(el));

    return () => {
      revealEls.forEach(el => io.unobserve(el));
    };
  }, []);
}