// components/settings/settings-form.tsx

"use client";

import * as React from "react";
import { User, Bell, Palette, Save, Loader2, Shield, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/app/actions/settings-actions";
import { useRouter } from "next/navigation";

type SettingsTab = "profile" | "notifications" | "appearance";

interface SettingsFormProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    designation?: string | null;
    email: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const [firstName, setFirstName] = React.useState(user.firstName || "");
  const [lastName, setLastName] = React.useState(user.lastName || "");
  const [designation, setDesignation] = React.useState(user.designation || "");

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile({ firstName, lastName, designation });
    
    if (result.success) {
      router.refresh();
    } else {
      alert("Error updating profile.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[400px]">
      <div className="w-full md:w-48 flex flex-col gap-1">
        {[
          { id: "profile", label: "Identity", icon: User },
          { id: "notifications", label: "Protocols", icon: Bell },
          { id: "appearance", label: "Visuals", icon: Palette },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? "bg-zinc-100 text-zinc-950" 
                : "text-zinc-500 hover:text-zinc-100 hover:bg-white/5"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-zinc-900/40 border border-white/5 rounded-2xl p-6 md:p-8">
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
              <User size={16} className="text-emerald-500" /> Identity_Profile
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">First_Name</label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-zinc-950 border-white/10 focus:border-emerald-500/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Last_Name</label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-zinc-950 border-white/10 focus:border-emerald-500/50" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Operating_Role</label>
                <Input 
                  value={designation} 
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Lead Systems Engineer"
                  className="bg-zinc-950 border-white/10 focus:border-emerald-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Email_Endpoint</label>
                <Input value={user.email} disabled className="bg-zinc-900/50 border-white/5 text-zinc-700 font-mono" />
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Account_Integrity</p>
                <p className="text-[9px] text-emerald-500/60 font-mono italic">Status: Verified_Entity</p>
              </div>
              <Shield size={16} className="text-emerald-500" />
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
              <Bell size={16} className="text-emerald-500" /> Notification_Protocols
            </h3>
            <div className="space-y-3">
              {["Task_Assignment_Alerts", "Comment_Mentions", "Resource_Addition_Logs"].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">{item}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
              <Palette size={16} className="text-emerald-500" /> Visual_Interface
            </h3>
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl text-center">
              <Palette className="mx-auto text-zinc-800 mb-4" size={40} />
              <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em]">Current_Theme: Industrial_Dark</p>
            </div>

            <div className="mt-12 pt-6 border-t border-red-900/20">
              <h4 className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em] mb-4 flex items-center gap-2">
                <AlertTriangle size={12} /> Danger_Zone
              </h4>
              <Button variant="outline" className="border-red-900/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white text-[9px] font-black uppercase transition-all">
                Deactivate_Node
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            {loading ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}
            {loading ? "Syncing..." : "Commit_Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}