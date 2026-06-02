'use client';

/**
 * CategoriesClient — interactive CRUD table for admin categories.
 *
 * WHY client component: all mutations (insert/update/delete) need the
 * Supabase browser client, and the modal/toggle state must live in React.
 * The Server Component parent handles the initial fetch; this component
 * owns local state and re-fetches after each mutation.
 */

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoriesClientProps {
  initialCategories: Category[];
  fetchError: string | null;
}

interface FormState {
  name: string;
  slug: string;
  icon_name: string;
  display_order: string; // kept as string for controlled input, parsed on submit
  is_active: boolean;
}

type ModalMode = 'add' | 'edit';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a human-readable string to a URL-safe slug.
 * WHY: Supabase requires unique slugs; generating them deterministically
 * from the name prevents typos and keeps slugs consistent.
 */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  icon_name: '',
  display_order: '0',
  is_active: true,
};

// ─── Toast component ──────────────────────────────────────────────────────────

interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  text: string;
}

let toastCounter = 0;

function Toast({ messages }: { messages: ToastMessage[] }) {
  if (messages.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex items-center gap-3 rounded-md border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition-all ${
            m.type === 'success'
              ? 'border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.12)] text-[#c9a96e]'
              : 'border-[rgba(161,53,42,0.3)] bg-[rgba(161,53,42,0.12)] text-[#e57373]'
          }`}
        >
          <span>{m.type === 'success' ? '✓' : '✕'}</span>
          <span>{m.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

interface TableRowProps {
  cat: Category;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

function TableRow({ cat, onEdit, onDelete, onToggle }: TableRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(245,241,234,0.06)',
        backgroundColor: hovered ? 'rgba(245,241,234,0.02)' : 'transparent',
        transition: 'background-color 180ms',
      }}
    >
      {/* Name */}
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#f5f1ea', fontWeight: 500 }}>
        {cat.name}
      </td>

      {/* Slug */}
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#c9c0a8', fontFamily: 'monospace' }}>
        {cat.slug}
      </td>

      {/* Icon name */}
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#c9a96e', fontFamily: 'monospace' }}>
        {cat.icon_name}
      </td>

      {/* Display order */}
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#c9c0a8' }}>
        {cat.display_order}
      </td>

      {/* is_active toggle */}
      <td style={{ padding: '14px 16px' }}>
        <button
          id={`toggle-active-${cat.id}`}
          role="switch"
          aria-checked={cat.is_active}
          onClick={onToggle}
          style={{
            position: 'relative',
            display: 'inline-block',
            width: 36,
            height: 20,
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            background: cat.is_active ? '#c9a96e' : 'rgba(245,241,234,0.08)',
            transition: 'background 200ms',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: cat.is_active ? 18 : 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              transition: 'left 200ms',
            }}
          />
        </button>
      </td>

      {/* Actions */}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            id={`edit-category-${cat.id}`}
            onClick={onEdit}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 13,
              color: '#c9a96e',
              cursor: 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Edit
          </button>
          <button
            id={`delete-category-${cat.id}`}
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 13,
              color: '#a1352a',
              cursor: 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CategoriesClient({
  initialCategories,
  fetchError,
}: CategoriesClientProps) {
  const supabase = createClient();

  // Local state — refreshed after every mutation
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFetching, setIsFetching] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const pushToast = useCallback((type: ToastMessage['type'], text: string) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, text }]);
    // Auto-dismiss after 3.5 s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  /**
   * renumber — the single source of truth for display_order after any mutation.
   *
   * WHY: deleting row 4 of 6 leaves gaps (1,2,3,5,6); inserting always uses
   * max+1 so deleted slots are never reclaimed. Renumbering after every
   * write guarantees a compact 1…N sequence stored in the DB and shown in
   * the UI, regardless of what the user typed in the display_order field.
   *
   * Steps:
   *   1. Fetch current rows sorted by display_order ascending.
   *   2. For each row (index i), update display_order = i + 1.
   *   3. Set local state to the renumbered list.
   */
  const renumber = useCallback(async () => {
    setIsFetching(true);

    // 1. Fetch the live, ordered list from DB
    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .returns<Category[]>();

    if (fetchError || !data) {
      pushToast('error', `Re-fetch failed: ${fetchError?.message ?? 'unknown'}`);
      setIsFetching(false);
      return;
    }

    // 2. Write sequential order back; collect update promises for concurrency
    const updates = data.map((cat, i) =>
      supabase
        .from('categories')
        .update({ display_order: i + 1 })
        .eq('id', cat.id)
    );

    const results = await Promise.all(updates);
    const updateError = results.find((r) => r.error)?.error;
    if (updateError) {
      pushToast('error', `Renumber failed: ${updateError.message}`);
      setIsFetching(false);
      return;
    }

    // 3. Update local state with renumbered copy (avoids a third round-trip)
    setCategories(data.map((cat, i) => ({ ...cat, display_order: i + 1 })));
    setIsFetching(false);
  }, [supabase, pushToast]);

  // ── Modal helpers ──────────────────────────────────────────────────────────

  function openAddModal() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditingId(null);
    setModalMode('add');
    setModalOpen(true);
  }

  function openEditModal(cat: Category) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon_name: cat.icon_name,
      display_order: String(cat.display_order),
      is_active: cat.is_active,
    });
    setFormError(null);
    setEditingId(cat.id);
    setModalMode('edit');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setFormError(null);
  }

  // ── Form change handler ────────────────────────────────────────────────────

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      // Auto-generate slug only in add mode so edits don't clobber manual slugs
      ...(modalMode === 'add' ? { slug: slugify(value) } : {}),
    }));
  }

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    if (modalMode === 'add') {
      // WHY max+1: we don't use the form's display_order field value for add —
      // the user never sees a meaningful default and any number they type will
      // be overwritten by renumber() anyway. Appending at the end is safest.
      const maxOrder =
        categories.length > 0
          ? Math.max(...categories.map((c) => c.display_order))
          : 0;

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        icon_name: form.icon_name.trim(),
        display_order: maxOrder + 1,
        is_active: form.is_active,
      };

      const { error } = await supabase.from('categories').insert(payload);
      if (error) {
        setFormError(error.message);
        setIsSubmitting(false);
        return;
      }
      pushToast('success', `Category "${payload.name}" created.`);
    } else {
      if (!editingId) return;

      const displayOrder = parseInt(form.display_order, 10);
      if (isNaN(displayOrder) || displayOrder < 1) {
        setFormError('Display order must be a positive integer.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        icon_name: form.icon_name.trim(),
        // WHY: store the requested order first; renumber() will compact the
        // full list afterwards, so the relative position is what matters.
        display_order: displayOrder,
        is_active: form.is_active,
      };

      const { error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', editingId);
      if (error) {
        setFormError(error.message);
        setIsSubmitting(false);
        return;
      }
      pushToast('success', `Category "${payload.name}" updated.`);
    }

    setIsSubmitting(false);
    closeModal();
    // Renumber compacts the sequence, handles gaps, and refreshes local state
    await renumber();
  }

  // ── Toggle is_active inline ────────────────────────────────────────────────

  async function handleToggleActive(cat: Category) {
    // Optimistic UI — flip locally immediately
    setCategories((prev) =>
      prev.map((c) =>
        c.id === cat.id ? { ...c, is_active: !c.is_active } : c
      )
    );

    const { error } = await supabase
      .from('categories')
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id);

    if (error) {
      // Revert on failure
      setCategories((prev) =>
        prev.map((c) =>
          c.id === cat.id ? { ...c, is_active: cat.is_active } : c
        )
      );
      pushToast('error', `Toggle failed: ${error.message}`);
    } else {
      pushToast(
        'success',
        `"${cat.name}" ${!cat.is_active ? 'activated' : 'deactivated'}.`
      );
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', deleteTargetId);

    setIsDeleting(false);
    setDeleteTargetId(null);

    if (error) {
      pushToast('error', `Delete failed: ${error.message}`);
    } else {
      pushToast('success', 'Category deleted.');
      // renumber() fetches remaining rows and rewrites display_order 1…N,
      // closing any gap left by the deleted row.
      await renumber();
    }
  }

  // ── Close modal on Escape ──────────────────────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (modalOpen) closeModal();
        if (deleteTargetId) setDeleteTargetId(null);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen, deleteTargetId]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#f5f1ea' }}>
      {/* ── Page header ── */}
      <div
        style={{
          marginBottom: 32,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 30,
              fontWeight: 700,
              color: '#f5f1ea',
              margin: 0,
            }}
          >
            Categories
          </h1>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 14,
              color: '#8a8a8a',
              marginTop: 6,
              marginBottom: 0,
            }}
          >
            Manage catalog categories visible to B2B buyers.
          </p>
        </div>
        <button
          id="add-category-btn"
          onClick={openAddModal}
          style={{
            background: '#c9a96e',
            color: '#0f0f0f',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          + Add Category
        </button>
      </div>

      {/* ── Fetch error banner ── */}
      {fetchError && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid rgba(161,53,42,0.3)',
            background: 'rgba(161,53,42,0.1)',
            fontSize: 13,
            color: '#e57373',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Failed to load categories: {fetchError}
        </div>
      )}

      {/* ── Loading indicator ── */}
      {isFetching && (
        <div
          style={{
            marginBottom: 16,
            fontSize: 10,
            color: '#555',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Refreshing…
        </div>
      )}

      {/* ── Table ── */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: 8,
          border: '1px solid rgba(245,241,234,0.08)',
          marginTop: 24,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: 13,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <thead>
            <tr style={{ background: '#141414', borderBottom: '1px solid rgba(245,241,234,0.08)' }}>
              {['Name', 'Slug', 'Icon', 'Order', 'Active', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#8a8a8a',
                      borderBottom: '1px solid rgba(245,241,234,0.08)',
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && !fetchError ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '48px 20px',
                    textAlign: 'center',
                    fontSize: 13,
                    color: '#555',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  No categories yet. Add your first one.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <TableRow
                  key={cat.id}
                  cat={cat}
                  onEdit={() => openEditModal(cat)}
                  onDelete={() => setDeleteTargetId(cat.id)}
                  onToggle={() => handleToggleActive(cat)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={(e) => {
            // Close when clicking the backdrop, not the dialog itself
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-md rounded-lg border border-[rgba(245,241,234,0.08)] bg-[#1c1c1c] p-8 shadow-2xl">
            {/* Modal header */}
            <div className="mb-6 flex items-center justify-between">
              <h2
                className="text-xl font-bold text-[#f5f1ea]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {modalMode === 'add' ? 'Add Category' : 'Edit Category'}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#555] transition-colors hover:text-[#aaa] cursor-pointer text-lg leading-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[0.72rem] font-semibold uppercase tracking-widest text-[#888]">
                  Name <span className="text-[#c9a96e]">*</span>
                </label>
                <input
                  id="category-name-input"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Cleaning & Hygiene"
                  className="w-full rounded border border-[rgba(245,241,234,0.08)] bg-[#1c1c1c] px-4 py-2.5 text-sm text-[#f5f1ea] placeholder-[#8a8a8a] transition-colors focus:border-[#c9a96e] focus:outline-none"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-[0.72rem] font-semibold uppercase tracking-widest text-[#888]">
                  Slug <span className="text-[#c9a96e]">*</span>
                </label>
                <input
                  id="category-slug-input"
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => handleField('slug', e.target.value)}
                  placeholder="e.g. cleaning-hygiene"
                  className="w-full rounded border border-[rgba(245,241,234,0.08)] bg-[#1c1c1c] px-4 py-2.5 font-mono text-sm text-[#c9a96e] placeholder-[#8a8a8a] transition-colors focus:border-[#c9a96e] focus:outline-none"
                />
                <p className="text-[0.68rem] text-[#555]">
                  Auto-generated from name. Edit only if needed.
                </p>
              </div>

              {/* Icon name */}
              <div className="space-y-1">
                <label className="text-[0.72rem] font-semibold uppercase tracking-widest text-[#888]">
                  Icon Name <span className="text-[#c9a96e]">*</span>
                </label>
                <input
                  id="category-icon-input"
                  type="text"
                  required
                  value={form.icon_name}
                  onChange={(e) => handleField('icon_name', e.target.value)}
                  placeholder="e.g. sparkles"
                  className="w-full rounded border border-[rgba(245,241,234,0.08)] bg-[#1c1c1c] px-4 py-2.5 font-mono text-sm text-[#f5f1ea] placeholder-[#8a8a8a] transition-colors focus:border-[#c9a96e] focus:outline-none"
                />
                <p className="text-[0.68rem] text-[#555]">
                  Lucide icon identifier — see lucide.dev for names.
                </p>
              </div>

              {/* Display order */}
              <div className="space-y-1">
                <label className="text-[0.72rem] font-semibold uppercase tracking-widest text-[#888]">
                  Display Order <span className="text-[#c9a96e]">*</span>
                </label>
                <input
                  id="category-order-input"
                  type="number"
                  required
                  value={form.display_order}
                  onChange={(e) =>
                    handleField('display_order', e.target.value)
                  }
                  className="w-full rounded border border-[rgba(245,241,234,0.08)] bg-[#1c1c1c] px-4 py-2.5 text-sm text-[#f5f1ea] transition-colors focus:border-[#c9a96e] focus:outline-none"
                />
              </div>

              {/* is_active */}
              <div className="flex items-center gap-3">
                <input
                  id="category-active-checkbox"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => handleField('is_active', e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#c9a96e]"
                />
                <label
                  htmlFor="category-active-checkbox"
                  className="cursor-pointer text-sm text-[#aaa]"
                >
                  Active (visible to buyers)
                </label>
              </div>

              {/* Form-level error */}
              {formError && (
                <div className="rounded border border-[rgba(161,53,42,0.3)] bg-[rgba(161,53,42,0.1)] px-4 py-2.5 text-sm text-[#e57373]">
                  {formError}
                </div>
              )}

              {/* Submit / Cancel */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="category-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded bg-[#c9a96e] py-2.5 text-sm font-bold uppercase tracking-widest text-[#0f0f0f] transition-all hover:bg-[#b8935d] active:scale-[0.97] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Saving…'
                    : modalMode === 'add'
                      ? 'Create'
                      : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded border border-[rgba(245,241,234,0.08)] px-5 py-2.5 text-sm text-[#8a8a8a] transition-colors hover:border-[rgba(201,169,110,0.28)] hover:text-[#c9c0a8] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTargetId(null);
          }}
        >
          <div className="w-full max-w-sm rounded-lg border border-[rgba(161,53,42,0.3)] bg-[#1c1c1c] p-8 shadow-2xl">
            <h3
              className="mb-2 text-lg font-bold text-[#f5f1ea]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Delete Category?
            </h3>
            <p className="mb-6 text-sm text-[#666]">
              This action is permanent and cannot be undone. Any products linked
              to this category may be affected.
            </p>
            <div className="flex gap-3">
              <button
                id="confirm-delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded bg-[#a1352a] py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#c94a3a] active:scale-[0.97] disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="rounded border border-[rgba(245,241,234,0.08)] px-5 py-2.5 text-sm text-[#8a8a8a] transition-colors hover:border-[rgba(201,169,110,0.28)] hover:text-[#c9c0a8] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toasts ── */}
      <Toast messages={toasts} />
    </div>
  );
}
