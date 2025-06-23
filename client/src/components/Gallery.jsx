const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE || 'https://res.cloudinary.com/dzqzg58b2/image/upload';

export default function Gallery({ images, onImageClick }) {
  const gap = '16px'; // Puedes ajustar este valor

  return (
    <div
      style={{
        columns: 5,
        columnGap: gap,
        width: '100%',
        maxWidth: '1600px',
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
            marginBottom: gap, // Margen entre imágenes de la misma columna
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            breakInside: 'avoid',
            cursor: 'pointer',
          }}
          draggable={false}
          onClick={() => onImageClick && onImageClick(publicId)}
        />
      ))}
    </div>
  );
}