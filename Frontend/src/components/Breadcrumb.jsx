import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index}>
            {isLast ? (
              <span className="breadcrumb-item">{item.label}</span>
            ) : (
              <>
                <Link to={item.path} className="breadcrumb-item">
                  {item.label}
                </Link>
                <span className="breadcrumb-separator">&gt;</span>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}
