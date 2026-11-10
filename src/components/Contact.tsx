import { contact, site } from "../data/content";
import CopyButton from "./CopyButton";
import Prompt from "./Prompt";
import { file } from "../lib/url";
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
        <div className="contact__email-row">
          <a className="contact__email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <CopyButton text={contact.email} label="Copy email address" />
        </div>
        <div className="contact__actions">
          <a className="btn btn--primary" href={file(site.resume)} target="_blank" rel="noopener">
            View resume
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
