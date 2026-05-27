'use client';

/**
 * SettingsClient — react-hook-form settings form for the Nobilitas admin.
 *
 * WHY client component: react-hook-form, per-field validation, and
 * Supabase upsert mutations all require browser APIs / React state.
 *
 * All six keys are upserted individually so partial failures surface
 * against a specific key rather than wiping an entire batch silently.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';

// ─── Design tokens (consistent with the rest of the admin UI) ─────────────────

const T = {
  bg: '#0f0f0f',
  surface: '#161616',
  elevated: '#1c1c1c',
  border: 'rgba(245,241,234,0.08)',
  borderGold: 'rgba(201,169,110,0.28)',
  borderError: 'rgba(161,53,42,0.45)',
  fg1: '#f5f1ea',
  fg2: '#c9c0a8',
  fg3: '#8a8a8a',
  gold: '#c9a96e',
  goldBg: 'rgba(201,169,110,0.10)',
  errorColor: '#e57373',
  errorBg: 'rgba(161,53,42,0.10)',
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
} as const;

// ─── Form schema ──────────────────────────────────────────────────────────────

/**
 * Typed form values matching the six setting keys managed on this page.
 * Using an explicit interface (no `any`) gives react-hook-form full inference.
 */
interface SettingsFormValues {
  contact_phone: string;
  contact_email: string;
  whatsapp_number: string;
  site_tagline: string;
  meta_description: string;
  inquiry_notification_email: string;
}

// ─── Field group config ───────────────────────────────────────────────────────

/**
 * Drives rendering of each group section.
 * `key` must match a key in SettingsFormValues and the DB `settings.key`.
 */
interface FieldDef {
  key: keyof SettingsFormValues;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

interface GroupDef {
  eyebrow: string;
  fields: FieldDef[];
}

const GROUPS: GroupDef[] = [
  {
    eyebrow: 'Contact',
    fields: [
      {
        key: 'contact_phone',
        label: 'Phone Number',
        placeholder: '+91 98765 43210',
      },
      {
        key: 'contact_email',
        label: 'Contact Email',
        placeholder: 'hello@nobilitasventures.com',
      },
      {
        key: 'whatsapp_number',
        label: 'WhatsApp Number',
        placeholder: '919876543210 (10–12 digits, no spaces)',
      },
    ],
  },
  {
    eyebrow: 'Site',
    fields: [
      {
        key: 'site_tagline',
        label: 'Site Tagline',
        placeholder: 'Premium B2B Supplies for Professional Businesses',
      },
      {
        key: 'meta_description',
        label: 'Meta Description',
        placeholder: 'A short description shown in Google search results (≤ 160 chars)',
        multiline: true,
      },
    ],
  },
  {
    eyebrow: 'Notifications',
    fields: [
      {
        key: 'inquiry_notification_email',
        label: 'Inquiry Notification Email',
        placeholder: 'notifications@nobilitasventures.com',
      },
    ],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SettingsClientProps {
  initialValues: Record<string, string>;
  fetchError: string | null;
}

// ─── Helper: shared input / textarea style ────────────────────────────────────

function inputStyle(hasError: boolean, isFocused: boolean): React.CSSProperties {
  return {
    width: '100%',
    background: T.surface,
    border: `1px solid ${hasError ? T.borderError : isFocused ? T.borderGold : T.border}`,
    borderRadius: 6,
    padding: '10px 14px',
    fontSize: 13,
    color: T.fg1,
    fontFamily: T.sans,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 160ms',
    resize: 'vertical',
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsClient({
  initialValues,
  fetchError,
}: SettingsClientProps) {
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track per-field focus for border highlight — object keyed by field name
  const [focused, setFocused] = useState<Partial<Record<keyof SettingsFormValues, boolean>>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      contact_phone: initialValues['contact_phone'] ?? '',
      contact_email: initialValues['contact_email'] ?? '',
      whatsapp_number: initialValues['whatsapp_number'] ?? '',
      site_tagline: initialValues['site_tagline'] ?? '',
      meta_description: initialValues['meta_description'] ?? '',
      inquiry_notification_email: initialValues['inquiry_notification_email'] ?? '',
    },
  });

  // ── Submit handler ────────────────────────────────────────────────────────

  async function onSubmit(values: SettingsFormValues) {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // Upsert each key individually — surfaces per-key errors clearly
    const entries = Object.entries(values) as [keyof SettingsFormValues, string][];

    for (const [key, value] of entries) {
      const { error } = await supabase
        .from('settings')
        // WHY onConflict:'key' — settings rows are keyed by the `key` column (unique).
        // Upsert avoids insert-vs-update branching and handles first-time row creation.
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) {
        setSaveError(`Failed to save "${key}": ${error.message}`);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    setSaveSuccess(true);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        padding: '32px 24px',
        fontFamily: T.sans,
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: T.serif,
            fontSize: 30,
            fontWeight: 700,
            color: T.fg1,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Settings
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: T.fg3 }}>
          Global configuration for the Nobilitas catalog site.
        </p>
      </div>

      {/* ── Fetch error banner ── */}
      {fetchError && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 8,
            border: `1px solid ${T.borderGold}`,
            background: 'rgba(201,169,110,0.06)',
            color: T.gold,
            fontSize: 13,
          }}
        >
          Could not load settings: {fetchError}
        </div>
      )}

      {/* ── Form (max-w-2xl, single column) ── */}
      <form
        id="settings-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{
          maxWidth: 672, // ≈ Tailwind max-w-2xl (42rem)
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        {/* ── Field groups ── */}
        {GROUPS.map((group) => (
          <section key={group.eyebrow} aria-labelledby={`settings-group-${group.eyebrow}`}>
            {/* Eyebrow label */}
            <p
              id={`settings-group-${group.eyebrow}`}
              style={{
                margin: '0 0 16px',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: T.gold,
                fontFamily: T.sans,
              }}
            >
              {group.eyebrow}
            </p>

            {/* Card */}
            <div
              style={{
                background: T.elevated,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: '24px 24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {group.fields.map(({ key, label, placeholder, multiline }) => {
                const hasError = Boolean(errors[key]);
                const isFocused = Boolean(focused[key]);

                // Build register options — whatsapp_number gets a regex rule
                const registerOptions =
                  key === 'whatsapp_number'
                    ? {
                        pattern: {
                          value: /^\d{10,12}$/,
                          message: 'Must be 10–12 digits, no spaces or dashes',
                        },
                      }
                    : {};

                return (
                  <div key={key}>
                    {/* Label */}
                    <label
                      htmlFor={`settings-field-${key}`}
                      style={{
                        display: 'block',
                        marginBottom: 7,
                        fontSize: 12,
                        fontWeight: 500,
                        color: hasError ? T.errorColor : T.fg2,
                        fontFamily: T.sans,
                        letterSpacing: '0.02em',
                        transition: 'color 160ms',
                      }}
                    >
                      {label}
                    </label>

                    {/* Input or textarea */}
                    {multiline ? (
                      <textarea
                        id={`settings-field-${key}`}
                        rows={3}
                        placeholder={placeholder}
                        style={inputStyle(hasError, isFocused)}
                        {...register(key, registerOptions)}
                        onFocus={() => setFocused((f) => ({ ...f, [key]: true }))}
                        onBlur={() => setFocused((f) => ({ ...f, [key]: false }))}
                      />
                    ) : (
                      <input
                        id={`settings-field-${key}`}
                        type="text"
                        placeholder={placeholder}
                        style={inputStyle(hasError, isFocused)}
                        {...register(key, registerOptions)}
                        onFocus={() => setFocused((f) => ({ ...f, [key]: true }))}
                        onBlur={() => setFocused((f) => ({ ...f, [key]: false }))}
                      />
                    )}

                    {/* Inline validation error */}
                    {hasError && (
                      <p
                        role="alert"
                        style={{
                          margin: '5px 0 0',
                          fontSize: 11,
                          color: T.errorColor,
                          fontFamily: T.sans,
                        }}
                      >
                        {errors[key]?.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* ── Save error ── */}
        {saveError && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: `1px solid ${T.borderError}`,
              background: T.errorBg,
              color: T.errorColor,
              fontSize: 13,
              fontFamily: T.sans,
            }}
          >
            {saveError}
          </div>
        )}

        {/* ── Success message ── */}
        {saveSuccess && !saveError && (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              border: `1px solid ${T.borderGold}`,
              background: T.goldBg,
              color: T.gold,
              fontSize: 13,
              fontFamily: T.sans,
            }}
          >
            Settings saved.
          </div>
        )}

        {/* ── Submit button ── */}
        <div>
          <button
            id="settings-save-btn"
            type="submit"
            disabled={isSaving}
            style={{
              background: isSaving ? 'rgba(201,169,110,0.4)' : T.gold,
              color: '#0f0f0f',
              border: 'none',
              borderRadius: 6,
              padding: '11px 28px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontFamily: T.sans,
              transition: 'background 200ms, opacity 200ms',
            }}
          >
            {isSaving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
