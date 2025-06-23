const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE || 'https://res.cloudinary.com/dzqzg58b2/image/upload';

export default function Gallery({ images, onImageClick }) {
  return (
    <div
      style={{
        columns: 3, // Cambia el número de columnas según tu preferencia
        columnGap: 0, // Sin espacio horizontal entre columnas
        width: '100%',
        maxWidth: '1200px',
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
            margin: 0,
            padding: 0,
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            breakInside: 'avoid', // Evita cortes de imagen entre columnas
          }}
          draggable={false}
          onClick={() => onImageClick(publicId)}
        />
      ))}
    </div>
  );
}