/* eslint-disable react-refresh/only-export-components --
   shared constants/helpers deliberately live beside their component */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Icon from "../common/Icon";

/**
 * Routes that render edge-to-edge without the app shell.
 * Everything before the skill assessment is pre-dashboard, so the sidebar
 * and top bar only appear once the user is actually inside the app.
 */
const BARE_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/landing",
  "/counselling",
  "/tech-consultation",
];

export const isBareRoute = (pathname) =>
  BARE_ROUTES.includes(pathname.toLowerCase());

export default function Layout({ children }) {
  const location = useLocation();

  // The drawer remembers which route it was opened on, so any navigation
  // closes it automatically — no effect needed.
  const [openedAt, setOpenedAt] = useState(null);
  const navOpen = openedAt === location.pathname;
  const setNavOpen = (open) => setOpenedAt(open ? location.pathname : null);

  const bare = isBareRoute(location.pathname);

  // lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const page = (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );

  if (bare) {
    return <div className="min-h-screen bg-canvas text-ink">{page}</div>;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* NAV DRAWER — opened from the hamburger at every screen size */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
            onClick={() => setNavOpen(false)}
          />
          <div className="relative w-72 max-w-[82vw] h-full bg-canvas shadow-2xl sm-rise">
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
              className="absolute top-5 right-4 z-10 grid place-items-center w-9 h-9 rounded-xl
                bg-surface border border-line text-ink-soft"
            >
              <Icon name="close" size={18} />
            </button>
            <Sidebar onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      {/* MAIN COLUMN */}
      <div>
        <Topbar onOpenNav={() => setNavOpen(true)} />
        <main className="px-4 sm:px-7 py-6 sm:py-8 max-w-[1320px] mx-auto">
          {page}
        </main>
      </div>
    </div>
  );
}
