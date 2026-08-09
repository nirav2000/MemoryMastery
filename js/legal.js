const CONTACT_EMAIL = 'myaeixa@gmail.com';
const LAST_UPDATED = '9 August 2026';

const notices = {
  terms: {
    title: 'Terms of use',
    intro: 'These terms govern your use of Memory Mastery. By using the service, you agree to them.',
    sections: [
      ['The service', ['Memory Mastery provides self-directed memory practice, learning materials, local progress storage and optional account-based synchronisation. It is provided by the Memory Mastery project.']],
      ['Who may use it', ['You must be legally able to agree to these terms. If local law requires a parent or guardian to consent for you, use the service only with that consent.']],
      ['Your account and material', ['You are responsible for access to your sign-in account and for the material you enter. You retain ownership of your material and give Memory Mastery only the permission needed to store, process and synchronise it for you.', 'Do not enter unlawful material, another person’s confidential information without permission, real passwords, or information that must be kept in a specialist safety-critical system.']],
      ['Acceptable use', ['Do not misuse the service, interfere with its operation, attempt unauthorised access, evade security controls, upload malicious code, or use it to violate another person’s rights.']],
      ['Learning and safety', ['Memory techniques and scores are educational tools, not medical, psychological, legal or professional advice. Do not rely on memory alone for medication, allergies, emergencies, authentication credentials or other safety-critical information.']],
      ['Intellectual property', ['The application, curriculum and supplied materials are protected by applicable intellectual-property laws. You may use them personally through the service, but may not sell, republish or create a competing copy unless a repository licence expressly permits it.']],
      ['Availability and changes', ['The service may change, be suspended or stop. We will take reasonable care but do not promise uninterrupted or error-free availability. Export important progress regularly. Material changes to these terms will be dated on this page.']],
      ['Liability', ['Nothing in these terms excludes liability that cannot lawfully be excluded, including liability for fraud or for death or personal injury caused by negligence. Subject to that, Memory Mastery is not responsible for losses that were not reasonably foreseeable, for loss caused by misuse, or for loss of locally stored data after browser storage is cleared.']],
      ['Ending use and governing law', ['You may stop using the service at any time. We may restrict access where reasonably necessary to protect users, the service or the law. These terms are governed by the laws of England and Wales, without removing any mandatory consumer protection that applies where you live.']],
      ['Contact', [`Questions about these terms can be sent to ${CONTACT_EMAIL}.`]]
    ]
  },
  privacy: {
    title: 'Privacy notice',
    intro: 'This notice explains how Memory Mastery handles personal data and the choices available to you.',
    sections: [
      ['Controller and contact', [`The Memory Mastery project is the controller for account backups stored for this service. Contact ${CONTACT_EMAIL} for privacy questions or rights requests.`]],
      ['Data we handle', ['Guest progress, settings and notes are stored in your browser. If you sign in, we receive your Firebase user identifier and, depending on the method, your email address, display name or phone number. Your app state may include scores, reviews, projects, mnemonic material, notes and preferences that you choose to save.', 'GitHub Pages, Firebase, Google sign-in and reCAPTCHA may also process device, network, authentication and security information under their own notices.']],
      ['Why we use it', ['We process account and backup data to provide the sync service you request and perform our agreement with you. We process limited security and operational information where necessary for our legitimate interests in protecting and maintaining the service. We do not sell personal data or use app content for advertising.']],
      ['Where data is stored', ['Guest data remains in browser storage unless you export or sign in. Signed-in backups are stored in Firebase under your authenticated user ID. Hosting and authentication providers may process data outside the UK; where required, their contractual transfer safeguards apply.']],
      ['Retention and deletion', ['Browser data remains until you erase it in Settings, clear site data or close a private-browsing session. Cloud backup data remains while the sync account is used or until deletion is requested. Export data before deletion if you want to retain a copy.', `To request deletion of a cloud backup or account-linked data, email ${CONTACT_EMAIL} from the address connected to the account. We may retain limited records where legally required or necessary to resolve security issues.`]],
      ['Sharing', ['We share data only with service providers needed to host, authenticate, protect and synchronise Memory Mastery, or where law requires it. Principal providers are GitHub Pages and Google Firebase, including Firebase Authentication, Firestore and reCAPTCHA.']],
      ['Your rights', ['Depending on applicable law, you may ask for access, correction, deletion, restriction, portability or objection, and may withdraw consent where processing relies on consent. We may need to verify your identity. You may complain to the UK Information Commissioner’s Office or your local data-protection authority.']],
      ['Security and children', ['We use authenticated, user-isolated cloud records and browser security controls, but no online service can guarantee absolute security. Memory Mastery is not directed specifically at children and does not knowingly request age data; a parent or guardian should supervise use where local law requires it.']],
      ['Changes and contact', [`We will date material changes to this notice. Contact ${CONTACT_EMAIL} with questions, requests or complaints.`]]
    ]
  },
  cookies: {
    title: 'Cookie and storage notice',
    intro: 'Memory Mastery does not use advertising cookies or a separate behavioural-analytics tracker.',
    sections: [
      ['Storage used by the app', ['Local storage keeps guest progress, notes, preferences and the current application state. Session storage keeps temporary interface and archive-access state. These are necessary to provide features you request.']],
      ['Authentication storage', ['If you choose to sign in, Firebase Authentication, Google sign-in, phone verification and reCAPTCHA may set cookies or use similar browser storage for authentication, fraud prevention and session security. Their duration is controlled by the provider and your browser settings.']],
      ['Your choices', ['You can use the core learning experience without signing in. You can erase local app data in Settings or through browser controls. Blocking necessary storage may prevent progress saving, sign-in, cloud sync or security checks from working.']],
      ['Changes and contact', [`We will update this notice if storage purposes change. Contact ${CONTACT_EMAIL} with questions.`]]
    ]
  }
};

function linkContact(text, escapeHTML) {
  const safe = escapeHTML(text);
  return safe.replaceAll(CONTACT_EMAIL, `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`);
}

export function legalNotice(kind, escapeHTML) {
  const notice = notices[kind] || notices.terms;
  const sections = notice.sections.map(([heading, paragraphs]) => `<section class="legal-section"><h2>${escapeHTML(heading)}</h2>${paragraphs.map(text => `<p>${linkContact(text, escapeHTML)}</p>`).join('')}</section>`).join('');
  return { title: notice.title, body: `<div class="legal-copy"><p class="lead">${escapeHTML(notice.intro)}</p><p class="muted">Last updated: ${LAST_UPDATED}</p>${sections}</div>` };
}
