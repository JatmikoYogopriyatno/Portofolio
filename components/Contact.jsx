'use client';

import { useEffect, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * Contact: kartu kaca berisi tombol email, salin alamat email dengan
 * konfirmasi kecil, daftar layanan, dan seluruh tautan sosial.
 */
export default function Contact() {
  const { t } = useLanguage();
  const { contact, social, services, sections, ui } = portfolio;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      // Cadangan untuk browser atau konteks tanpa Clipboard API.
      const field = document.createElement('textarea');
      field.value = contact.email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
    }

    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow={t(sections.contact.eyebrow)}
          title={t(sections.contact.title)}
          subtitle={t(sections.contact.subtitle)}
          align="center"
        />

        <Reveal delay={80} className="mt-10">
          <GlassCard featured hover={false} className="p-6 text-center sm:p-10">
            <p className="mx-auto max-w-xl text-body-sm text-muted">{t(contact.note)}</p>

            {/* Baris email dan tombol salin */}
            <div className="mx-auto mt-7 flex max-w-md flex-col items-stretch gap-2 sm:flex-row">
              <span className="flex min-w-0 grow items-center gap-2 truncate rounded-full border border-line bg-surface px-4 py-3 text-sm text-muted">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-accent" />
                <span className="truncate">{contact.email}</span>
              </span>

              <button
                type="button"
                onClick={copyEmail}
                aria-label={t(ui.copyEmail)}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-4 py-3 text-sm font-semibold text-fg transition-colors hover:border-line-strong"
              >
                <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
                <span className="sm:hidden">{copied ? t(ui.copied) : t(ui.copyEmail)}</span>
              </button>
            </div>

            {/* Konfirmasi salin, juga dibacakan pembaca layar */}
            <p
              role="status"
              aria-live="polite"
              className={`mt-3 text-xs font-semibold text-emerald-600 transition-opacity duration-300 dark:text-emerald-400 ${
                copied ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {copied ? t(ui.copied) : ' '}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a href={`mailto:${contact.email}`} className="btn-primary">
                <Icon name="send" className="h-4 w-4" />
                {t(contact.ctaText)}
              </a>

              {contact.phone ? (
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="btn-ghost">
                  <Icon name="phone" className="h-4 w-4" />
                  {contact.phone}
                </a>
              ) : null}
            </div>

            {/* Semua tautan sosial, lengkap dengan nama akunnya */}
            {social.length > 0 ? (
              <ul className="mx-auto mt-8 grid max-w-lg gap-2 sm:grid-cols-2">
                {social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-2.5 text-left transition-colors hover:border-line-strong"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-accent-1 to-accent-2 text-white">
                        <Icon name={item.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-fg">{item.label}</span>
                        {item.handle ? (
                          <span className="block truncate text-xs text-subtle">{item.handle}</span>
                        ) : null}
                      </span>
                      <Icon name="arrow-up-right" className="ml-auto h-4 w-4 shrink-0 text-subtle" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Layanan yang ditawarkan */}
            {services.length > 0 ? (
              <div className="mt-8 border-t border-line pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
                  {t(ui.servicesTitle)}
                </h3>
                <ul className="mt-3 flex flex-wrap justify-center gap-2">
                  {services.map((service) => (
                    <li key={t(service)} className="chip">
                      {t(service)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
