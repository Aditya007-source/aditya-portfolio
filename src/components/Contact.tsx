import { profile } from '../data';
import { useExperience } from '../experience';
import { Plus, Spark } from './Chrome';

export default function Contact() {
  const { notify } = useExperience();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email!);
      notify('Email address copied.');
    } catch {
      notify('Could not copy. Select the email address instead.');
    }
  };

  return <section className="contact-section" id="contact">
    <div className="contact-top"><span className="eyebrow">04 / THE NEXT GOOD THING</span><span className="mono">LET’S CONNECT THE DOTS</span></div>
    <div className="contact-layout">
      <div>
        <h2>Have a<br />wild idea<span>?</span></h2>
        <p>{profile.availability}</p>
        <a className="pill-button dark" href={`mailto:${profile.email}`}>Make a connection <Plus /></a>
        <div className="contact-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copy}>Copy email</button>
          {profile.phone && <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>}
          {profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}
          {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {profile.resume && <a href={profile.resume}>Résumé</a>}
        </div>
      </div>
      <form className="contact-form" aria-label="Send Aditya a message" action={`https://formsubmit.co/${profile.email}`} method="POST" aria-describedby="contact-delivery-note">
        <span className="mono">GOOD THINGS START WITH A CONVERSATION.</span>
        <input type="hidden" name="_subject" value="New message from Aditya’s portfolio" />
        <input type="hidden" name="_template" value="table" />
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" name="name" required maxLength={100} placeholder="A fellow curious human" autoComplete="name" />
        <label htmlFor="contact-email">Your email</label>
        <input id="contact-email" name="email" type="email" required maxLength={254} placeholder="you@example.com" autoComplete="email" />
        <label htmlFor="contact-message">What are you thinking?</label>
        <textarea id="contact-message" name="message" required minLength={5} maxLength={3000} rows={4} placeholder="What if we built something…" />
        <button className="send-button" type="submit">Send message<Plus /></button>
        <span className="contact-note" id="contact-delivery-note">Your message is sent to my inbox through FormSubmit. You’ll continue to its secure verification and confirmation page.</span>
      </form>
    </div>
    <div className="contact-signoff" aria-hidden="true">GOOD CODE.<span>GOOD COMPANY.</span><Spark /></div>
  </section>;
}
