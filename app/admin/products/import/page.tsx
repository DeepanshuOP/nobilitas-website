'use client';

/**
 * Product CSV Import page.
 *
 * Flow: drop/browse CSV → PapaParse → preview + validate →
 * confirm import → batched Supabase inserts → result summary.
 *
 * WHY client component: file reading, drag-and-drop, PapaParse,
 * and incremental progress state all require browser APIs.
 */

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import { createClient } from '@/lib/supabase/client';
import type { ProductStatus } from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUIRED_HEADERS = [
  'name',
  'sku',
  'category_slug',
  'brand',
  'description',
  'pack_sizes',
  'unit',
  'min_order_qty',
  'application',
  'tags',
  'status',
  'is_featured',
  'is_new_arrival',
  'image_url',
  'certifications',
  'notes',
] as const;

const OPTIONAL_HEADERS = [
  'image_2',
  'image_3',
  'image_4',
] as const;

const EXPECTED_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS] as const;

type CsvHeader = (typeof EXPECTED_HEADERS)[number];

/** Raw row as PapaParse produces it with header:true */
type CsvRow = Record<CsvHeader, string>;

const VALID_STATUSES: ProductStatus[] = ['available', 'on_request', 'out_of_stock'];
const BATCH_SIZE = 50;
const SAMPLE_CSV = EXPECTED_HEADERS.join(',') + '\n';

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg: '#0f0f0f',
  surface: '#161616',
  elevated: '#1c1c1c',
  border: 'rgba(245,241,234,0.08)',
  borderGold: 'rgba(201,169,110,0.28)',
  fg1: '#f5f1ea',
  fg2: '#c9c0a8',
  fg3: '#8a8a8a',
  gold: '#c9a96e',
  errorBg: 'rgba(161,53,42,0.10)',
  errorBorder: 'rgba(161,53,42,0.30)',
  errorText: '#e57373',
  successBg: 'rgba(74,124,89,0.10)',
  successBorder: 'rgba(74,124,89,0.30)',
  successText: '#6fbf80',
  sans: "'Inter', system-ui, sans-serif",
  serif: "'Playfair Display', Georgia, serif",
} as const;

// ─── Validation helpers ───────────────────────────────────────────────────────

interface ValidationSummary {
  missingName: number;
  invalidStatus: number;
  invalidImageUrl: number;
  total: number;
}

function validateRows(rows: CsvRow[]): ValidationSummary {
  let missingName = 0;
  let invalidStatus = 0;
  let invalidImageUrl = 0;

  for (const row of rows) {
    if (!row.name?.trim()) missingName++;
    const status = row.status?.trim();
    if (status && !VALID_STATUSES.includes(status as ProductStatus)) {
      invalidStatus++;
    }
    const imageUrl = row.image_url?.trim();
    if (imageUrl && !imageUrl.startsWith('http')) {
      invalidImageUrl++;
    }
  }

  return { missingName, invalidStatus, invalidImageUrl, total: rows.length };
}

// ─── Transform helpers ────────────────────────────────────────────────────────

/** Split a pipe-separated cell into a trimmed, non-empty string array. */
function splitPipe(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Coerce a string to a positive integer, defaulting to 1 on failure. */
function toPositiveInt(value: string | undefined): number {
  const n = parseInt(value ?? '', 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/** Map 'true'/'1'/'yes' → true, everything else → false. */
function toBool(value: string | undefined): boolean {
  return ['true', '1', 'yes'].includes((value ?? '').trim().toLowerCase());
}

// ─── Download sample CSV ──────────────────────────────────────────────────────

function downloadSampleCsv() {
  const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nobilitas_products_sample.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Shared input style ───────────────────────────────────────────────────────

function pill(
  color: string,
  bg: string,
  border: string
): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 9999,
    border: `1px solid ${border}`,
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: C.sans,
  };
}

/**
 * One entry per skipped CSV row — carries enough context for the admin
 * to understand and fix the source data without re-reading the whole file.
 */
interface SkippedRow {
  rowNumber: number; // 1-based, matches the CSV row visible in a spreadsheet
  name: string;
  category_slug: string;
  reason: string;
}

type Phase = 'idle' | 'preview' | 'importing' | 'done';

interface ImportResult {
  imported: number;
  skipped: number;
  errors: number;
  skippedRows: SkippedRow[];
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductImportPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [validation, setValidation] = useState<ValidationSummary | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Import progress
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);

  // ── File parsing ───────────────────────────────────────────────────────────

  const parseFile = useCallback((file: File) => {
    setParseError(null);

    // Read as text first so we can use the synchronous parse overload
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        setParseError('Could not read file contents.');
        return;
      }

      const result = Papa.parse<CsvRow>(text, {
        header: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        setParseError(
          `Parse error on row ${result.errors[0].row ?? '?'}: ${result.errors[0].message}`
        );
        return;
      }

      // Check headers
      const fields = result.meta.fields ?? [];
      const missing = REQUIRED_HEADERS.filter((h) => !fields.includes(h));
      if (missing.length > 0) {
        setParseError(`Missing columns: ${missing.join(', ')}`);
        return;
      }

      setRows(result.data);
      setValidation(validateRows(result.data));
      setPhase('preview');
    };

    reader.onerror = () => setParseError('Failed to read file.');
    reader.readAsText(file);
  }, []);

  // ── Drag and drop ──────────────────────────────────────────────────────────

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    // Reset so re-uploading same file fires onChange again
    e.target.value = '';
  }

  // ── Import ─────────────────────────────────────────────────────────────────

  async function handleImport() {
    setPhase('importing');
    setResult(null);

    // 1. Build slug → id map
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug');

    if (catError || !categories) {
      setParseError(`Failed to fetch categories: ${catError?.message}`);
      setPhase('preview');
      return;
    }

    const slugToId = new Map<string, string>(
      categories.map((c) => [c.slug as string, c.id as string])
    );

    // 2. Transform rows → payloads; collect structured skip reasons
    const skippedRows: SkippedRow[] = [];
    let errors = 0;
    let imported = 0;

    interface ProductRecord {
      name: string;
      slug: string;
      sku: string;
      category_id: string;
      subcategory_id: null;
      brand: string;
      description: string;
      pack_sizes: string[];
      unit: string;
      min_order_qty: number;
      application: string[];
      tags: string[];
      status: ProductStatus;
      is_featured: boolean;
      is_new_arrival: boolean;
      image_url: string | null;
      certifications: string;
      notes: string;
    }

    interface ImportItem {
      payload: ProductRecord;
      image_url: string;
      image_2: string;
      image_3: string;
      image_4: string;
    }

    const importItems: ImportItem[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;
      const name = row.name?.trim() ?? '';
      const category_slug = row.category_slug?.trim() ?? '';
      const rawStatus = row.status?.trim();
      const image_url = row.image_url?.trim() ?? '';
      const image_2 = row.image_2?.trim() ?? '';
      const image_3 = row.image_3?.trim() ?? '';
      const image_4 = row.image_4?.trim() ?? '';

      // ── Validate — first failing rule wins ─────────────────────────────────
      if (!name) {
        skippedRows.push({ rowNumber, name, category_slug, reason: 'Missing name' });
        continue;
      }

      const categoryId = slugToId.get(category_slug);
      if (!categoryId) {
        skippedRows.push({
          rowNumber,
          name,
          category_slug,
          reason: `Unknown category_slug: ${category_slug || '(empty)'}`,
        });
        continue;
      }

      if (rawStatus && !VALID_STATUSES.includes(rawStatus as ProductStatus)) {
        skippedRows.push({
          rowNumber,
          name,
          category_slug,
          reason: `Invalid status: ${rawStatus}`,
        });
        continue;
      }

      if (image_url && !image_url.startsWith('http')) {
        skippedRows.push({
          rowNumber,
          name,
          category_slug,
          reason: `Invalid image_url format: must start with 'http'`,
        });
        continue;
      }

      const status: ProductStatus =
        VALID_STATUSES.includes(rawStatus as ProductStatus)
          ? (rawStatus as ProductStatus)
          : 'available';

      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      importItems.push({
        payload: {
          name,
          slug,
          sku: row.sku?.trim() ?? '',
          category_id: categoryId,
          subcategory_id: null,
          brand: row.brand?.trim() ?? '',
          description: row.description?.trim() ?? '',
          pack_sizes: splitPipe(row.pack_sizes),
          unit: row.unit?.trim() ?? '',
          min_order_qty: toPositiveInt(row.min_order_qty),
          application: splitPipe(row.application),
          tags: splitPipe(row.tags),
          status,
          is_featured: toBool(row.is_featured),
          is_new_arrival: toBool(row.is_new_arrival),
          image_url: image_url || null,
          certifications: row.certifications?.trim() ?? '',
          notes: row.notes?.trim() ?? '',
        },
        image_url,
        image_2,
        image_3,
        image_4,
      });
    }

    // 3. Batch insert
    const totalBatches = Math.ceil(importItems.length / BATCH_SIZE);

    for (let i = 0; i < importItems.length; i += BATCH_SIZE) {
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      setProgressMsg(`Importing batch ${batchNum} of ${totalBatches}…`);

      const batchItems = importItems.slice(i, i + BATCH_SIZE);
      const batchPayloads = batchItems.map((item) => item.payload);

      const { data: insertedProducts, error } = await supabase
        .from('products')
        .insert(batchPayloads)
        .select('id, slug, name');

      if (error || !insertedProducts) {
        errors += batchItems.length;
      } else {
        imported += batchItems.length;

        const imagesToInsert: {
          product_id: string;
          url: string;
          alt_text: string;
          display_order: number;
          is_primary: boolean;
        }[] = [];

        for (const insertedProduct of insertedProducts) {
          const matchedItem = batchItems.find((item) => item.payload.slug === insertedProduct.slug);
          if (!matchedItem) continue;

          // 1. Primary image (image_url)
          if (matchedItem.image_url) {
            imagesToInsert.push({
              product_id: insertedProduct.id,
              url: matchedItem.image_url,
              alt_text: insertedProduct.name,
              display_order: 0,
              is_primary: true,
            });
          }

          // 2. image_2
          if (matchedItem.image_2) {
            imagesToInsert.push({
              product_id: insertedProduct.id,
              url: matchedItem.image_2,
              alt_text: insertedProduct.name,
              display_order: 1,
              is_primary: false,
            });
          }

          // 3. image_3
          if (matchedItem.image_3) {
            imagesToInsert.push({
              product_id: insertedProduct.id,
              url: matchedItem.image_3,
              alt_text: insertedProduct.name,
              display_order: 2,
              is_primary: false,
            });
          }

          // 4. image_4
          if (matchedItem.image_4) {
            imagesToInsert.push({
              product_id: insertedProduct.id,
              url: matchedItem.image_4,
              alt_text: insertedProduct.name,
              display_order: 3,
              is_primary: false,
            });
          }
        }

        if (imagesToInsert.length > 0) {
          const { error: imgError } = await supabase
            .from('product_images')
            .insert(imagesToInsert);
          
          if (imgError) {
            console.error('Failed to insert batch product images:', imgError);
          }
        }
      }
    }

    setResult({ imported, skipped: skippedRows.length, errors, skippedRows });
    setPhase('done');
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  function reset() {
    setPhase('idle');
    setRows([]);
    setValidation(null);
    setParseError(null);
    setProgressMsg('');
    setResult(null);
  }

  const hasValidationErrors =
    (validation?.missingName ?? 0) +
    (validation?.invalidStatus ?? 0) +
    (validation?.invalidImageUrl ?? 0) > 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        padding: '40px 24px',
        fontFamily: C.sans,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: C.serif,
              fontSize: 28,
              fontWeight: 700,
              color: C.fg1,
              margin: 0,
            }}
          >
            Import Products
          </h1>
          <p style={{ marginTop: 6, fontSize: 13, color: C.fg3 }}>
            Upload a CSV file to bulk-add products to the catalog.
          </p>
        </div>

        <button
          id="download-sample-btn"
          onClick={downloadSampleCsv}
          style={{
            background: 'transparent',
            border: `1px solid ${C.borderGold}`,
            borderRadius: 6,
            padding: '9px 18px',
            fontSize: 12,
            fontWeight: 600,
            color: C.gold,
            cursor: 'pointer',
            letterSpacing: '0.08em',
            fontFamily: C.sans,
          }}
        >
          ↓ Download Sample CSV
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* ── PHASE: idle — drop zone ── */}
        {(phase === 'idle' || phase === 'preview') && (
          <div
            id="csv-dropzone"
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            style={{
              border: `2px dashed ${isDragging ? C.gold : C.borderGold}`,
              borderRadius: 10,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging
                ? 'rgba(201,169,110,0.04)'
                : C.surface,
              transition: 'border-color 200ms, background 200ms',
              marginBottom: 28,
            }}
          >
            <p
              style={{
                fontSize: 32,
                marginBottom: 12,
                lineHeight: 1,
                color: C.fg3,
              }}
            >
              📂
            </p>
            <p
              style={{
                fontSize: 14,
                color: isDragging ? C.gold : C.fg2,
                margin: '0 0 6px',
                fontWeight: 500,
                transition: 'color 200ms',
              }}
            >
              Drop CSV file here or{' '}
              <span style={{ color: C.gold, textDecoration: 'underline' }}>
                click to browse
              </span>
            </p>
            <p style={{ fontSize: 11, color: C.fg3, margin: 0 }}>
              Expected columns: {EXPECTED_HEADERS.join(', ')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: 'none' }}
              onChange={onFileInputChange}
            />
          </div>
        )}

        {/* Parse error */}
        {parseError && (
          <div
            style={{
              marginBottom: 20,
              padding: '12px 16px',
              borderRadius: 8,
              border: `1px solid ${C.errorBorder}`,
              background: C.errorBg,
              color: C.errorText,
              fontSize: 13,
            }}
          >
            {parseError}
          </div>
        )}

        {/* ── PHASE: preview ── */}
        {phase === 'preview' && rows.length > 0 && (
          <>
            {/* Validation summary */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 20,
                alignItems: 'center',
              }}
            >
              <span style={pill(C.fg2, C.surface, C.border)}>
                {validation?.total ?? 0} rows parsed
              </span>
              {(validation?.missingName ?? 0) > 0 && (
                <span
                  style={pill(C.errorText, C.errorBg, C.errorBorder)}
                >
                  {validation?.missingName} missing name
                </span>
              )}
              {(validation?.invalidStatus ?? 0) > 0 && (
                <span
                  style={pill(C.errorText, C.errorBg, C.errorBorder)}
                >
                  {validation?.invalidStatus} invalid status
                </span>
              )}
              {(validation?.invalidImageUrl ?? 0) > 0 && (
                <span
                  style={pill(C.errorText, C.errorBg, C.errorBorder)}
                >
                  {validation?.invalidImageUrl} invalid image URL format
                </span>
              )}
              {!hasValidationErrors && (
                <span
                  style={pill(C.successText, C.successBg, C.successBorder)}
                >
                  ✓ All rows valid
                </span>
              )}
            </div>

            {/* Preview table — first 5 rows */}
            <div
              style={{
                overflowX: 'auto',
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  padding: '10px 16px',
                  margin: 0,
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  background: C.surface,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                Preview — first {Math.min(rows.length, 5)} of {rows.length} rows
              </p>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 12,
                  fontFamily: C.sans,
                }}
              >
                <thead>
                  <tr style={{ background: C.elevated }}>
                    {EXPECTED_HEADERS.map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 14px',
                          textAlign: 'left',
                          fontSize: 10,
                          fontWeight: 500,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: C.fg3,
                          whiteSpace: 'nowrap',
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: i % 2 === 0 ? C.bg : C.surface,
                      }}
                    >
                      {EXPECTED_HEADERS.map((h) => (
                        <td
                          key={h}
                          style={{
                            padding: '9px 14px',
                            color: C.fg2,
                            whiteSpace: 'nowrap',
                            maxWidth: 160,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={row[h]}
                        >
                          {row[h] || (
                            <span style={{ color: C.fg3, fontStyle: 'italic' }}>
                              —
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action row */}
            <div
              style={{ display: 'flex', gap: 12, alignItems: 'center' }}
            >
              <button
                id="import-btn"
                disabled={hasValidationErrors}
                onClick={handleImport}
                style={{
                  background: hasValidationErrors
                    ? 'rgba(201,169,110,0.25)'
                    : C.gold,
                  color: '#0f0f0f',
                  border: 'none',
                  borderRadius: 6,
                  padding: '11px 28px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: hasValidationErrors ? 'not-allowed' : 'pointer',
                  fontFamily: C.sans,
                  opacity: hasValidationErrors ? 0.55 : 1,
                }}
              >
                Import {rows.length} row{rows.length !== 1 ? 's' : ''}
              </button>

              <button
                onClick={reset}
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: '11px 20px',
                  fontSize: 13,
                  color: C.fg3,
                  cursor: 'pointer',
                  fontFamily: C.sans,
                }}
              >
                Clear
              </button>
            </div>
          </>
        )}

        {/* ── PHASE: importing ── */}
        {phase === 'importing' && (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              background: C.surface,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: `3px solid ${C.border}`,
                borderTopColor: C.gold,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <p
              style={{
                fontSize: 14,
                color: C.fg2,
                margin: 0,
                fontFamily: C.sans,
              }}
            >
              {progressMsg || 'Starting import…'}
            </p>
          </div>
        )}

        {/* ── PHASE: done ── */}
        {phase === 'done' && result && (
          <div
            style={{
              padding: '40px 32px',
              border: `1px solid ${C.successBorder}`,
              borderRadius: 10,
              background: C.successBg,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: C.serif,
                fontSize: 22,
                fontWeight: 700,
                color: C.fg1,
                margin: '0 0 12px',
              }}
            >
              Import Complete
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                flexWrap: 'wrap',
                marginBottom: 28,
              }}
            >
              <Stat
                label="Imported"
                value={result.imported}
                color={C.successText}
              />
              <Stat
                label="Skipped"
                value={result.skipped}
                color={C.gold}
              />
              <Stat
                label="Errors"
                value={result.errors}
                color={result.errors > 0 ? C.errorText : C.fg3}
              />
            </div>
            {/* Skipped rows detail table — only shown when rows were skipped */}
            {result.skippedRows.length > 0 && (
              <SkippedRowsTable rows={result.skippedRows} />
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link
                href="/admin/products"
                style={{
                  background: C.gold,
                  color: '#0f0f0f',
                  borderRadius: 6,
                  padding: '10px 24px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontFamily: C.sans,
                }}
              >
                View Products
              </Link>
              <button
                onClick={reset}
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: '10px 20px',
                  fontSize: 13,
                  color: C.fg3,
                  cursor: 'pointer',
                  fontFamily: C.sans,
                }}
              >
                Import Another
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spinner keyframes — injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── SkippedRowsTable sub-component ──────────────────────────────────────────

/**
 * Renders the structured list of skipped rows so the admin can see
 * exactly which rows failed and why, making the CSV fixable without
 * re-reading the entire file.
 */
function SkippedRowsTable({ rows }: { rows: SkippedRow[] }) {
  const headerStyle: React.CSSProperties = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: C.fg3,
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${C.border}`,
    background: C.elevated,
  };

  const cellStyle: React.CSSProperties = {
    padding: '9px 14px',
    fontSize: 12,
    color: C.fg2,
    borderBottom: `1px solid ${C.border}`,
    verticalAlign: 'top',
  };

  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: 8,
        border: `1px solid ${C.errorBorder}`,
        overflowX: 'auto',
        textAlign: 'left',
      }}
    >
      {/* Section label */}
      <p
        style={{
          margin: 0,
          padding: '10px 16px',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: C.errorText,
          background: C.errorBg,
          borderBottom: `1px solid ${C.errorBorder}`,
          fontFamily: C.sans,
        }}
      >
        {rows.length} row{rows.length !== 1 ? 's' : ''} skipped — fix these in your CSV and re-import
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: C.sans,
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Row #</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>category_slug</th>
            <th style={{ ...headerStyle, width: '45%' }}>Reason</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.rowNumber}
              style={{ background: 'rgba(161,53,42,0.04)' }}
            >
              <td style={{ ...cellStyle, color: C.fg3, fontFamily: 'monospace' }}>
                {r.rowNumber}
              </td>
              <td style={cellStyle}>{r.name || <em style={{ color: C.fg3 }}>—</em>}</td>
              <td style={{ ...cellStyle, fontFamily: 'monospace', color: C.gold }}>
                {r.category_slug || <em style={{ color: C.fg3 }}>—</em>}
              </td>
              <td style={{ ...cellStyle, color: C.errorText }}>{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Stat sub-component ───────────────────────────────────────────────────────

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p
        style={{
          fontSize: 36,
          fontWeight: 700,
          color,
          margin: '0 0 4px',
          fontFamily: "'Playfair Display', Georgia, serif",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 11,
          color: '#8a8a8a',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          margin: 0,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {label}
      </p>
    </div>
  );
}
