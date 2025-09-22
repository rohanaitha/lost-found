export default function DynamicFields({ post }) {
  const baseCard =
    "p-6 rounded-2xl shadow-2xl text-white w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 transition hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex flex-col items-center";

  const baseField =
    "flex justify-between px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 w-full";

  const scrollField =
    "flex flex-col items-start space-y-1 max-h-32 overflow-y-auto scrollbar-hide px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-[1.01] transition-all duration-300 w-full";

  switch (post.category) {
    case "clothes":
      return (
        <div className={baseCard}>
          <h2 className="text-2xl font-bold mb-4 text-center tracking-wide text-pink-300 drop-shadow-lg">
            Item Details
          </h2>
          <div className="space-y-3 w-full">
            <p className={baseField}>
              <strong>Gender:</strong> <span>{post.gender}</span>
            </p>
            <p className={baseField}>
              <strong>Material:</strong> <span>{post.material}</span>
            </p>
            <p className={baseField}>
              <strong>Pattern:</strong> <span>{post.pattern}</span>
            </p>
            <p className={baseField}>
              <strong>Reward:</strong> <span>{post.reward}</span>
            </p>
            <p className={baseField}>
              <strong>Size:</strong> <span>{post.size}</span>
            </p>
            <p className={baseField}>
              <strong>Color:</strong> <span>{post.color}</span>
            </p>
            <p className={baseField}>
              <strong>Brand:</strong> <span>{post.brand}</span>
            </p>
          </div>
        </div>
      );

    case "electronics":
      return (
        <div className={baseCard}>
          <h2 className="text-2xl font-bold mb-5 text-center tracking-wide text-indigo-300 drop-shadow-lg">
            Device Details
          </h2>
          <div className="space-y-3 w-full">
            <p className={baseField}>
              <strong>Brand:</strong> <span>{post.brand}</span>
            </p>
            <p className={baseField}>
              <strong>Model:</strong> <span>{post.model}</span>
            </p>
            <p className={baseField}>
              <strong>Charge Info:</strong> <span>{post.charge}</span>
            </p>
            <p className={baseField}>
              <strong>Lock:</strong> <span>{post.lock}</span>
            </p>
            <p className={baseField}>
              <strong>Skins:</strong> <span>{post.skins}</span>
            </p>
            <p className={baseField}>
              <strong>Size:</strong> <span>{post.size}</span>
            </p>
          </div>
        </div>
      );

    case "jewellery":
      return (
        <div className={baseCard}>
          <h2 className="text-xl font-semibold mb-4 text-center tracking-wide text-yellow-300 drop-shadow-lg">
            Jewellery Info
          </h2>
          <div className="space-y-3 w-full">
            <p className={baseField}>
              <strong>Material:</strong> <span>{post.material}</span>
            </p>
            <p className={baseField}>
              <strong>Brand:</strong> <span>{post.brand}</span>
            </p>
            <p className={baseField}>
              <strong>Color:</strong> <span>{post.color}</span>
            </p>
            {post.reward && (
              <p className={baseField}>
                <strong>Reward:</strong>{" "}
                <span className="font-bold text-yellow-300">
                  ₹{post.reward}
                </span>
              </p>
            )}
          </div>
        </div>
      );

    case "accessories":
      return (
        <div className={baseCard}>
          <h2 className="text-xl font-semibold mb-4 text-center tracking-wide text-pink-200 drop-shadow-lg">
            Item Info
          </h2>
          <div className="space-y-3 w-full">
            <p className={baseField}>
              <strong>Type:</strong> <span>{post.itemCategory}</span>
            </p>
            <div className={scrollField}>
              <strong>Description:</strong>
              <span className="text-sm text-gray-100">{post.description}</span>
            </div>
          </div>
        </div>
      );

    case "docs":
      return (
        <div className={baseCard}>
          <h2 className="text-xl font-semibold mb-4 text-center tracking-wide text-blue-400 drop-shadow-lg">
            Document Details
          </h2>
          <div className="space-y-3 w-full">
            <p className={baseField}>
              <strong>Document Type:</strong> <span>{post.docType}</span>
            </p>
            <p className={baseField}>
              <strong>Issued By:</strong> <span>{post.issuingAuthority}</span>
            </p>
            <p className={baseField}>
              <strong>Legal Name:</strong>{" "}
              <span className="italic">{post.nameOnDoc}</span>
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
