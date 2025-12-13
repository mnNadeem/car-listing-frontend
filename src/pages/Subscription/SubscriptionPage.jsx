import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSelectedPlan,
  toggleAddon,
  updateCardField,
  selectSelectedPlan,
  selectSelectedAddons,
  selectCardDetails,
} from '../../store/subscriptionSlice';
import {
  PlanSelector,
  AddOnSelector,
  CardDetails,
  InfoSection,
  AnimatedSection,
} from './components';
import { plans, allAddons, addonsByPlan, plansWithCardDetails, addonsRequiringCard } from './data';
import './SubscriptionPage.css';

function SubscriptionPage() {
  const dispatch = useAppDispatch();
  const selectedPlan = useAppSelector(selectSelectedPlan);
  const selectedAddons = useAppSelector(selectSelectedAddons);
  const cardDetails = useAppSelector(selectCardDetails);

  // Get visible addons based on selected plan
  const visibleAddons = useMemo(() => {
    if (!selectedPlan) {
      return [];
    }
    const allowedAddonIds = addonsByPlan[selectedPlan] || [];
    return allAddons.filter((addon) => allowedAddonIds.includes(addon.id));
  }, [selectedPlan]);

  // Check if any selected addon requires card details
  const addonRequiresCard = useMemo(() => {
    return selectedAddons.some((addonId) => addonsRequiringCard.includes(addonId));
  }, [selectedAddons]);

  // Check if card details should be shown (plan requires it OR selected addon requires it)
  const showCardDetails = useMemo(() => {
    return plansWithCardDetails.includes(selectedPlan) || addonRequiresCard;
  }, [selectedPlan, addonRequiresCard]);

  // Check if addons should be shown
  const showAddons = selectedPlan && visibleAddons.length > 0;

  const handlePlanSelect = (planId) => {
    dispatch(setSelectedPlan(planId));
  };

  const handleToggleAddon = (addonId) => {
    dispatch(toggleAddon(addonId));
  };

  const handleCardChange = (field, value) => {
    dispatch(updateCardField({ field, value }));
  };

  return (
    <div className="subscription-page">
      <div className="page-header">
        <h1 className="page-title">Subscription plan</h1>
        <p className="page-subtitle">
          Select the ideal subscription plan for your listing.
        </p>
      </div>

      <PlanSelector
        plans={plans}
        selectedPlan={selectedPlan}
        onSelectPlan={handlePlanSelect}
      />

      <AnimatedSection show={showAddons} key={`addons-${selectedPlan}`}>
        <AddOnSelector
          addons={visibleAddons}
          selectedAddons={selectedAddons}
          onToggleAddon={handleToggleAddon}
        />
      </AnimatedSection>

      <AnimatedSection show={showCardDetails}>
        <CardDetails
          cardDetails={cardDetails}
          onCardChange={handleCardChange}
        />
      </AnimatedSection>

      <InfoSection />
    </div>
  );
}

export default SubscriptionPage;
