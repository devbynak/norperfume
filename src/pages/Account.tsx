import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Package, MapPin, User, Pencil, Plus, Trash2, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import {
  fetchCustomerProfile,
  updateCustomerName,
  updateCustomerPhone,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  type CustomerProfile,
  type CustomerAddress,
  type AddressInput,
} from "@/lib/shopify/customer-queries";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";

const emptyAddress: AddressInput = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  zoneCode: "",
  territoryCode: "IN",
  zip: "",
  phoneNumber: "",
};

const Account = () => {
  const { isAuthenticated, login, logout, isLoading: authLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [creatingAddr, setCreatingAddr] = useState(false);
  const [addrDraft, setAddrDraft] = useState<AddressInput>(emptyAddress);
  const [savingAddr, setSavingAddr] = useState(false);

  const reload = () => {
    setLoading(true);
    fetchCustomerProfile()
      .then((p) => {
        setProfile(p);
        setFirstName(p.firstName || "");
        setLastName(p.lastName || "");
        setPhone(p.phoneNumber?.phoneNumber || "");
      })
      .catch((e) => {
        setError("Your session may have expired. Please log in again.");
        logout();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading) return;
    
    // If not authenticated, we'll let the component render the "null" state
    // which effectively hides the account details.
    // We don't want to auto-redirect here because it can cause loops 
    // during the logout process.
    if (!isAuthenticated) {
      return;
    }
    
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const handleLogout = () => {
    haptic("medium");
    try {
      logout();
    } catch (e) {
      console.error("Logout failed:", e);
      navigate("/", { replace: true });
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateCustomerName(firstName.trim(), lastName.trim());
      haptic("success");
      toast.success("Profile updated");
      setEditingProfile(false);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const startEditAddress = (a: CustomerAddress) => {
    setCreatingAddr(false);
    setEditingAddrId(a.id);
    setAddrDraft({
      firstName: a.firstName || "",
      lastName: a.lastName || "",
      address1: a.address1 || "",
      address2: a.address2 || "",
      city: a.city || "",
      zoneCode: a.zoneCode || "",
      territoryCode: a.territoryCode || "IN",
      zip: a.zip || "",
      phoneNumber: a.phoneNumber || "",
    });
  };

  const startCreateAddress = () => {
    setEditingAddrId(null);
    setCreatingAddr(true);
    setAddrDraft(emptyAddress);
  };

  const cancelAddress = () => {
    setEditingAddrId(null);
    setCreatingAddr(false);
    setAddrDraft(emptyAddress);
  };

  const saveAddress = async () => {
    setSavingAddr(true);
    try {
      if (editingAddrId) {
        await updateCustomerAddress(editingAddrId, addrDraft);
      } else {
        await createCustomerAddress(addrDraft, !profile?.addresses?.nodes?.length);
      }
      haptic("success");
      toast.success("Address saved");
      cancelAddress();
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save address");
    } finally {
      setSavingAddr(false);
    }
  };

  const removeAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteCustomerAddress(id);
      haptic("warning");
      toast.success("Address removed");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete address");
    }
  };

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-5 pt-32 pb-24">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-serif tracking-tight">Your Session</h1>
            <p className="text-muted-foreground">
              Please sign in to view your orders, profile, and addresses.
            </p>
            <button
              onClick={() => login("/account")}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium transition-transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const inputCls =
    "w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SEO 
        title="My Account | NOR PERFUME | Official Online Store"
        description="Manage your profile and shipping addresses."
      />
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-24">
        <header className="mb-10 md:mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
            My account
          </p>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight">
            Welcome{profile?.firstName ? `, ${profile.firstName}` : ""}
          </h1>
        </header>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Link
            to="/orders"
            className="group p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <Package className="w-6 h-6 mb-4 text-primary" />
            <h2 className="text-xl font-medium mb-1">Orders</h2>
            <p className="text-sm text-muted-foreground">
              Track current shipments and review past orders.
            </p>
          </Link>

          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <User className="w-6 h-6 mb-4 text-primary" />
                <h2 className="text-xl font-medium">Profile</h2>
              </div>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="profile-firstname"
                    name="firstName"
                    className={inputCls}
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    id="profile-lastname"
                    name="lastName"
                    className={inputCls}
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <input
                  id="profile-phone"
                  name="phone"
                  className={`${inputCls} opacity-60 cursor-not-allowed`}
                  placeholder="No phone number on file"
                  value={phone}
                  disabled
                  inputMode="tel"
                />
                <p className="text-[11px] text-muted-foreground">
                  Email and phone number are managed by your Shopify account and cannot be changed here.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    disabled={savingProfile}
                    onClick={saveProfile}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <button
                    disabled={savingProfile}
                    onClick={() => {
                      setEditingProfile(false);
                      setFirstName(profile?.firstName || "");
                      setLastName(profile?.lastName || "");
                      setPhone(profile?.phoneNumber?.phoneNumber || "");
                    }}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-white/15 text-sm"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <dl className="space-y-2 text-sm mt-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="text-right">{profile?.displayName || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="text-right break-all">
                    {profile?.emailAddress?.emailAddress || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="text-right">{profile?.phoneNumber?.phoneNumber || "—"}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-medium">Addresses</h2>
            </div>
            {!creatingAddr && !editingAddrId && (
              <button
                onClick={startCreateAddress}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-white/15 text-xs hover:bg-white/5"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
          </div>

          {(creatingAddr || editingAddrId) && (
            <div className="mb-5 p-4 rounded-xl border border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input id="addr-firstname" name="firstName" className={inputCls} placeholder="First name"
                  value={addrDraft.firstName || ""} onChange={(e) => setAddrDraft({ ...addrDraft, firstName: e.target.value })} />
                <input id="addr-lastname" name="lastName" className={inputCls} placeholder="Last name"
                  value={addrDraft.lastName || ""} onChange={(e) => setAddrDraft({ ...addrDraft, lastName: e.target.value })} />
              </div>
              <input id="addr-line1" name="address1" className={inputCls} placeholder="Address line 1"
                value={addrDraft.address1 || ""} onChange={(e) => setAddrDraft({ ...addrDraft, address1: e.target.value })} />
              <input id="addr-line2" name="address2" className={inputCls} placeholder="Address line 2 (optional)"
                value={addrDraft.address2 || ""} onChange={(e) => setAddrDraft({ ...addrDraft, address2: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input id="addr-city" name="city" className={inputCls} placeholder="City"
                  value={addrDraft.city || ""} onChange={(e) => setAddrDraft({ ...addrDraft, city: e.target.value })} />
                <input id="addr-zip" name="zip" className={inputCls} placeholder="ZIP / PIN"
                  value={addrDraft.zip || ""} onChange={(e) => setAddrDraft({ ...addrDraft, zip: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input id="addr-state" name="zoneCode" className={inputCls} placeholder="State code (e.g. MH)"
                  value={addrDraft.zoneCode || ""} onChange={(e) => setAddrDraft({ ...addrDraft, zoneCode: e.target.value.toUpperCase() })} />
                <input id="addr-country" name="territoryCode" className={inputCls} placeholder="Country (ISO, e.g. IN)"
                  value={addrDraft.territoryCode || ""} onChange={(e) => setAddrDraft({ ...addrDraft, territoryCode: e.target.value.toUpperCase() })} />
              </div>
              <input id="addr-phone" name="phone" className={inputCls} placeholder="Phone" inputMode="tel"
                value={addrDraft.phoneNumber || ""} onChange={(e) => setAddrDraft({ ...addrDraft, phoneNumber: e.target.value })} />
              <div className="flex gap-2 pt-1">
                <button
                  disabled={savingAddr}
                  onClick={saveAddress}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> Save address
                </button>
                <button
                  disabled={savingAddr}
                  onClick={cancelAddress}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-white/15 text-sm"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          {profile?.addresses?.nodes?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {profile.addresses.nodes.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-xl border border-white/10 text-sm leading-relaxed flex flex-col"
                >
                  <div className="flex-1">
                    {(addr.formatted || []).map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    {addr.phoneNumber && (
                      <div className="text-muted-foreground mt-1">{addr.phoneNumber}</div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => startEditAddress(addr)}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !creatingAddr && (
              <p className="text-sm text-muted-foreground">No addresses on file.</p>
            )
          )}
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/15 hover:bg-white/5 text-sm tracking-wide"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
