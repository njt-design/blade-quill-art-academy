import { useListGallery } from "@workspace/api-client-react";

export default function Gallery() {
  const { data: galleryItems, isLoading } = useListGallery();

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
          <h1 className="text-5xl font-display mb-6">Artwork Gallery</h1>
          <p className="text-lg text-muted-foreground">
            A collection of digital paintings, character designs, and illustrations created using Krita.
          </p>
        </div>

        {isLoading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-secondary/50 rounded-xl aspect-[3/4] break-inside-avoid" />
            ))}
          </div>
        ) : galleryItems && galleryItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="break-inside-avoid relative group rounded-xl overflow-hidden glass-panel">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-display text-white mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/80 text-sm">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-2xl">
            <h3 className="text-2xl font-display text-muted-foreground">Gallery is empty</h3>
          </div>
        )}

      </div>
    </div>
  );
}
