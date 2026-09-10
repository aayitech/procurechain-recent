'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSiteLocale, LANGUAGE_STORAGE_KEY, languageName, SiteLocale, translatePhrase } from '@/lib/i18n';

interface LanguageContextValue {
  locale: SiteLocale;
  languageName: string;
  setLocale: (locale: SiteLocale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({ locale: 'en', languageName: 'English', setLocale: () => undefined });
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const TRANSLATED_ATTRIBUTES = ['aria-label', 'placeholder', 'title'] as const;

function shouldSkip(element: Element | null) {
  return !element || Boolean(element.closest('script, style, code, pre, svg, canvas, [data-no-translate], [contenteditable="true"]'));
}

function translateTextNode(node: Text, locale: SiteLocale, languageSwitch: boolean) {
  if (shouldSkip(node.parentElement) || !node.nodeValue?.trim()) return;
  let source = originalText.get(node);
  if (source === undefined) {
    source = node.nodeValue;
    originalText.set(node, source);
  } else if (!languageSwitch) {
    const expected = translatePhrase(source, locale);
    if (node.nodeValue !== expected && node.nodeValue !== source) {
      source = node.nodeValue;
      originalText.set(node, source);
    }
  }
  const translated = translatePhrase(source, locale);
  if (node.nodeValue !== translated) node.nodeValue = translated;
}

function translateElementAttributes(element: Element, locale: SiteLocale, languageSwitch: boolean) {
  if (shouldSkip(element)) return;
  let stored = originalAttributes.get(element);
  if (!stored) {
    stored = new Map();
    originalAttributes.set(element, stored);
  }
  TRANSLATED_ATTRIBUTES.forEach((attribute) => {
    const current = element.getAttribute(attribute);
    if (!current) return;
    let source = stored?.get(attribute);
    if (source === undefined) {
      source = current;
      stored?.set(attribute, source);
    } else if (!languageSwitch && current !== translatePhrase(source, locale) && current !== source) {
      source = current;
      stored?.set(attribute, source);
    }
    const translated = translatePhrase(source, locale);
    if (current !== translated) element.setAttribute(attribute, translated);
  });
}

function translateTree(root: Node, locale: SiteLocale, languageSwitch = false) {
  if (root.nodeType === Node.TEXT_NODE) translateTextNode(root as Text, locale, languageSwitch);
  if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root as Element, locale, languageSwitch);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, locale, languageSwitch);
    else translateElementAttributes(node as Element, locale, languageSwitch);
    node = walker.nextNode();
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSiteLocale(stored)) setLocaleState(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    translateTree(document.body, locale, true);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') translateTextNode(mutation.target as Text, locale, false);
        mutation.addedNodes.forEach((node) => translateTree(node, locale));
        if (mutation.type === 'attributes') translateElementAttributes(mutation.target as Element, locale, false);
      });
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...TRANSLATED_ATTRIBUTES] });
    return () => observer.disconnect();
  }, [locale, ready]);

  const value = useMemo(() => ({ locale, languageName: languageName(locale), setLocale: setLocaleState }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
