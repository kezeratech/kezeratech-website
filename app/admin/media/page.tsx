'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ImagePlus, Folder, Search, Trash2, Copy, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const BUCKET = 'media';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  id: string;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filtered, setFiltered] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      // Bucket may not exist yet
      setFiles([]);
      setFiltered([]);
      setLoading(false);
      return;
    }

    const items: MediaFile[] = (data ?? [])
      .filter((f) => f.name !== '.emptyFolderPlaceholder')
      .map((f) => {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
        return {
          id: f.id ?? f.name,
          name: f.name,
          url: urlData.publicUrl,
          size: f.metadata?.size ?? 0,
          created_at: f.created_at ?? '',
        };
      });

    setFiles(items);
    setFiltered(items);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { error } = await supabase.storage.from(BUCKET).upload(safeName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (error) {
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
        toast.error('Storage bucket "media" not found. Create it in your Supabase dashboard under Storage.');
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
      return;
    }

    toast.success(`${file.name} uploaded successfully.`);
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.storage.from(BUCKET).remove([deleteTarget.name]);
    if (error) {
      toast.error('Failed to delete file.');
    } else {
      toast.success('File deleted.');
      load();
    }
    setDeleteTarget(null);
  }

  async function copyUrl(file: MediaFile) {
    await navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function search(q: string) {
    const lower = q.toLowerCase();
    setFiltered(files.filter((f) => f.name.toLowerCase().includes(lower)));
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isImage(name: string) {
    return /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(name);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Media Library</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload and manage images, documents, and videos.
            </p>
          </div>
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-1.5 h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload File'}
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleUpload} />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search media..." className="h-9 w-64 pl-10" onChange={(e) => search(e.target.value)} />
          </div>
          <p className="text-xs text-muted-foreground">{files.length} file{files.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </Card>
        ) : files.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ImagePlus className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">No media uploaded yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload images, documents, and videos to use across your website.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Make sure a public storage bucket named <strong>media</strong> exists in your Supabase project.
              </p>
              <Button className="mt-6" size="sm" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="mr-1.5 h-4 w-4" />
                Upload Your First File
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((file) => (
              <Card key={file.id} className="group overflow-hidden">
                {/* Preview */}
                <div className="relative flex h-40 items-center justify-center bg-muted">
                  {isImage(file.name) ? (
                    <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Folder className="h-10 w-10" />
                      <span className="text-xs uppercase">{file.name.split('.').pop()}</span>
                    </div>
                  )}
                  {/* Hover actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(file)}
                      title="Copy URL"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border hover:border-accent transition-colors"
                    >
                      {copiedId === file.id
                        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                        : <Copy className="h-4 w-4" />}
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Open in new tab"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border hover:border-accent transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => setDeleteTarget(file)}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border hover:border-destructive hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="truncate text-xs font-medium" title={file.name}>{file.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> will be permanently deleted. Any page using this file will show a broken image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
