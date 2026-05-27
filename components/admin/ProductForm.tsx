'use client';

/**
 * ProductForm — shared add / edit form for the admin product pages.
 *
 * WHY a single reusable component: both /admin/products/new and
 * /admin/products/[id]/edit need identical fields and validation logic;
 * abstracting here means a schema change only touches one file.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import slugify from 'slugify';
import { createClient } from '@/lib/supabase/client';
import type { Category, Product, ProductImage, Subcategory } from '@/lib/types';

// ─── Zod schema ───────────────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  sku: z.string().optional(),
  category_id: z.string().uuid('Select a valid category'),
  subcategory_id: z.string().uuid().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
  // Comma-separated inputs — split to string[] on submit
  pack_sizes: z.string().optional(),
  unit: z.string().optional(),
  min_order_qty: z.coerce.number().int().min(1).optional(),
  application: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['available', 'on_request', 'out_of_stock']),
  is_featured: z.boolean(),
  is_new_arrival: z.boolean(),
  certifications: z.string().optional(),
  notes: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductFormProps {
  initialData?: Partial<Product>;
  productId?: string;
  categories: Category[];
  subcategories: Subcategory[];
  onSuccess: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Splits a comma-separated string into a trimmed, non-empty string array. */
function splitCsv(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Joins a string[] to a comma-separated string for pre-filling the form. */
function joinCsv(arr: string[] | undefined): string {
  return arr?.join(', ') ?? '';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Design tokens (inline so the component is self-contained)
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
  errorText: '#a1352a',
  sans: "'Inter', system-ui, sans-serif",
  serif: "'Playfair Display', Georgia, serif",
} as const;

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: C.fg3,
          fontFamily: C.sans,
        }}
      >
        {label}
        {required && (
          <span style={{ color: C.gold, marginLeft: 3 }}>*</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <span style={{ fontSize: 11, color: C.fg3, fontFamily: C.sans }}>
          {hint}
        </span>
      )}
      {error && (
        <span
          style={{ fontSize: 11, color: C.errorText, fontFamily: C.sans }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  padding: '9px 12px',
  fontSize: 13,
  color: C.fg1,
  fontFamily: C.sans,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 180ms',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  color: C.fg2,
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 88,
  resize: 'vertical',
};

/** Eyebrow section divider */
function Section({ title }: { title: string }) {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        borderTop: `1px solid ${C.border}`,
        paddingTop: 20,
        marginTop: 4,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.gold,
          fontFamily: C.sans,
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
  );
}
// ─── Main component ───────────────────────────────────────────────────────────

interface ExtendedProductImage extends ProductImage {
  file?: File;
}

export default function ProductForm({
  initialData,
  productId,
  categories,
  subcategories,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(initialData?.id);

  // Track whether the user has manually edited the slug so auto-gen stops
  const slugTouched = useRef(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Image upload state ─────────────────────────────────────────────────────
  const [images, setImages] = useState<ExtendedProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      sku: initialData?.sku ?? '',
      category_id: initialData?.category_id ?? '',
      subcategory_id: initialData?.subcategory_id ?? undefined,
      brand: initialData?.brand ?? '',
      description: initialData?.description ?? '',
      pack_sizes: joinCsv(initialData?.pack_sizes),
      unit: initialData?.unit ?? '',
      min_order_qty: initialData?.min_order_qty,
      application: joinCsv(initialData?.application),
      tags: joinCsv(initialData?.tags),
      status: initialData?.status ?? 'available',
      is_featured: initialData?.is_featured ?? false,
      is_new_arrival: initialData?.is_new_arrival ?? false,
      certifications: initialData?.certifications ?? '',
      notes: initialData?.notes ?? '',
    },
  });

  const watchedName = watch('name');
  const watchedCategoryId = watch('category_id');

  // Load existing product images when editing
  useEffect(() => {
    if (productId) {
      const fetchImages = async () => {
        const { data, error } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', productId)
          .order('display_order', { ascending: true });
        if (!error && data) {
          setImages(data as ProductImage[]);
        }
      };
      fetchImages();
    }
  }, [productId, supabase]);

  // Auto-generate slug from name (only when not manually edited & in add mode)
  useEffect(() => {
    if (!isEditing && !slugTouched.current && watchedName) {
      setValue(
        'slug',
        slugify(watchedName, { lower: true, strict: true }),
        { shouldValidate: false }
      );
    }
  }, [watchedName, isEditing, setValue]);

  // Reset subcategory_id when category changes
  useEffect(() => {
    setValue('subcategory_id', undefined);
  }, [watchedCategoryId, setValue]);

  // Subcategories filtered to the selected category
  const filteredSubcategories = subcategories.filter(
    (sc) => sc.category_id === watchedCategoryId
  );

  // ── Sync primary image URL to products table ────────────────────────────────
  const syncProductPrimaryImage = async (targetProductId: string, currentImages: ExtendedProductImage[]) => {
    const primaryImg = currentImages.find((img) => img.is_primary);
    const primaryUrl = primaryImg ? primaryImg.url : null;
    await supabase
      .from('products')
      .update({ image_url: primaryUrl })
      .eq('id', targetProductId);
  };

  // ── Upload file helper ──────────────────────────────────────────────────────
  const uploadFile = async (file: File, prodId: string) => {
    const path = `products/${prodId}/${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      throw new Error(`Upload failed: ${uploadErr.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);

    return urlData.publicUrl;
  };

  // ── File selection handler ──────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds the 2 MB limit.`);
        continue;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setUploadError(`File ${file.name} is not a supported format (JPEG, PNG, WebP).`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (productId) {
      // Edit mode: upload immediately
      setIsUploading(true);
      const updatedImages = [...images];
      try {
        for (let i = 0; i < validFiles.length; i++) {
          setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}...`);
          const file = validFiles[i];
          const url = await uploadFile(file, productId);

          const maxOrder = updatedImages.reduce((max, img) => Math.max(max, img.display_order), -1);
          const displayOrder = maxOrder + 1;

          const hasPrimary = updatedImages.some((img) => img.is_primary);
          const isPrimary = !hasPrimary && i === 0;

          const { data: insertedData, error: insertErr } = await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              url,
              alt_text: null,
              display_order: displayOrder,
              is_primary: isPrimary,
            })
            .select()
            .single();

          if (insertErr) throw insertErr;
          if (insertedData) {
            updatedImages.push(insertedData as ProductImage);
          }
        }
        setImages(updatedImages);
        await syncProductPrimaryImage(productId, updatedImages);
      } catch (err: any) {
        setUploadError(err.message || 'An error occurred during file upload.');
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
    } else {
      // Create mode: queue files locally
      const updatedImages = [...images];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const localUrl = URL.createObjectURL(file);
        const maxOrder = updatedImages.reduce((max, img) => Math.max(max, img.display_order), -1);

        const hasPrimary = updatedImages.some((img) => img.is_primary);
        const isPrimary = !hasPrimary && i === 0;

        updatedImages.push({
          id: `temp-${Date.now()}-${Math.random()}`,
          product_id: '',
          url: localUrl,
          alt_text: null,
          display_order: maxOrder + 1,
          is_primary: isPrimary,
          created_at: new Date().toISOString(),
          file,
        });
      }
      setImages(updatedImages);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // ── Set primary image handler ───────────────────────────────────────────────
  const handleSetPrimary = async (imgId: string) => {
    if (productId) {
      setIsUploading(true);
      try {
        const { error: resetErr } = await supabase
          .from('product_images')
          .update({ is_primary: false })
          .eq('product_id', productId);
        if (resetErr) throw resetErr;

        const { error: setErr } = await supabase
          .from('product_images')
          .update({ is_primary: true })
          .eq('id', imgId);
        if (setErr) throw setErr;

        const updatedImages = images.map((img) => ({
          ...img,
          is_primary: img.id === imgId,
        }));
        setImages(updatedImages);
        await syncProductPrimaryImage(productId, updatedImages);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to update primary image.');
      } finally {
        setIsUploading(false);
      }
    } else {
      const updatedImages = images.map((img) => ({
        ...img,
        is_primary: img.id === imgId,
      }));
      setImages(updatedImages);
    }
  };

  // ── Delete image handler ────────────────────────────────────────────────────
  const handleDeleteImage = async (targetImg: ExtendedProductImage) => {
    if (productId) {
      setIsUploading(true);
      try {
        const { error: deleteErr } = await supabase
          .from('product_images')
          .delete()
          .eq('id', targetImg.id);
        if (deleteErr) throw deleteErr;

        let updatedImages = images.filter((img) => img.id !== targetImg.id);

        if (targetImg.is_primary && updatedImages.length > 0) {
          const firstImgId = updatedImages[0].id;
          const { error: setErr } = await supabase
            .from('product_images')
            .update({ is_primary: true })
            .eq('id', firstImgId);
          if (setErr) throw setErr;

          updatedImages = updatedImages.map((img, index) => ({
            ...img,
            is_primary: index === 0,
          }));
        }

        setImages(updatedImages);
        await syncProductPrimaryImage(productId, updatedImages);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to delete image.');
      } finally {
        setIsUploading(false);
      }
    } else {
      if (targetImg.url.startsWith('blob:')) {
        URL.revokeObjectURL(targetImg.url);
      }
      let updatedImages = images.filter((img) => img.id !== targetImg.id);

      if (targetImg.is_primary && updatedImages.length > 0) {
        updatedImages = updatedImages.map((img, index) => ({
          ...img,
          is_primary: index === 0,
        }));
      }
      setImages(updatedImages);
    }
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setSubmitError(null);
    setUploadError(null);
    setIsSubmitting(true);

    const primaryImg = images.find((img) => img.is_primary);
    const resolvedImageUrl = primaryImg && !primaryImg.file ? primaryImg.url : null;

    const payload = {
      name: values.name,
      slug: values.slug,
      sku: values.sku ?? '',
      category_id: values.category_id,
      subcategory_id: values.subcategory_id ?? null,
      brand: values.brand ?? '',
      description: values.description ?? '',
      pack_sizes: splitCsv(values.pack_sizes),
      unit: values.unit ?? '',
      min_order_qty: values.min_order_qty ?? 1,
      application: splitCsv(values.application),
      tags: splitCsv(values.tags),
      status: values.status,
      is_featured: values.is_featured,
      is_new_arrival: values.is_new_arrival,
      certifications: values.certifications ?? '',
      notes: values.notes ?? '',
      image_url: resolvedImageUrl,
    };

    if (isEditing && initialData?.id) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', initialData.id);

      if (error) {
        setSubmitError(error.message);
        setIsSubmitting(false);
        return;
      }
    } else {
      // 1. Insert product first to get the id
      const { data: newProduct, error: insertErr } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();

      if (insertErr || !newProduct) {
        setSubmitError(insertErr?.message || 'Failed to create product.');
        setIsSubmitting(false);
        return;
      }

      const newProductId = newProduct.id;

      // 2. Upload any queued images using the new product id
      const uploadedImages: ProductImage[] = [];
      try {
        const queuedImages = images.filter((img) => img.file);
        for (let i = 0; i < queuedImages.length; i++) {
          const queuedImg = queuedImages[i];
          setUploadProgress(`Uploading ${i + 1} of ${queuedImages.length}...`);
          
          const url = await uploadFile(queuedImg.file!, newProductId);

          const { data: insertedData, error: imgInsertErr } = await supabase
            .from('product_images')
            .insert({
              product_id: newProductId,
              url,
              alt_text: null,
              display_order: queuedImg.display_order,
              is_primary: queuedImg.is_primary,
            })
            .select()
            .single();

          if (imgInsertErr) throw imgInsertErr;
          if (insertedData) {
            uploadedImages.push(insertedData as ProductImage);
          }
        }

        // 3. Keep image_url on products table in sync
        const primaryUploaded = uploadedImages.find((img) => img.is_primary);
        const primaryUrl = primaryUploaded ? primaryUploaded.url : null;
        if (primaryUrl) {
          await supabase
            .from('products')
            .update({ image_url: primaryUrl })
            .eq('id', newProductId);
        }
      } catch (err: any) {
        setSubmitError(`Product created, but image upload failed: ${err.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    onSuccess();
  };

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = C.borderGold;
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = C.border;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        padding: '32px 24px',
        fontFamily: C.sans,
      }}
    >
      {/* Page heading */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: C.serif,
            fontSize: 28,
            fontWeight: 700,
            color: C.fg1,
            margin: 0,
          }}
        >
          {isEditing ? 'Edit Product' : 'Add Product'}
        </h1>
        <p style={{ marginTop: 4, fontSize: 13, color: C.fg3 }}>
          {isEditing
            ? 'Update the product details below.'
            : 'Fill in the details to add a new product to the catalog.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px 28px',
            maxWidth: 960,
          }}
        >
          {/* ── SECTION: Basic Info ── */}
          <Section title="Basic Info" />

          {/* Name */}
          <Field
            label="Product Name"
            required
            error={errors.name?.message}
          >
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Hand Sanitizer Pro"
              style={{
                ...inputStyle,
                borderColor: errors.name ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Slug */}
          <Field
            label="Slug"
            required
            hint="Auto-generated from name. Edit only if needed."
            error={errors.slug?.message}
          >
            <input
              {...register('slug', {
                onChange: () => {
                  // Once the user types in the slug field, stop auto-generating
                  slugTouched.current = true;
                },
              })}
              type="text"
              placeholder="e.g. hand-sanitizer-pro"
              style={{
                ...inputStyle,
                fontFamily: 'monospace',
                color: C.gold,
                borderColor: errors.slug ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* SKU */}
          <Field label="SKU" error={errors.sku?.message}>
            <input
              {...register('sku')}
              type="text"
              placeholder="e.g. HS-PRO-500"
              style={{
                ...inputStyle,
                borderColor: errors.sku ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Brand */}
          <Field label="Brand" error={errors.brand?.message}>
            <input
              {...register('brand')}
              type="text"
              placeholder="e.g. Diversey"
              style={{
                ...inputStyle,
                borderColor: errors.brand ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Image upload — full width, above Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: C.fg3,
                  fontFamily: C.sans,
                }}
              >
                Product Images
              </span>

              {/* Grid of thumbnails */}
              {images.length > 0 && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                  {images.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        border: img.is_primary ? `2px solid ${C.gold}` : `1px solid ${C.border}`,
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        background: C.elevated,
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.alt_text || 'Product image'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {/* Star button */}
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        disabled={isSubmitting || isUploading}
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: 2,
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          color: img.is_primary ? C.gold : '#fff',
                          cursor: (isSubmitting || isUploading) ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          padding: 0,
                        }}
                        title="Set as primary"
                      >
                        {img.is_primary ? '★' : '☆'}
                      </button>
                      {/* X button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img)}
                        disabled={isSubmitting || isUploading}
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          color: '#ff6b6b',
                          cursor: (isSubmitting || isUploading) ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          padding: 0,
                        }}
                        title="Delete image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File picker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <input
                  ref={imageInputRef}
                  id="product-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={isSubmitting || isUploading}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <button
                  id="product-image-pick-btn"
                  type="button"
                  disabled={isSubmitting || isUploading}
                  onClick={() => imageInputRef.current?.click()}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.borderGold}`,
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.gold,
                    cursor: (isSubmitting || isUploading) ? 'not-allowed' : 'pointer',
                    fontFamily: C.sans,
                    letterSpacing: '0.08em',
                    opacity: (isSubmitting || isUploading) ? 0.6 : 1,
                  }}
                >
                  Add Image
                </button>
                <span style={{ fontSize: 11, color: C.fg3, fontFamily: C.sans }}>
                  JPEG / PNG / WebP, max 2 MB each (multiple allowed)
                </span>
              </div>

              {/* Upload progress */}
              {(isUploading || uploadProgress) && (
                <span style={{ fontSize: 12, color: C.gold, fontFamily: C.sans }}>
                  {uploadProgress || 'Uploading…'}
                </span>
              )}

              {/* Upload error */}
              {uploadError && (
                <span style={{ fontSize: 11, color: C.errorText, fontFamily: C.sans }}>
                  {uploadError}
                </span>
              )}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                placeholder="Short product description for buyers…"
                style={{
                  ...textareaStyle,
                  borderColor: errors.description ? C.errorText : C.border,
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
          </div>

          {/* ── SECTION: Classification ── */}
          <Section title="Classification" />

          {/* Category */}
          <Field
            label="Category"
            required
            error={errors.category_id?.message}
          >
            <select
              {...register('category_id')}
              style={{
                ...selectStyle,
                borderColor: errors.category_id ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>

          {/* Subcategory — filtered by selected category */}
          <Field
            label="Subcategory"
            hint={
              !watchedCategoryId
                ? 'Select a category first'
                : filteredSubcategories.length === 0
                  ? 'No subcategories for this category'
                  : undefined
            }
            error={errors.subcategory_id?.message}
          >
            <select
              {...register('subcategory_id')}
              disabled={filteredSubcategories.length === 0}
              style={{
                ...selectStyle,
                borderColor: errors.subcategory_id ? C.errorText : C.border,
                opacity:
                  filteredSubcategories.length === 0 ? 0.45 : 1,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <option value="">None</option>
              {filteredSubcategories.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </Field>

          {/* Status */}
          <Field
            label="Status"
            required
            error={errors.status?.message}
          >
            <select
              {...register('status')}
              style={{
                ...selectStyle,
                borderColor: errors.status ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <option value="available">Available</option>
              <option value="on_request">On Request</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </Field>

          {/* ── SECTION: Details ── */}
          <Section title="Details" />

          {/* Pack sizes */}
          <Field
            label="Pack Sizes"
            hint="Comma-separated — e.g. 500ml, 1L, 5L"
            error={errors.pack_sizes?.message}
          >
            <input
              {...register('pack_sizes')}
              type="text"
              placeholder="500ml, 1L, 5L"
              style={{
                ...inputStyle,
                borderColor: errors.pack_sizes ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Unit */}
          <Field label="Unit" error={errors.unit?.message}>
            <input
              {...register('unit')}
              type="text"
              placeholder="e.g. Bottle, Box, Can"
              style={{
                ...inputStyle,
                borderColor: errors.unit ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Min order qty */}
          <Field
            label="Min Order Qty"
            error={errors.min_order_qty?.message}
          >
            <input
              {...register('min_order_qty')}
              type="number"
              min={1}
              placeholder="e.g. 50"
              style={{
                ...inputStyle,
                borderColor: errors.min_order_qty ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Certifications */}
          <Field
            label="Certifications"
            error={errors.certifications?.message}
          >
            <input
              {...register('certifications')}
              type="text"
              placeholder="e.g. ISO 9001, GMP"
              style={{
                ...inputStyle,
                borderColor: errors.certifications ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Application sectors */}
          <Field
            label="Application Sectors"
            hint="Comma-separated — e.g. Hotels, Hospitals, F&B"
            error={errors.application?.message}
          >
            <input
              {...register('application')}
              type="text"
              placeholder="Hotels, Hospitals, F&B"
              style={{
                ...inputStyle,
                borderColor: errors.application ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Tags */}
          <Field
            label="Tags"
            hint="Comma-separated — e.g. antibacterial, eco-friendly"
            error={errors.tags?.message}
          >
            <input
              {...register('tags')}
              type="text"
              placeholder="antibacterial, eco-friendly"
              style={{
                ...inputStyle,
                borderColor: errors.tags ? C.errorText : C.border,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Notes (internal) — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Field
              label="Internal Notes"
              hint="Visible only to admins."
              error={errors.notes?.message}
            >
              <textarea
                {...register('notes')}
                placeholder="Internal notes, sourcing info, supplier details…"
                style={{
                  ...textareaStyle,
                  borderColor: errors.notes ? C.errorText : C.border,
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Field>
          </div>

          {/* ── SECTION: Flags ── */}
          <Section title="Flags" />

          {/* is_featured */}
          <Controller
            name="is_featured"
            control={control}
            render={({ field }) => (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  style={{ accentColor: C.gold, width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: C.fg2, fontFamily: C.sans }}>
                  Featured{' '}
                  <span style={{ fontSize: 11, color: C.fg3 }}>
                    (shown on homepage)
                  </span>
                </span>
              </label>
            )}
          />

          {/* is_new_arrival */}
          <Controller
            name="is_new_arrival"
            control={control}
            render={({ field }) => (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  style={{ accentColor: C.gold, width: 16, height: 16 }}
                />
                <span style={{ fontSize: 13, color: C.fg2, fontFamily: C.sans }}>
                  New Arrival{' '}
                  <span style={{ fontSize: 11, color: C.fg3 }}>
                    (shows "New" badge)
                  </span>
                </span>
              </label>
            )}
          />

          {/* ── Submit row ── */}
          <div
            style={{
              gridColumn: '1 / -1',
              borderTop: `1px solid ${C.border}`,
              paddingTop: 24,
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Submission-level error */}
            {submitError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 6,
                  border: '1px solid rgba(161,53,42,0.35)',
                  background: 'rgba(161,53,42,0.08)',
                  color: '#e57373',
                  fontSize: 13,
                  fontFamily: C.sans,
                }}
              >
                {submitError}
              </div>
            )}

            <button
              id="product-submit-btn"
              type="submit"
              // WHY: disable during both upload (Storage) and submit (DB write)
              // to prevent double-submit or submitting before the URL is resolved.
              disabled={isSubmitting || isUploading}
              style={{
                background: C.gold,
                color: '#0f0f0f',
                border: 'none',
                borderRadius: 6,
                padding: '12px 0',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || isUploading ? 0.6 : 1,
                width: '100%',
                fontFamily: C.sans,
                transition: 'opacity 180ms',
              }}
            >
              {isUploading
                ? 'Uploading…'
                : isSubmitting
                  ? 'Saving…'
                  : isEditing
                    ? 'Save Changes'
                    : 'Create Product'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                fontSize: 13,
                color: C.fg3,
                cursor: 'pointer',
                fontFamily: C.sans,
                textAlign: 'center',
              }}
            >
              ← Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
