export default function DynamicFields({ post }) {
  switch (post.category) {
    case "clothes":
      return (
        <div className="space-y-1">
          <p>
            <strong>gender:</strong> {post.gender}
          </p>
          <p>
            <strong>material:</strong> {post.material}
          </p>
          <p>
            <strong>pattern:</strong> {post.pattern}
          </p>
          <p>
            <strong>rewards:</strong> {post.reward}
          </p>
          <p>
            <strong>Size:</strong> {post.size}
          </p>
          <p>
            <strong>Color:</strong> {post.color}
          </p>
          <p>
            <strong>Brand:</strong> {post.brand}
          </p>
        </div>
      );
    case "electronics":
      return (
        <div className="space-y-1">
          <p>
            <strong>Brand:</strong> {post.brand}
          </p>
          <p>
            <strong>Model:</strong> {post.model}
          </p>
          <p>
            <strong>Charge Info:</strong> {post.charge}
          </p>
          <p>
            <strong>Lock:</strong> {post.lock}
          </p>
        </div>
      );
    case "jewellery":
      return (
        <div className="space-y-1">
          <p>
            <strong>Material:</strong> {post.material}
          </p>
          <p>
            <strong>Brand:</strong> {post.brand}
          </p>
          <p>
            <strong>Color:</strong> {post.color}
          </p>
          {post.reward && (
            <p>
              <strong>Reward:</strong> ₹{post.reward}
            </p>
          )}
        </div>
      );
    case "accessories":
      return (
        <div className="space-y-1">
          <p>
            <strong>Type:</strong> {post.type}
          </p>
          <p>
            <strong>Brand:</strong> {post.brand}
          </p>
        </div>
      );
    case "docs":
      return (
        <div className="space-y-1">
          <p>
            <strong>Document Type:</strong> {post.docType}
          </p>
          <p>
            <strong>Issued By:</strong> {post.issuedBy}
          </p>
        </div>
      );
    default:
      return null;
  }
}
