import AddOnCard from './AddOnCard';
import './AddOnSelector.css';

function AddOnSelector({ addons, selectedAddons, onToggleAddon }) {
  if (!addons || addons.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <h2 className="section-title">Select add-ons for your subscription</h2>
      <div className="addons-grid">
        {addons.map((addon) => (
          <AddOnCard
            key={addon.id}
            addon={addon}
            isSelected={selectedAddons.includes(addon.id)}
            onToggle={onToggleAddon}
          />
        ))}
      </div>
    </section>
  );
}

export default AddOnSelector;

