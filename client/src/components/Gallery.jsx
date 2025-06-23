const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE || 'https://res.cloudinary.com/dzqzg58b2/image/upload';

export default function Gallery({ images, onImageClick }) {
  return (
    <div
      style={{
        width: '25%',
        maxWidth: '700px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 0, // Sin espacio entre imágenes
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
            margin: 0,
            padding: 0,
            borderRadius: '0',
            border: 'none',
            boxShadow: 'none',
          }}
          draggable={false}
          onClick={() => onImageClick(publicId)}
        />
      ))}
    </div>
  );
}