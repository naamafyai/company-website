document.addEventListener('DOMContentLoaded', () => {
  const serviceMap = {
    'data-engineering.html': 'Data Engineering',
    'business-intelligence.html': 'Business Intelligence',
    'ai-automation.html': 'AI & Automation',
    'web-development.html': 'Web Development',
    'custom-software.html': 'Custom Software'
  };

  const pageService = serviceMap[window.location.pathname.split('/').pop()] || 'General Consulting';

  const modalMarkup = `
    <div class="cta-modal-overlay" id="ctaModal" aria-hidden="true">
      <div class="cta-modal">
        <button class="cta-modal-close" id="ctaModalClose" aria-label="Close form">
          <span aria-hidden="true">×</span>
        </button>
        <div class="cta-modal-head">
          <span class="cta-modal-kicker">NaamaFy AI Consultation</span>
          <h3>Tell us what you need</h3>
        </div>
        <form id="ctaForm" class="cta-form" method="POST" action="https://formsubmit.co/contact@naamafyai.com">
          <input type="hidden" name="_subject" value="NaamaFy AI Website Enquiry">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="page" id="ctaPage" value="">
          <input type="hidden" name="buttonText" id="ctaButtonText" value="">

          <div class="cta-modal-grid">
            <label class="cta-field cta-field-wide">
              <span class="cta-label">What are you interested in?</span>
              <textarea id="ctaInterest" name="interest" placeholder="Tell us about your challenge or opportunity" required></textarea>
            </label>
          </div>
          <div class="cta-modal-grid two-columns">
            <label class="cta-field">
              <span class="cta-label">Your industry type</span>
              <input id="ctaIndustry" name="industryType" type="text" placeholder="e.g. Retail, Logistics" required />
            </label>
            <label class="cta-field">
              <span class="cta-label">Service you are looking for</span>
              <select id="ctaService" name="service" required>
                <option value="Data Engineering">Data Engineering</option>
                <option value="Business Intelligence">Business Intelligence</option>
                <option value="AI & Automation">AI & Automation</option>
                <option value="Web Development">Web Development</option>
                <option value="Custom Software">Custom Software</option>
                <option value="General Consulting">General Consulting</option>
              </select>
            </label>
          </div>
          <div class="cta-modal-grid two-columns">
            <label class="cta-field">
              <span class="cta-label">Name</span>
              <input id="ctaName" name="name" type="text" placeholder="Your name" />
            </label>
            <label class="cta-field">
              <span class="cta-label">Email address</span>
              <input id="ctaEmail" name="email" type="email" placeholder="name@company.com" required />
            </label>
          </div>
          <div class="cta-modal-grid">
            <label class="cta-field">
              <span class="cta-label">Company</span>
              <input id="ctaCompany" name="company" type="text" placeholder="Company or team" />
            </label>
          </div>
          <div class="cta-form-actions">
            <button type="button" class="btn btn-secondary" id="ctaCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
          <div class="cta-form-status" id="ctaFormStatus" aria-live="polite"></div>
        </form>
      </div>
    </div>`;

  if (!document.getElementById('ctaModal')) {
    document.body.insertAdjacentHTML('beforeend', modalMarkup);
  }

  const modal = document.getElementById('ctaModal');
  const form = document.getElementById('ctaForm');
  const interest = document.getElementById('ctaInterest');
  const industry = document.getElementById('ctaIndustry');
  const service = document.getElementById('ctaService');
  const nameField = document.getElementById('ctaName');
  const email = document.getElementById('ctaEmail');
  const company = document.getElementById('ctaCompany');
  const status = document.getElementById('ctaFormStatus');
  const close = document.getElementById('ctaModalClose');
  const cancel = document.getElementById('ctaCancel');
  const serviceSelect = document.getElementById('ctaService');
  const pageField = document.getElementById('ctaPage');
  const buttonTextField = document.getElementById('ctaButtonText');

  serviceSelect.value = pageService;
  pageField.value = window.location.pathname;

  const openModal = (source) => {
    const pageButtonService = source && source.service ? source.service : pageService;
    if (pageButtonService) {
      service.value = pageButtonService;
    }

    buttonTextField.value = source && source.text ? source.text.trim() : 'Book a Consultation';

    const intentMap = {
      'Book a Free Consultation': 'Free consultation request',
      'Book a Consultation': 'Consultation request',
      'Talk to us about your data': 'Data engineering consultation',
      'See what a dashboard could show you': 'Dashboard and BI consultation',
      'Show me what to automate first': 'AI automation consultation',
      'Get a site audit': 'Website audit request',
      'Describe the gap you\'re working around': 'Custom software consultation'
    };

    const sourceText = source && source.text ? source.text.trim() : '';
    const sourceInterest = intentMap[sourceText] || 'Business technology consultation';
    if (!interest.value) {
      interest.value = sourceInterest;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(() => interest.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    status.textContent = '';
    form.reset();
    serviceSelect.value = pageService;
  };

  close.addEventListener('click', closeModal);
  cancel.addEventListener('click', closeModal);

  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  const allowedText = new Set([
    'Book a Free Consultation',
    'Book a Consultation',
    'Talk to us about your data',
    'See what a dashboard could show you',
    'Show me what to automate first',
    'Get a site audit',
    'Describe the gap you\'re working around'
  ]);

  document.querySelectorAll('a').forEach(link => {
    const linkText = (link.textContent || '').trim();
    if (!allowedText.has(linkText)) return;

    link.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openModal({ text: linkText, service: pageService });
    });
  });

  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      return;
    }

    status.textContent = 'Sending your request...';
    status.classList.add('loading');

    service.value = service.value || pageService;
    industry.value = industry.value || 'General';
    pageField.value = window.location.pathname;
    buttonTextField.value = buttonTextField.value || 'Book a Consultation';
  });
});
