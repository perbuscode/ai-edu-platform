// src/components/BlogPostModal.jsx
import React from "react";
import Modal from "./Modal";

export default function BlogPostModal({ open, onClose, post }) {
  if (!post) return <Modal open={open} onClose={onClose} title="Artículo" />;

  const { title, date, tag, image, content, excerpt } = post;
  const body = content || excerpt || "Contenido no disponible por ahora.";

  return (
    <Modal open={open} onClose={onClose} title={title || "Artículo"}>
      <article className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {tag && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
              {tag}
            </span>
          )}
          {date && <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>}
        </div>

        {image && (
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <img
              src={image}
              alt={title}
              className="w-full h-56 object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        )}

        <div>
          <p className="whitespace-pre-line text-slate-700 leading-relaxed">{body}</p>
        </div>
      </article>
    </Modal>
  );
}

