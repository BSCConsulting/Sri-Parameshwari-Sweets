import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  Database,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  PRODUCT_CATEGORIES,
  WEIGHTS,
  deleteProduct,
  fetchAllProductRows,
  productToRow,
  rowToProduct,
  seedCatalogFromCode,
  slugifyId,
  uploadProductImage,
  upsertProduct,
  type ProductRow,
} from '../lib/catalog';
import type { Product } from '../types';
import { formatPrice } from '../utils';

const emptyDraft = (): Product & { active: boolean; sort_order: number } => ({
  id: '',
  name: '',
  teluguName: '',
  category: 'ghee-specials',
  description: '',
  image: '',
  prices: { '250g': 0, '500g': 0, '1kg': 0 },
  tags: [],
  active: true,
  sort_order: 0,
});

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 text-ink-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return <SetupNeeded />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <Dashboard email={session.user.email ?? ''} />;
}

function SetupNeeded() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
      <div className="max-w-lg bg-white border border-cream-300 rounded-2xl p-8 shadow-lg space-y-4">
        <h1 className="font-display text-2xl font-bold text-maroon-700">Admin setup required</h1>
        <p className="text-sm text-ink-500 leading-relaxed">
          The shop works without a backend, but editing prices and photos needs a free Supabase project.
          Follow <code className="text-maroon-700">ADMIN.md</code> in the repo (about 10 minutes), then
          add <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> to Vercel env vars and redeploy.
        </p>
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-maroon-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </a>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError(err.message);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white border border-cream-300 rounded-2xl p-8 shadow-lg space-y-4"
      >
        <div className="text-center mb-2">
          <img src="/emblem.jpg" alt="" className="w-14 h-14 rounded-full mx-auto mb-3 ring-2 ring-gold-400/50" />
          <h1 className="font-display text-xl font-bold text-maroon-700">Admin login</h1>
          <p className="text-xs text-ink-500 mt-1">Sri Parameswari Sweets · catalog & prices</p>
        </div>

        <label className="block text-xs font-semibold text-ink-700">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400"
          />
        </label>

        <label className="block text-xs font-semibold text-ink-700">
          Password
          <div className="relative mt-1.5">
            <input
              type={show ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 pr-10 border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-300 p-1"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>

        {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 bg-maroon-600 text-cream-100 rounded-full font-semibold text-sm hover:bg-maroon-700 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Sign in
        </button>

        <p className="text-[11px] text-ink-300 text-center leading-relaxed">
          Create the admin user in Supabase → Authentication → Users.
          Do not put the password in the website footer.
        </p>

        <a href="/" className="block text-center text-xs font-semibold text-maroon-600 hover:underline">
          ← Back to website
        </a>
      </form>
    </div>
  );
}

function Dashboard({ email }: { email: string }) {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [draft, setDraft] = useState(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [tagsText, setTagsText] = useState('');

  const load = async () => {
    setErr('');
    try {
      setRows(await fetchAllProductRows());
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to load products');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const startEdit = (row: ProductRow) => {
    const p = rowToProduct(row);
    setDraft({ ...p, active: row.active, sort_order: row.sort_order });
    setTagsText(p.tags.join(', '));
    setEditingId(row.id);
    setMsg('');
    setErr('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startNew = () => {
    setDraft(emptyDraft());
    setTagsText('');
    setEditingId('__new__');
    setMsg('');
    setErr('');
  };

  const cancel = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setTagsText('');
  };

  const save = async () => {
    setBusy(true);
    setErr('');
    setMsg('');
    try {
      const id = draft.id.trim() || slugifyId(draft.name);
      if (!draft.name.trim()) throw new Error('Name is required');
      const product: Product = {
        ...draft,
        id,
        tags: tagsText
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const row = productToRow(product, draft.sort_order, draft.active) as ProductRow;
      await upsertProduct(row);
      setMsg(`Saved “${product.name}”`);
      setEditingId(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete “${name}” permanently?`)) return;
    setBusy(true);
    try {
      await deleteProduct(id);
      setMsg(`Deleted “${name}”`);
      if (editingId === id) cancel();
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    const id = draft.id.trim() || slugifyId(draft.name) || `upload-${Date.now()}`;
    if (!draft.id) setDraft((d) => ({ ...d, id }));
    setBusy(true);
    setErr('');
    try {
      const url = await uploadProductImage(id, file);
      setDraft((d) => ({ ...d, id, image: url }));
      setMsg('Photo uploaded — click Save to keep it on this product');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const seed = async () => {
    if (!confirm('Import the 14 starter products from the website code into the database? Existing same IDs will be updated.')) return;
    setBusy(true);
    try {
      const n = await seedCatalogFromCode();
      setMsg(`Imported ${n} products`);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Seed failed');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-20 bg-maroon-700 text-cream-100 border-b border-maroon-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display font-bold text-lg">Catalog Admin</p>
            <p className="text-[11px] text-gold-200">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3 py-1.5 text-xs font-semibold rounded-full border border-cream-100/30 hover:bg-maroon-600"
            >
              View site
            </a>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-cream-100 text-maroon-800"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {(msg || err) && (
          <p className={`text-sm px-4 py-3 rounded-xl ${err ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>
            {err || msg}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={startNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-maroon-600 text-cream-100 rounded-full text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add product
          </button>
          <button
            onClick={seed}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-cream-300 text-ink-700 rounded-full text-sm font-semibold"
          >
            <Database className="w-4 h-4" /> Import starter catalog
          </button>
        </div>

        {editingId && (
          <section className="bg-white border border-cream-300 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h2 className="font-display text-lg font-bold text-maroon-700">
              {editingId === '__new__' ? 'New product' : `Edit: ${draft.name || editingId}`}
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="ID (url-safe, unique)">
                <input
                  value={draft.id}
                  disabled={editingId !== '__new__'}
                  onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                  placeholder="auto from name if blank"
                  className="field"
                />
              </Field>
              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as Product['category'] })}
                  className="field"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Name">
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="field"
                  required
                />
              </Field>
              <Field label="Telugu name">
                <input
                  value={draft.teluguName}
                  onChange={(e) => setDraft({ ...draft, teluguName: e.target.value })}
                  className="field"
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3}
                className="field resize-none"
              />
            </Field>

            <Field label="Tags (comma-separated)">
              <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="field" placeholder="Best Seller, Pure Ghee" />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              {WEIGHTS.map((w) => (
                <Field key={w} label={`Price ${w} (₹)`}>
                  <input
                    type="number"
                    min={0}
                    value={draft.prices[w]}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        prices: { ...draft.prices, [w]: Math.max(0, Number(e.target.value) || 0) },
                      })
                    }
                    className="field"
                  />
                </Field>
              ))}
            </div>

            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <Field label="Image URL">
                <input
                  value={draft.image}
                  onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                  className="field"
                  placeholder="https://… or upload below"
                />
              </Field>
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gold-400 text-maroon-900 rounded-xl text-sm font-semibold cursor-pointer hover:bg-gold-300">
                <Upload className="w-4 h-4" />
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void onUpload(e.target.files?.[0])}
                />
              </label>
            </div>

            {draft.image && (
              <img src={draft.image} alt="" className="h-32 w-32 object-cover rounded-xl border border-cream-300" />
            )}

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                />
                Visible on website
              </label>
              <Field label="Sort order">
                <input
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })}
                  className="field w-24"
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={save}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-maroon-600 text-cream-100 rounded-full text-sm font-semibold disabled:opacity-60"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              <button onClick={cancel} className="px-5 py-2.5 text-sm font-semibold text-ink-500">
                Cancel
              </button>
            </div>
          </section>
        )}

        <section className="bg-white border border-cream-300 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-cream-300 flex items-center justify-between">
            <h2 className="font-display font-bold text-maroon-700">All products ({rows.length})</h2>
          </div>
          {rows.length === 0 ? (
            <p className="p-8 text-sm text-ink-500 text-center">
              No products in the database yet. Click “Import starter catalog” to load the 14 sweets from the site.
            </p>
          ) : (
            <ul className="divide-y divide-cream-200">
              {rows.map((row) => (
                <li key={row.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                  <img
                    src={row.image || '/emblem.jpg'}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover border border-cream-300 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-maroon-700 truncate">
                      {row.name}{' '}
                      {!row.active && (
                        <span className="text-[10px] font-bold uppercase text-ink-300 ml-1">hidden</span>
                      )}
                    </p>
                    <p className="text-xs text-ink-500">
                      {row.category} · {formatPrice(row.price_250g)} / {formatPrice(row.price_500g)} /{' '}
                      {formatPrice(row.price_1kg)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(row)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cream-100 text-maroon-700 border border-cream-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void remove(row.id, row.name)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-700 hover:bg-red-50"
                      aria-label={`Delete ${row.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <style>{`
        .field {
          width: 100%;
          margin-top: 0.35rem;
          padding: 0.55rem 0.75rem;
          border: 1px solid #f3e8d8;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: #fffdf9;
        }
        .field:focus {
          outline: none;
          border-color: #d4af37;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-ink-700">
      {label}
      {children}
    </label>
  );
}
