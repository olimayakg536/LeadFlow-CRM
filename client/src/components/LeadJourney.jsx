import { JOURNEY_STEPS } from "../utils";

// Shows where a lead is in its journey:
//   ✓ finished step   ● current step   ○ step still to come
// If the lead is Lost, the steps are greyed out and "Lost" is shown separately.
export default function LeadJourney({ status }) {
  const isLost = status === "Lost";
  const currentIndex = JOURNEY_STEPS.indexOf(status); // -1 when Lost

  return (
    <div className="journey">
      {JOURNEY_STEPS.map((step, index) => {
        // Decide how this step looks
        let state = "todo";
        let symbol = "○";

        if (!isLost && index < currentIndex) {
          state = "done";
          symbol = "✓";
        } else if (!isLost && index === currentIndex) {
          state = "current";
          symbol = "●";
        }

        return (
          <div key={step}>
            <div className={"journey-step " + state}>
              <span className="journey-dot">{symbol}</span>
              <span className="journey-name">{step}</span>
              {state === "current" && <span className="journey-tag">Current</span>}
            </div>
            {/* Arrow between steps (not after the last one) */}
            {index < JOURNEY_STEPS.length - 1 && <div className="journey-arrow">↓</div>}
          </div>
        );
      })}

      {isLost && (
        <div className="journey-lost">
          <span className="journey-dot">✗</span>
          <span className="journey-name">Lost</span>
          <span className="journey-tag">Current</span>
        </div>
      )}
    </div>
  );
}
