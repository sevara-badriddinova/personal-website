import { contact, site } from "../data/content";
import Prompt from "./Prompt";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="wrap contact">
        <Prompt command="mail sevara" />
        <h2 id="contact-title" className="contact__title">
          Say hi.
        </h2>
        <p className="contact__lead">
          Want to talk about backend systems, payments or something I wrote? Email is the fastest way to reach me.
        </p>
        <a className="contact__email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <div className="contact__actions">
          <a className="btn btn--primary" href={site.resume} target="_blank" rel="noopener">
            Download resume
          </a>
          <a className="btn btn--ghost" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn<span aria-hidden="true">&nbsp;↗</span>
          </a>
          <a className="btn btn--ghost" href={contact.github} target="_blank" rel="noopener noreferrer">
            GitHub<span aria-hidden="true">&nbsp;↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
