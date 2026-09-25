'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Building2, Share2, Search, Shield, Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SiteSettings {
  id?: string;
  company_name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  email: string;
  phone: string;
  address: string;
  business_hours: string;
  default_seo_title: string;
  default_seo_description: string;
  default_og_image_url: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  social_links: {
    linkedin?: string;
    telegram?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    github?: string;
    tiktok?: string;
  };
}

const DEFAULT: SiteSettings = {
  company_name: '',
  tagline: '',
  description: '',
  mission: '',
  vision: '',
  email: '',
  phone: '',
  address: '',
  business_hours: '',
  default_seo_title: '',
  default_seo_description: '',
  default_og_image_url: '',
  maintenance_mode: false,
  maintenance_message: '',
  social_links: {},
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) setSettings(data as SiteSettings);
      setLoading(false);
    }
    load();
  }, []);

  function set(field: keyof SiteSettings, value: string | boolean) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  function setSocial(field: string, value: string) {
    setSettings((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [field]: value },
    }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    const { id, ...rest } = settings;
    if (id) {
      await supabase.from('site_settings').update(rest).eq('id', id);
    } else {
      await supabase.from('site_settings').insert(rest);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const SaveButton = ({ label = 'Save Changes' }: { label?: string }) => (
    <Button size="sm" onClick={save} disabled={saving}>
      {saving ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : saved ? (
        <CheckCircle2 className="mr-1.5 h-4 w-4 text-green-500" />
      ) : (
        <Save className="mr-1.5 h-4 w-4" />
      )}
      {saving ? 'Saving…' : saved ? 'Saved!' : label}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your company information, integrations, and security settings.
        </p>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="company"><Building2 className="mr-1.5 h-3.5 w-3.5" />Company</TabsTrigger>
          <TabsTrigger value="social"><Share2 className="mr-1.5 h-3.5 w-3.5" />Social</TabsTrigger>
          <TabsTrigger value="seo"><Search className="mr-1.5 h-3.5 w-3.5" />SEO</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-1.5 h-3.5 w-3.5" />Security</TabsTrigger>
          <TabsTrigger value="system"><Bell className="mr-1.5 h-3.5 w-3.5" />System</TabsTrigger>
        </TabsList>

        {/* COMPANY */}
        <TabsContent value="company" className="mt-4">
          <Card className="p-6">
            <h2 className="font-heading text-lg font-semibold">Company Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">These details appear across your website and in search results.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={settings.company_name} onChange={(e) => set('company_name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={settings.tagline} onChange={(e) => set('tagline', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea value={settings.description} onChange={(e) => set('description', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Mission Statement</Label>
                <Textarea value={settings.mission} onChange={(e) => set('mission', e.target.value)} placeholder="Our mission is to…" className="min-h-20" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Vision Statement</Label>
                <Textarea value={settings.vision} onChange={(e) => set('vision', e.target.value)} placeholder="Our vision is to…" className="min-h-20" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={settings.email} onChange={(e) => set('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={settings.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input value={settings.address} onChange={(e) => set('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Business Hours</Label>
                <Input value={settings.business_hours} onChange={(e) => set('business_hours', e.target.value)} placeholder="Mon-Fri 9:00-17:00" />
              </div>
            </div>
            <div className="mt-6"><SaveButton /></div>
          </Card>
        </TabsContent>

        {/* SOCIAL */}
        <TabsContent value="social" className="mt-4">
          <Card className="p-6">
            <h2 className="font-heading text-lg font-semibold">Social Links</h2>
            <p className="mt-1 text-sm text-muted-foreground">Only configured links will appear on your website.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                { key: 'linkedin',  label: 'LinkedIn URL',    placeholder: 'https://linkedin.com/company/...' },
                { key: 'github',    label: 'GitHub URL',      placeholder: 'https://github.com/...' },
                { key: 'telegram',  label: 'Telegram URL',    placeholder: 'https://t.me/...' },
                { key: 'facebook',  label: 'Facebook URL',    placeholder: 'https://facebook.com/...' },
                { key: 'instagram', label: 'Instagram URL',   placeholder: 'https://instagram.com/...' },
                { key: 'youtube',   label: 'YouTube URL',     placeholder: 'https://youtube.com/...' },
                { key: 'twitter',   label: 'X / Twitter URL', placeholder: 'https://x.com/...' },
                { key: 'tiktok',    label: 'TikTok URL',      placeholder: 'https://tiktok.com/@...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Input
                    value={(settings.social_links as Record<string, string>)[key] ?? ''}
                    onChange={(e) => setSocial(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6"><SaveButton label="Save Links" /></div>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-4">
          <Card className="p-6">
            <h2 className="font-heading text-lg font-semibold">Global SEO Settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Default metadata used when page-specific SEO is not configured.</p>
            <div className="mt-6 grid gap-5">
              <div className="space-y-2">
                <Label>Default SEO Title</Label>
                <Input value={settings.default_seo_title} onChange={(e) => set('default_seo_title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Default Meta Description</Label>
                <Textarea value={settings.default_seo_description} onChange={(e) => set('default_seo_description', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Default Open Graph Image URL</Label>
                <Input value={settings.default_og_image_url} onChange={(e) => set('default_og_image_url', e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="mt-6"><SaveButton label="Save SEO Settings" /></div>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="mt-4">
          <Card className="p-6">
            <h2 className="font-heading text-lg font-semibold">Security Settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Configure authentication and access control.</p>
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Managed via your Supabase project settings.</p>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Rate Limiting</p>
                  <p className="text-xs text-muted-foreground">Limit login attempts to prevent brute force.</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* SYSTEM */}
        <TabsContent value="system" className="mt-4">
          <Card className="p-6">
            <h2 className="font-heading text-lg font-semibold">System Settings</h2>
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">When enabled, visitors see a maintenance page.</p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(v) => set('maintenance_mode', v)}
                />
              </div>
              <div className="space-y-2">
                <Label>Maintenance Message</Label>
                <Textarea
                  value={settings.maintenance_message}
                  onChange={(e) => set('maintenance_message', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6"><SaveButton label="Save System Settings" /></div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
