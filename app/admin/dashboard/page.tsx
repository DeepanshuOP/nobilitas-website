import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Inquiry } from '@/lib/types';

/**
 * Server-Side Dashboard Home Component.
 * Fetches metrics in parallel and displays them alongside recent inquiries.
 */
export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch metrics and recent inquiries in parallel
  const [
    productsCountRes,
    categoriesCountRes,
    newInquiriesCountRes,
    totalInquiriesCountRes,
    recentInquiriesRes,
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    // WHY is_active filter: the sublabel reads "active categories"; without
    // this filter the count includes soft-disabled categories and misleads the admin.
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const totalProducts = productsCountRes.count ?? 0;
  const totalCategories = categoriesCountRes.count ?? 0;
  const newInquiries = newInquiriesCountRes.count ?? 0;
  const totalInquiries = totalInquiriesCountRes.count ?? 0;
  const recentInquiries = (recentInquiriesRes.data || []) as Inquiry[];

  // Define stat cards array for rendering
  const statCards = [
    {
      label: 'TOTAL PRODUCTS',
      count: totalProducts,
      sublabel: 'products in catalog',
    },
    {
      // Label updated to ACTIVE CATEGORIES to match the is_active filter on the query
      label: 'ACTIVE CATEGORIES',
      count: totalCategories,
      sublabel: 'active categories',
    },
    {
      label: 'NEW INQUIRIES',
      count: newInquiries,
      sublabel: 'awaiting response',
    },
    {
      label: 'TOTAL INQUIRIES',
      count: totalInquiries,
      sublabel: 'total received',
    },
  ];

  return (
    <div className="font-sans text-[#f5f1ea]">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-[1.5rem] font-semibold text-[#f5f1ea] tracking-wide">
          Dashboard
        </h1>
        <p className="text-[0.85rem] text-[#8a8a8a] mt-1 font-medium">
          Welcome back. Here's what's happening.
        </p>
      </header>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#161616] border border-[rgba(245,241,234,0.08)] rounded-lg p-6 shadow-sm hover:border-[rgba(201,169,110,0.28)] transition-colors"
          >
            <h3 className="text-[0.7rem] text-[#8a8a8a] tracking-[0.12em] font-medium uppercase mb-2">
              {card.label}
            </h3>
            <p className="text-[#c9a96e] text-[2rem] font-bold tracking-tight">
              {card.count}
            </p>
            <span className="text-[0.75rem] text-[#8a8a8a] block mt-1 font-medium">
              {card.sublabel}
            </span>
          </div>
        ))}
      </section>

      {/* Recent Inquiries Section */}
      <section className="mb-10">
        <h2 className="text-[1rem] font-semibold text-[#f5f1ea] mb-4 tracking-wide">
          Recent Inquiries
        </h2>

        <div className="bg-[#161616] rounded-lg border border-[rgba(245,241,234,0.08)] overflow-hidden shadow-sm">
          {recentInquiries.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#161616] border-b border-[rgba(245,241,234,0.08)]">
                    <th className="text-[0.7rem] text-[#8a8a8a] tracking-[0.1em] font-bold uppercase p-3 lg:p-4">
                      Name
                    </th>
                    <th className="text-[0.7rem] text-[#8a8a8a] tracking-[0.1em] font-bold uppercase p-3 lg:p-4">
                      Company
                    </th>
                    <th className="text-[0.7rem] text-[#8a8a8a] tracking-[0.1em] font-bold uppercase p-3 lg:p-4">
                      Phone
                    </th>
                    <th className="text-[0.7rem] text-[#8a8a8a] tracking-[0.1em] font-bold uppercase p-3 lg:p-4">
                      Status
                    </th>
                    <th className="text-[0.7rem] text-[#8a8a8a] tracking-[0.1em] font-bold uppercase p-3 lg:p-4">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(245,241,234,0.08)]">
                  {recentInquiries.map((inquiry) => {
                    // Dynamic badge rendering configuration based on status
                    let badgeStyles = 'bg-[rgba(245,241,234,0.06)] text-[#8a8a8a]';
                    if (inquiry.status === 'new') {
                      badgeStyles = 'bg-[rgba(201,169,110,0.15)] text-[#c9a96e]';
                    } else if (inquiry.status === 'responded') {
                      badgeStyles = 'bg-[rgba(74,222,128,0.1)] text-[#4ade80]';
                    }

                    const dateString = new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={inquiry.id}
                        className="hover:bg-[rgba(245,241,234,0.02)] transition-colors text-[0.82rem] text-[#c9c0a8]"
                      >
                        <td className="p-3 lg:p-4 font-medium">{inquiry.name}</td>
                        <td className="p-3 lg:p-4">{inquiry.company || '—'}</td>
                        <td className="p-3 lg:p-4 tracking-wider">{inquiry.phone}</td>
                        <td className="p-3 lg:p-4">
                          <span className={`inline-block px-2.5 py-1 rounded text-[0.7rem] font-bold tracking-wide uppercase ${badgeStyles}`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="p-3 lg:p-4 text-[#8a8a8a]">{dateString}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[0.9rem] text-[#8a8a8a] font-medium">No inquiries yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions Block */}
      <section>
        <h2 className="text-[1rem] font-semibold text-[#f5f1ea] mb-4 tracking-wide">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-block bg-[#161616] border border-[rgba(245,241,234,0.08)] text-[#c9a96e] px-6 py-3 rounded text-[0.8rem] font-medium transition-all hover:border-[#c9a96e] hover:bg-[rgba(201,169,110,0.02)] active:scale-[0.98]"
          >
            Add Product
          </Link>
          <Link
            href="/admin/categories"
            className="inline-block bg-[#161616] border border-[rgba(245,241,234,0.08)] text-[#c9a96e] px-6 py-3 rounded text-[0.8rem] font-medium transition-all hover:border-[#c9a96e] hover:bg-[rgba(201,169,110,0.02)] active:scale-[0.98]"
          >
            Add Category
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-block bg-[#161616] border border-[rgba(245,241,234,0.08)] text-[#c9a96e] px-6 py-3 rounded text-[0.8rem] font-medium transition-all hover:border-[#c9a96e] hover:bg-[rgba(201,169,110,0.02)] active:scale-[0.98]"
          >
            View Inquiries
          </Link>
        </div>
      </section>
    </div>
  );
}
