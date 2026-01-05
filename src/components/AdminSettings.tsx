import { useState, useRef, useEffect } from "react";
import { 
  X, Upload, Loader2, Plus, Trash2, FileText, Image, Video, Music, 
  Palette, MapPin, Building, Phone, Shield, UtensilsCrossed, HelpCircle,
  Globe, Link as LinkIcon, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: "army_history", label: "Army History", icon: Shield, description: "Indian Army heritage & battles" },
  { value: "heritage_sites", label: "Heritage Sites", icon: MapPin, description: "Historical places & monuments" },
  { value: "hotels", label: "Hotels", icon: Building, description: "Accommodation options" },
  { value: "shops", label: "Shops", icon: Building, description: "Local shops & markets" },
  { value: "restaurants", label: "Restaurants", icon: UtensilsCrossed, description: "Food & dining options" },
  { value: "emergency", label: "Emergency", icon: Phone, description: "Emergency contacts & services" },
  { value: "tourism", label: "Tourism", icon: Globe, description: "Tourist attractions & info" },
  { value: "general", label: "General", icon: HelpCircle, description: "Other information" },
];

const mediaTypes = [
  { value: "text", label: "Text Only", icon: FileText, accept: "", description: "Plain text information" },
  { value: "image", label: "Image", icon: Image, accept: "image/*", description: "Photos & pictures" },
  { value: "video", label: "Video", icon: Video, accept: "video/*", description: "Video content" },
  { value: "audio", label: "Audio", icon: Music, accept: "audio/*", description: "Audio recordings" },
  { value: "pdf", label: "PDF Document", icon: FileText, accept: ".pdf", description: "PDF files" },
  { value: "link", label: "External Link", icon: LinkIcon, accept: "", description: "Website URLs" },
];

interface Resource {
  id: string;
  title: string;
  content: string;
  category: string;
  media_type: string | null;
  media_url: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminSettings = ({ isOpen, onClose }: AdminSettingsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const [newResource, setNewResource] = useState({
    title: "",
    content: "",
    category: "general",
    media_type: "text",
    external_link: "",
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
    if (file) {
      setSelectedFile(file);
      toast({ title: "File Selected", description: file.name });
    }
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
    if (!newResource.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }
    if (!newResource.content.trim() && newResource.media_type !== "link") {
      toast({ title: "Error", description: "Content/Description is required", variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      let mediaUrl = null;
      
      if (newResource.media_type === "link") {
        mediaUrl = newResource.external_link;
      } else if (selectedFile) {
        mediaUrl = await uploadFile(selectedFile);
        if (!mediaUrl) {
          toast({ title: "Error", description: "Failed to upload file", variant: "destructive" });
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase.from("knowledge_resources").insert({
        title: newResource.title.trim(),
        content: newResource.content.trim() || newResource.title.trim(),
        category: newResource.category,
        media_type: newResource.media_type,
        media_url: mediaUrl,
        is_active: true,
      });

      if (error) {
        toast({ title: "Error", description: "Failed to add resource", variant: "destructive" });
      } else {
        toast({ 
          title: "✅ Resource Added!", 
          description: "AI will now use this information in responses" 
        });
        setNewResource({ title: "", content: "", category: "general", media_type: "text", external_link: "" });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchResources();
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const toggleResourceStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("knowledge_resources")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: currentStatus ? "Disabled" : "Enabled", description: "Resource status updated" });
      fetchResources();
    }
  };

  const deleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    
    const { error } = await supabase.from("knowledge_resources").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Resource removed permanently" });
      fetchResources();
    }
  };

  const filteredResources = filterCategory === "all" 
    ? resources 
    : resources.filter(r => r.category === filterCategory);

  const selectedMediaType = mediaTypes.find(m => m.value === newResource.media_type);
  const selectedCategory = categories.find(c => c.value === newResource.category);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-card border-l border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">Manage AI knowledge base</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="add" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-4 mt-4 grid grid-cols-3">
            <TabsTrigger value="add">➕ Add Data</TabsTrigger>
            <TabsTrigger value="manage">📋 Manage ({resources.length})</TabsTrigger>
            <TabsTrigger value="help">❓ Help</TabsTrigger>
          </TabsList>

          {/* Add Data Tab */}
          <TabsContent value="add" className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📚 Add Knowledge Resource</h3>
              <p className="text-sm text-muted-foreground">
                Whatever you add here, the AI chatbot will automatically use it to answer user questions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">1</span>
                  Choose Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setNewResource({ ...newResource, category: cat.value })}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                        newResource.category === cat.value
                          ? "border-accent bg-accent/20 text-foreground"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium">{cat.label}</p>
                        <p className="text-xs opacity-70">{cat.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Media Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">2</span>
                  Content Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {mediaTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewResource({ ...newResource, media_type: type.value })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                        newResource.media_type === type.value
                          ? "border-accent bg-accent/20 text-foreground"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">3</span>
                  Title / Name
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder={`e.g., ${selectedCategory?.label || "Resource"} name...`}
                />
              </div>

              {/* Step 4: Content/Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">4</span>
                  Description / Details
                </label>
                <textarea
                  value={newResource.content}
                  onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground min-h-[120px] focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Write detailed information that the AI should know about this..."
                />
              </div>

              {/* Step 5: File/Link Upload */}
              {newResource.media_type === "link" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">5</span>
                    External Link URL
                  </label>
                  <input
                    type="url"
                    value={newResource.external_link}
                    onChange={(e) => setNewResource({ ...newResource, external_link: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="https://example.com/page"
                  />
                </div>
              ) : newResource.media_type !== "text" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">5</span>
                    Upload {selectedMediaType?.label}
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      selectedFile 
                        ? "border-accent bg-accent/10" 
                        : "border-border hover:border-accent/50 hover:bg-muted/50"
                    }`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <selectedMediaType.icon className="w-5 h-5 text-accent" />
                        <p className="text-sm text-foreground font-medium">{selectedFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="ml-2 p-1 rounded-full hover:bg-destructive/20 text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <p className="text-sm">Click to upload {selectedMediaType?.label}</p>
                        <p className="text-xs opacity-70">or drag and drop</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept={selectedMediaType?.accept}
                  />
                </div>
              )}

              <Button type="submit" disabled={uploading} className="w-full h-12 text-base">
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Adding to Knowledge Base...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add to AI Knowledge Base
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterCategory === "all" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All ({resources.length})
              </button>
              {categories.map(cat => {
                const count = resources.filter(r => r.category === cat.value).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setFilterCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      filterCategory === cat.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Resources List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No resources found</p>
                <p className="text-sm">Add some data in the "Add Data" tab</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredResources.map((resource) => {
                  const cat = categories.find(c => c.value === resource.category);
                  const CatIcon = cat?.icon || HelpCircle;
                  return (
                    <div
                      key={resource.id}
                      className={`p-4 rounded-lg border transition-all ${
                        resource.is_active 
                          ? "bg-muted/30 border-border" 
                          : "bg-muted/10 border-border/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-accent/20">
                            <CatIcon className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{resource.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {cat?.label} • {resource.media_type} • {new Date(resource.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleResourceStatus(resource.id, resource.is_active)}
                            className={`p-2 rounded-lg transition-colors ${
                              resource.is_active 
                                ? "hover:bg-muted text-foreground" 
                                : "hover:bg-accent/20 text-accent"
                            }`}
                            title={resource.is_active ? "Disable" : "Enable"}
                          >
                            {resource.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteResource(resource.id)}
                            className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-4">
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">🤖 How AI Uses Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  When you add any resource here, the AI chatbot automatically reads it and uses that information 
                  to answer user questions. More detailed content = better answers!
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">📋 What to Add:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-accent mt-0.5" />
                    <span><strong>Army History:</strong> Battles, martyrs, war stories, regiment info</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-accent mt-0.5" />
                    <span><strong>Heritage Sites:</strong> Monuments, historical places, tourist spots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-accent mt-0.5" />
                    <span><strong>Hotels/Shops:</strong> Name, location, contact, description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-accent mt-0.5" />
                    <span><strong>Emergency:</strong> Hospital, police, fire service contacts</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">💡 Tips for Best Results:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Write detailed, accurate information</li>
                  <li>Include location, contact, timings where relevant</li>
                  <li>Use simple language (Hindi/Urdu/English)</li>
                  <li>Add images/videos for visual content</li>
                  <li>Keep information up-to-date</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
