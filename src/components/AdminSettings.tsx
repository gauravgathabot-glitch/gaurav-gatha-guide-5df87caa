import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, Plus, Trash2, FileText, Image, Video, Music, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: "army_history", label: "Army History" },
  { value: "heritage_sites", label: "Heritage Sites" },
  { value: "hotels", label: "Hotels" },
  { value: "shops", label: "Shops" },
  { value: "restaurants", label: "Restaurants" },
  { value: "emergency", label: "Emergency" },
  { value: "general", label: "General" },
];

const mediaTypes = [
  { value: "text", label: "Text", icon: FileText },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Music },
  { value: "pdf", label: "PDF", icon: FileText },
];

interface Resource {
  id: string;
  title: string;
  content: string;
  category: string;
  media_type: string | null;
  media_url: string | null;
  is_active: boolean;
}

const AdminSettings = ({ isOpen, onClose }: AdminSettingsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [newResource, setNewResource] = useState({
    title: "",
    content: "",
    category: "general",
    media_type: "text",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("knowledge_resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load resources", variant: "destructive" });
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchResources();
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${newResource.category}/${fileName}`;

    const { error } = await supabase.storage
      .from("knowledge-files")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("knowledge-files")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.content) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      let mediaUrl = null;
      if (selectedFile) {
        mediaUrl = await uploadFile(selectedFile);
        if (!mediaUrl) {
          toast({ title: "Error", description: "Failed to upload file", variant: "destructive" });
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase.from("knowledge_resources").insert({
        title: newResource.title,
        content: newResource.content,
        category: newResource.category,
        media_type: newResource.media_type,
        media_url: mediaUrl,
        is_active: true,
      });

      if (error) {
        toast({ title: "Error", description: "Failed to add resource", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Resource added successfully" });
        setNewResource({ title: "", content: "", category: "general", media_type: "text" });
        setSelectedFile(null);
        fetchResources();
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteResource = async (id: string) => {
    const { error } = await supabase.from("knowledge_resources").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Resource removed" });
      fetchResources();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-card border-l border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl font-bold">Admin Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sources" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-4 mt-4 grid grid-cols-2">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Add New Resource */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Add Knowledge Resource</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm"
                    placeholder="e.g., Kargil War Memorial"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Content</label>
                  <textarea
                    value={newResource.content}
                    onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm min-h-[100px]"
                    placeholder="Detailed information about this resource..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                    <select
                      value={newResource.category}
                      onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Media Type</label>
                    <select
                      value={newResource.media_type}
                      onChange={(e) => setNewResource({ ...newResource, media_type: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm"
                    >
                      {mediaTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Attach File (Optional)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent/50 transition-colors"
                  >
                    {selectedFile ? (
                      <p className="text-sm text-foreground">{selectedFile.name}</p>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-6 h-6" />
                        <p className="text-sm">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf"
                  />
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Resource
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Existing Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Existing Resources ({resources.length})</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : resources.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No resources yet</p>
              ) : (
                <div className="space-y-2">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">{resource.category}</p>
                      </div>
                      <button
                        onClick={() => deleteResource(resource.id)}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Management
              </h3>
              <p className="text-sm text-muted-foreground">
                Users can select themes from the menu dropdown. The following themes are available:
              </p>
              
              <div className="space-y-3">
                {[
                  { name: "Military (Default)", desc: "Gold & Olive - Army inspired", color: "bg-amber-500" },
                  { name: "Ocean Blue", desc: "Blue & Cyan - Cool tones", color: "bg-cyan-500" },
                  { name: "Forest Green", desc: "Green & Emerald - Nature inspired", color: "bg-emerald-500" },
                  { name: "Sunset Orange", desc: "Orange & Amber - Warm tones", color: "bg-orange-500" },
                  { name: "Midnight Purple", desc: "Purple & Indigo - Night vibes", color: "bg-purple-500" },
                ].map((theme, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                    <div>
                      <p className="font-medium text-sm text-foreground">{theme.name}</p>
                      <p className="text-xs text-muted-foreground">{theme.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/30 mt-6">
                <p className="text-sm text-foreground">
                  <strong>Note:</strong> Custom theme creation will be available in a future update. 
                  Currently users can choose from the 5 preset themes via the menu.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
