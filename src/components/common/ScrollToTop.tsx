import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Checks if the given location corresponds to the Contact Us section or route.
 */
export const isContactUsLocation = (loc: { pathname: string; hash?: string }): boolean => {
  const hash = (loc.hash || '').toLowerCase();
  const path = (loc.pathname || '').toLowerCase();

  return (
    hash === '#contact-us' ||
    hash === '#contact' ||
    path === '/contact-us' ||
    path === '/contact'
  );
};

/**
 * Checks if the route is a customer-facing route (not an admin dashboard route).
 */
export const isUserFacingRoute = (pathname: string): boolean => {
  return !pathname.toLowerCase().startsWith('/admin');
};

/**
 * Instantly resets the viewport scroll position to top (0, 0),
 * temporarily overriding any CSS smooth scrolling to guarantee an immediate jump.
 */
export const resetScrollToTop = () => {
  if (typeof window === 'undefined') return;

  const html = document.documentElement;
  const originalScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';

  window.scrollTo(0, 0);
  if (html) html.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;

  // Re-affirm scroll top at 40ms to ensure newly mounted route components settle strictly at 0
  setTimeout(() => {
    window.scrollTo(0, 0);
    if (html) html.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    html.style.scrollBehavior = originalScrollBehavior;
  }, 40);
};

/**
 * ScrollToTop Component
 *
 * Automatically scrolls to top (0, 0) whenever a user navigates from one page
 * to another across all user-facing routes.
 *
 * EXCEPTION: Contact Us page / section
 * Navigating to or within Contact Us preserves its existing scroll position and behavior.
 * Navigating away from Contact Us to another page properly resets scroll to top.
 *
 * Supports navigation via:
 * - Navbar links (<Link>, <NavLink>)
 * - Buttons and cards (programmatic navigate())
 * - Browser back and forward buttons
 * - Nested and dynamic parameter routes
 * - Ensures Food Experience scroll animation works without interruption
 */
export const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const prevLocationRef = useRef<{
    pathname: string;
    hash: string;
    search: string;
    key: string;
  } | null>(null);

  // Set manual history scroll restoration so browser popstate doesn't override route-aware logic
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch (err) {
        console.warn('[ScrollToTop] Could not set history.scrollRestoration to manual', err);
      }
    }
  }, []);

  useEffect(() => {
    const prev = prevLocationRef.current;
    const current = {
      pathname: location.pathname,
      hash: location.hash,
      search: location.search,
      key: location.key,
    };
    prevLocationRef.current = current;

    // Only apply to user-facing pages
    if (!isUserFacingRoute(location.pathname)) {
      return;
    }

    // EXCEPTION: Contact Us page or section
    // If destination is Contact Us, do not reset scroll to top — preserve its existing behavior
    if (isContactUsLocation(location)) {
      return;
    }

    // Determine if this is a navigation between pages or away from Contact Us
    const isInitialLoad = prev === null;
    const isDifferentPage = prev !== null && prev.pathname !== location.pathname;
    const isNavigatingAwayFromContact = prev !== null && isContactUsLocation(prev);
    const isNavbarLinkReclick =
      prev !== null &&
      prev.pathname === location.pathname &&
      prev.search === location.search &&
      prev.key !== location.key;

    if (isInitialLoad || isDifferentPage || isNavigatingAwayFromContact || isNavbarLinkReclick) {
      resetScrollToTop();
    }
  }, [location.pathname, location.search, location.hash, location.key]);

  return null;
};

export default ScrollToTop;
