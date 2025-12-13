import './AddOnCard.css';

function AddOnCard({ addon, isSelected, onToggle }) {
  const handleClick = () => {
    if (addon.available) {
      onToggle(addon.id);
    }
  };

  return (
    <div
      className={`addon-card ${!addon.available ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <span className="addon-name">{addon.name}</span>
      {addon.comingSoon && (
        <span className="coming-soon-badge">Coming soon</span>
      )}
      <div className={`addon-checkbox ${isSelected ? 'checked' : ''}`} />
    </div>
  );
}

export default AddOnCard;

