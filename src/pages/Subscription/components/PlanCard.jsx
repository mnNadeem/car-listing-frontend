import FeatureIcon from './FeatureIcon';
import './PlanCard.css';

function PlanCard({ plan, isSelected, onSelect }) {
  return (
    <div
      className={`plan-card ${isSelected ? 'selected' : ''} ${plan.highlighted ? 'highlighted' : ''}`}
      onClick={() => onSelect(plan.id)}
    >
      <h3 className="plan-name">{plan.name}</h3>
      <ul className="plan-features">
        {plan.features.map((feature, index) => (
          <li key={index} className="plan-feature">
            <FeatureIcon type={feature.icon} />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      <div className="plan-price">
        <span className="price-value">{plan.price}</span>
        <span className="price-unit">{plan.priceUnit}</span>
      </div>
    </div>
  );
}

export default PlanCard;

