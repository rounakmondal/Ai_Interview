import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X, Tag, RefreshCw, ShieldAlert, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth-api";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/api$/, "");

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: "percent" | "flat";
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  minPlan: string | null;
  active: boolean;
  createdAt: string;
}

const PLAN_OPTIONS = [
  { value: "", label: "All plans" },
  { value: "single_exam", label: "Single Exam (₹9)" },
  { value: "monthly_pass", label: "All Exams Pass (₹29)" },
  { value: "pro_monthly", label: "Pro Monthly (₹99)" },
];

const EMPTY_FORM = {
  code: "",
  discount: "",
  discountType: "percent" as "percent" | "flat",
  maxUses: "",
  expiresAt: "",
  minPlan: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = session?.token;

  async function fetchCoupons() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/coupon/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setCoupons(json.coupons);
    } catch (e: any) {
      setError(e.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) { navigate("/auth"); return; }
    fetchCoupons();
  }, [token]);

  function startCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  }

  function startEdit(c: Coupon) {
    setEditId(c._id);
    setForm({
      code: c.code,
      discount: String(c.discount),
      discountType: c.discountType,
      maxUses: c.maxUses !== null ? String(c.maxUses) : "",
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
      minPlan: c.minPlan || "",
    });
    setFormError(null);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.code.trim() || !form.discount) {
      setFormError("Code and discount are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const body = {
        code: form.code.toUpperCase().trim(),
        discount: Number(form.discount),
        discountType: form.discountType,
        maxUses: form.maxUses || null,
        expiresAt: form.expiresAt || null,
        minPlan: form.minPlan || null,
      };

      let res;
      if (editId) {
        res = await fetch(`${API_BASE}/api/coupon/admin/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${API_BASE}/api/coupon/admin/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setShowForm(false);
      setEditId(null);
      await fetchCoupons();
    } catch (e: any) {
      setFormError(e.message || "Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/api/coupon/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCoupons();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(c: Coupon) {
    await fetch(`${API_BASE}/api/coupon/admin/${c._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ active: !c.active }),
    });
    await fetchCoupons();
  }

  const isExpired = (c: Coupon) => !!c.expiresAt && new Date(c.expiresAt) < new Date();
  const isLimitReached = (c: Coupon) => c.maxUses !== null && c.usedCount >= c.maxUses;

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage coupon codes & discounts</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchCoupons} className="gap-1.5">
            <RefreshCw className="w-4 h-4" />Refresh
          </Button>
          <Button size="sm" onClick={startCreate} className="gap-1.5 bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4" />New Coupon
          </Button>
        </div>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 rounded-2xl border border-orange-300/40 bg-orange-50/40 dark:bg-orange-900/10"
        >
          <h2 className="text-lg font-bold mb-4">{editId ? "Edit Coupon" : "Create New Coupon"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Coupon Code *</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. WELCOME50"
                value={form.code}
                disabled={!!editId}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Discount *</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. 20"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Discount Type *</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as "percent" | "flat" })}
              >
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Max Uses (blank = unlimited)</label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. 100"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Expires On (blank = never)</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Restrict to Plan</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.minPlan}
                onChange={(e) => setForm({ ...form, minPlan: e.target.value })}
              >
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {formError && (
            <p className="mt-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
              {formError}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave} disabled={saving} className="gap-1.5 bg-orange-500 hover:bg-orange-600 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {editId ? "Save Changes" : "Create Coupon"}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
          {error === "Admin access required." ? (
            <span>⚠️ You are not authorized. Make sure your account email matches <code>ADMIN_EMAIL</code> in the server <code>.env</code>.</span>
          ) : error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No coupons yet</p>
          <p className="text-sm">Click "New Coupon" to create your first discount code.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  {["Code", "Discount", "Type", "Uses", "Expires", "Plan", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => {
                  const expired = isExpired(c);
                  const limitHit = isLimitReached(c);
                  const effectivelyInactive = !c.active || expired || limitHit;

                  return (
                    <motion.tr
                      key={c._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b border-border/50 ${effectivelyInactive ? "opacity-50" : ""}`}
                    >
                      <td className="px-4 py-3 font-mono font-bold tracking-widest text-orange-600">
                        {c.code}
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        {c.discountType === "percent" ? `${c.discount}%` : `₹${c.discount}`}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{c.discountType}</td>
                      <td className="px-4 py-3">
                        <span className={limitHit ? "text-red-500 font-semibold" : "text-foreground"}>
                          {c.usedCount}{c.maxUses !== null ? `/${c.maxUses}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {c.expiresAt ? (
                          <span className={expired ? "text-red-500 font-semibold" : "text-foreground"}>
                            {new Date(c.expiresAt).toLocaleDateString("en-IN")}
                            {expired && " (expired)"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {c.minPlan ? PLAN_OPTIONS.find(p => p.value === c.minPlan)?.label ?? c.minPlan : "All"}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggle(c)} title={c.active ? "Disable" : "Enable"}>
                          {c.active
                            ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                            : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(c)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deletingId === c._id}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-muted-foreground hover:text-red-500"
                            title="Delete"
                          >
                            {deletingId === c._id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
