const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE || 'https://res.cloudinary.com/dzqzg58b2/image/upload';

export default function Gallery({ images, onImageClick }) {
  return (
    <div
      style={{
        columns: 4, // 4 columnas
        columnGap: '16px', // Margen entre columnas
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {images.map((publicId) => (
        <img
          key={publicId}
          src={`${CLOUDINARY_BASE_URL}/${publicId}.jpg`}
          alt={publicId}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            marginBottom: '0px', // Sin margen vertical entre imágenes
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            breakInside: 'avoid',
            cursor: 'pointer',
          }}
          draggable={false}
          onClick={() => onImageClick(publicId)}
        />
      ))}
    </div>
  );
}