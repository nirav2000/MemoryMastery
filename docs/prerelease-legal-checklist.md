# Pre-release legal checklist

The public app now contains substantive terms of use, privacy and cookie/storage notices. This maintainer file records the matters that still require operator confirmation before a commercial launch. It is not shown to learners and is not a substitute for advice from a qualified lawyer in the operator’s jurisdiction.

## Commercial-release blockers

- Confirm the operator’s full legal name, legal form, geographic/service address and company or charity registration details, then add them to the terms and privacy controller section where legally required.
- Confirm that `myaeixa@gmail.com` is the monitored legal/privacy contact or replace it with a domain mailbox.
- Confirm the governing law and consumer-dispute forum. The current terms use England and Wales while preserving mandatory local consumer rights.
- Complete a data-flow and retention review covering GitHub Pages, Firebase Authentication, Firestore, Google sign-in, phone authentication and reCAPTCHA.
- Put current data-processing agreements and international-transfer safeguards in place with each processor.
- Confirm whether UK ICO registration or a data-protection fee is required and add the registration number if applicable.
- Add a self-service cloud-backup/account deletion flow or document and test the manual deletion request procedure and response time.
- Decide the intended minimum user age and implement verifiable parental consent if the service will knowingly serve children who cannot consent themselves.
- Run a production cookie/storage scan. If any non-essential storage is introduced, add a consent mechanism before it is set.
- Confirm the repository licence and ownership or permission for the curriculum, PDF, illustrations and archived third-party material.
- Review consumer cancellation, payment, subscription, refund and pricing terms before introducing any paid feature.
- Complete an accessibility audit and publish an accessibility statement if required for the target market.
- Set a review owner and review date for all three notices after any material product, provider or data-use change.

## Release evidence to retain

- Dated copies of the published legal notices.
- Processor contracts and transfer assessments.
- Cookie/storage scan results.
- Security and Firestore-rules test results.
- Records of privacy requests, identity verification, action taken and response dates.
