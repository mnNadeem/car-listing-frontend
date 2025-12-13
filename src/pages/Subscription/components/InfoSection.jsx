import './InfoSection.css';

function InfoSection() {
  return (
    <section className="section info-section">
      <p className="info-text">
        Learn more about the plans here -{' '}
        <a href="#" className="info-link">
          What is the right plan for me?
        </a>
      </p>
      <p className="info-text">
        You will be able to switch between plans easily later as well. Speak to our
        host success team if you need any clarifications.
      </p>
    </section>
  );
}

export default InfoSection;

