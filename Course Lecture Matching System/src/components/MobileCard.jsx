function MobileCard({ children, className = "" }) {
  return (
    <div className={`card mobile-padding ${className}`}>
      {children}
    </div>
  );
}

export default MobileCard;


