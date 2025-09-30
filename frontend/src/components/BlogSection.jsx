// src/components/BlogSection.jsx
import React from "react";
import { mockPosts as posts } from "../data/blog.mock";
import { OPEN_BLOG_MODAL_EVENT } from "../pages/Landing";

export default function BlogSection() {
  return (
    <section
      id="blog"
      className="bg-slate-900 pt-[14px] md:pt-[19px] pb-8 md:pb-10 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Blog</h2>
        <p className="mt-1 text-slate-300">
          Artículos, noticias y recursos para aprender mejor.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="h-40 bg-slate-100">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/image.png";
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {p.tag}
                  </span>
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString()}
                  </time>
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{p.excerpt}</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(
                      new CustomEvent(OPEN_BLOG_MODAL_EVENT, {
                        detail: { post: p },
                      })
                    );
                  }}
                  className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 text-sm font-medium mt-3"
                >
                  Leer más
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
