# Graph Report - Nobilitas  (2026-05-27)

## Corpus Check
- 63 files · ~33,097 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 398 nodes · 523 edges · 27 communities (18 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae962e6a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `Category` - 21 edges
2. `createClient()` - 17 edges
3. `compilerOptions` - 16 edges
4. `ProductImage` - 11 edges
5. `createClient()` - 10 edges
6. `Subcategory` - 6 edges
7. `scripts` - 5 edges
8. `ProductStatus` - 5 edges
9. `ProductWithCategory` - 5 edges
10. `2. Database Schema (Supabase / PostgreSQL)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `CategoriesClientProps` --references--> `Category`  [EXTRACTED]
  app/admin/categories/CategoriesClient.tsx → lib/types.ts
- `ProductRowProps` --references--> `ProductWithCategory`  [EXTRACTED]
  app/admin/products/ProductsListClient.tsx → lib/types.ts
- `ProductsListClientProps` --references--> `ProductWithCategory`  [EXTRACTED]
  app/admin/products/ProductsListClient.tsx → lib/types.ts
- `ProductsListClientProps` --references--> `Category`  [EXTRACTED]
  app/admin/products/ProductsListClient.tsx → lib/types.ts

## Communities (27 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (20): dependencies, clsx, fuse.js, @hookform/resolvers, lucide-react, next, nodemailer, papaparse (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (14): metadata, CATEGORIES, FEATURED_PRODUCTS, metadata, RawFeaturedProduct, SLIDES, delays, PRODUCTS (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (20): AdminSidebar(), AdminLayoutProps, DetailPanelProps, formatDate(), InquiriesClientProps, InquiryRow(), InquiryRowProps, STATUS_CFG (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (13): CategoriesClientProps, EMPTY_FORM, FormState, ModalMode, ToastMessage, Category, ProductWithCategory, ProductsPageProps (+5 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/nodemailer, @types/papaparse (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (13): C, CsvHeader, CsvRow, EXPECTED_HEADERS, ImportResult, OPTIONAL_HEADERS, Phase, pill() (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (14): geistMono, geistSans, inter, jetbrainsMono, metadata, playfair, CATALOG_LINKS, COMPANY_LINKS (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (6): CATEGORIES, FEATURED, HomeClientProps, ICON_MAP, RevealProps, T

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (11): C, ExtendedProductImage, FieldProps, inputStyle, joinCsv(), ProductForm(), ProductFormProps, ProductFormValues (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (8): 1. Project Summary, 2. Database Schema (Supabase / PostgreSQL), 3. Universal Development Rules & Guidelines, PRODUCT REQUIREMENTS & AGENT INSTRUCTIONS — NOBILITAS VENTURES, Table: `categories`, Table: `inquiries`, Table: `products`, Table: `subcategories`

### Community 16 - "Community 16"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 21 - "Community 21"
Cohesion: 0.07
Nodes (26): CatalogProduct, CatalogPageProps, metadata, EditProductClientProps, EditProductPageProps, FeaturedProduct, CreateInquiryInput, CreateProductInput (+18 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (10): DetailProduct, ProductDetailClientProps, RelatedProduct, T, ProductStatus, generateMetadata(), PageParams, ProductDetailPage() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.06
Nodes (19): ALL_PRODUCTS, CatalogClientProps, CatalogIcon, EMPTY_FILTERS, FilterState, sortFns, SortKey, STATIC_CATEGORIES (+11 more)

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (6): CATEGORIES, ICON_PATHS, Product, PRODUCTS, Tone, TONE_CLASS

## Knowledge Gaps
- **185 isolated node(s):** `eslintConfig`, `config`, `nextConfig`, `name`, `version` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Category` connect `Community 4` to `Community 2`, `Community 10`, `Community 14`, `Community 21`, `Community 24`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 3` to `Community 4`, `Community 6`, `Community 14`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `config`, `nextConfig` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.057057057057057055 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06456456456456457 - nodes in this community are weakly interconnected._