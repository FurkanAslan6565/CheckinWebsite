import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pt', 'en', 'es', 'tr'],
  defaultLocale: 'pt',
  localePrefix: 'always' // Force prefix on URLs for strict SEO and multilingual paths
});

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
