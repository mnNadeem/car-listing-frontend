import PlanCard from './PlanCard';
import './PlanSelector.css';

function PlanSelector({ plans, selectedPlan, onSelectPlan }) {
  return (
    <section className="section">
      <h2 className="section-title">Select your plan</h2>
      <div className="plans-grid">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={onSelectPlan}
          />
        ))}
      </div>
    </section>
  );
}

export default PlanSelector;

