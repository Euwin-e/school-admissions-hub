// Service d'envoi d'emails (simulation pour développement)
// En production, intégrer avec SendGrid, Mailgun, ou autre service SMTP

interface EmailData {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export const emailService = {
  // Simulation d'envoi d'email
  async sendEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    // En développement, on simule l'envoi
    console.log('📧 Email envoyé:', {
      to: data.to,
      subject: data.subject,
      body: data.body,
      timestamp: new Date().toISOString()
    });

    // Simulation d'un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));

    // En production, remplacer par l'appel API réel:
    // try {
    //   const response = await fetch('/api/send-email', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    //   });
    //   return await response.json();
    // } catch (error) {
    //   return { success: false, message: error.message };
    // }

    return {
      success: true,
      message: `Email envoyé avec succès à ${data.to}`
    };
  },

  // Templates d'emails
  templates: {
    validation: (firstName: string, lastName: string, schoolName: string, className: string) => ({
      subject: '🎉 Votre candidature a été validée - ISM',
      body: `
Cher/Chère ${firstName} ${lastName},

Félicitations ! 🎊

Nous avons le plaisir de vous informer que votre candidature pour l'école ${schoolName} en classe de ${className} a été **VALIDÉE** par le directeur.

Vous êtes désormais officiellement admis(e) au sein de notre établissement.

Prochaines étapes :
1. Consultez votre espace candidat pour plus d'informations
2. Préparez les documents nécessaires pour l'inscription définitive
3. Notre service administratif vous contactera prochainement

Nous sommes ravis de vous accueillir parmi nous !

Cordialement,
Le Service des Admissions
ISM - P.D.A.U

---
Cet email est généré automatiquement. Merci de ne pas répondre directement à cet email.
      `.trim(),
      isHtml: false
    }),

    rejet: (firstName: string, lastName: string, schoolName: string, reason: string) => ({
      subject: '❌ Information concernant votre candidature - ISM',
      body: `
Cher/Chère ${firstName} ${lastName},

Nous vous remercions de l'intérêt que vous avez porté à notre établissement ${schoolName}.

Après étude attentive de votre dossier, nous regrettons de vous informer que votre candidature n'a pas pu être retenue cette fois-ci.

Motif de la décision :
${reason}

Nous comprenons que cette nouvelle puisse être décevante et nous vous souhaitons plein succès dans vos projets futurs.

Votre dossier reste conservé dans nos archives et nous restons à votre disposition pour toute information complémentaire.

Cordialement,
Le Service des Admissions
ISM - P.D.A.U

---
Cet email est généré automatiquement. Merci de ne pas répondre directement à cet email.
      `.trim(),
      isHtml: false
    })
  }
};
