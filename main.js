/**
 * ELITETRADE SOLUTIONS - Interactive Engine
 * Handles Navigation, Quote Simulator, Service Filtering,
 * Technical Sheets Modal, and Direct WhatsApp Integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Interactive Lead-time & Freight/Procurement Simulator
  const simForm = document.getElementById('simulatorForm');
  const simOutput = document.getElementById('simulatorOutput');
  const leadtimeResult = document.getElementById('leadtimeResult');
  const simWhatsappBtn = document.getElementById('simWhatsappBtn');

  const transitData = {
    'maritimo_fcl': {
      'china': { days: '32 a 40 dias', note: 'Porto de Luanda (Terminal Sogester / 20 & 40ft)' },
      'portugal': { days: '16 a 24 dias', note: 'Ligação regular Lisboa/Leixões - Luanda' },
      'africasul': { days: '8 a 14 dias', note: 'Rotas Durban/Cape Town para Luanda' },
      'dubai': { days: '25 a 35 dias', note: 'Hub Jebel Ali para Porto de Luanda' },
      'brasil': { days: '20 a 28 dias', note: 'Santos/Paranaguá para Luanda' },
      'eua': { days: '28 a 38 dias', note: 'Houston/Nova Iorque para Luanda' },
      'default': { days: '25 a 35 dias', note: 'Rota marítima consolidada' }
    },
    'maritimo_lcl': {
      'china': { days: '38 a 48 dias', note: 'Consolidação LCL + Desova em armazém alfandegado' },
      'portugal': { days: '20 a 28 dias', note: 'Grupagem regular semanal' },
      'africasul': { days: '12 a 18 dias', note: 'Carga fracionada marítima' },
      'dubai': { days: '30 a 40 dias', note: 'Hub consolidado' },
      'brasil': { days: '25 a 34 dias', note: 'Carga fracionada LCL' },
      'eua': { days: '32 a 42 dias', note: 'Grupagem marítima' },
      'default': { days: '30 a 42 dias', note: 'Carga fracionada LCL' }
    },
    'aereo': {
      'china': { days: '4 a 7 dias úteis', note: 'Aeroporto Internacional 4 de Fevereiro / Luanda' },
      'portugal': { days: '2 a 4 dias úteis', note: 'Voo direto Lisboa - Luanda' },
      'africasul': { days: '2 a 3 dias úteis', note: 'Conexão Johannesburg - Luanda diária' },
      'dubai': { days: '3 a 5 dias úteis', note: 'Conexão DXB - LAD com alto volume' },
      'brasil': { days: '3 a 5 dias úteis', note: 'São Paulo - Luanda' },
      'eua': { days: '4 a 6 dias úteis', note: 'Rotas transatlânticas prioritárias' },
      'default': { days: '3 a 6 dias úteis', note: 'Frete aéreo expresso' }
    },
    'terrestre': {
      'africasul': { days: '6 a 10 dias', note: 'Corredor rodoviário África Austral via Namíbia/Santa Clara' },
      'default': { days: 'Sob consulta de rota', note: 'Transporte rodoviário interprovincial em Angola' }
    },
    'adr': {
      'china': { days: '40 a 50 dias', note: 'Cargas perigosas/químicas com documentação IMO/ADR completa' },
      'portugal': { days: '22 a 30 dias', note: 'Classificação ADR e licença marítima' },
      'default': { days: '30 a 45 dias', note: 'Manuseamento especializado de produtos perigosos' }
    }
  };

  if (simForm) {
    simForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('simModal').value;
      const origin = document.getElementById('simOrigin').value;
      const category = document.getElementById('simCategory').value;
      const volume = document.getElementById('simVolume').value || 'Não especificado';

      const modalInfo = transitData[modal] || transitData['maritimo_fcl'];
      const routeInfo = modalInfo[origin] || modalInfo['default'] || { days: '15 a 25 dias', note: 'Estimativa sob consulta técnica' };

      const modalLabels = {
        'maritimo_fcl': 'Marítimo FCL (Contentor Completo)',
        'maritimo_lcl': 'Marítimo LCL (Carga Fracionada)',
        'aereo': 'Aéreo Expresso Internacional',
        'terrestre': 'Terrestre / Rodoviário',
        'adr': 'Cargas Especiais & ADR (Perigosas)'
      };

      const originLabels = {
        'china': 'China / Ásia',
        'portugal': 'Portugal / Europa',
        'africasul': 'África do Sul / Região SADC',
        'dubai': 'Emirados Árabes (Dubai)',
        'brasil': 'Brasil / América do Sul',
        'eua': 'Estados Unidos / América do Norte'
      };

      const modalName = modalLabels[modal] || modal;
      const originName = originLabels[origin] || origin;

      leadtimeResult.innerHTML = `
        <div style="margin-bottom: 0.35rem;">
          <strong style="color: var(--primary-navy); font-size: 1.15rem;">Estimativa de Trânsito: ${routeInfo.days}</strong>
        </div>
        <div style="font-size: 0.88rem; color: var(--neutral-600);">
          Rota: <strong>${originName} &rarr; Luanda, Angola</strong> | Modal: <strong>${modalName}</strong><br>
          <span style="color: var(--gold-hover);"><i class="fas fa-info-circle"></i> ${routeInfo.note}</span>
        </div>
      `;

      simOutput.classList.add('active');
      simOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Build WhatsApp Link
      const waText = encodeURIComponent(
        `Olá EliteTrade Solutions! Gostaria de uma cotação formal com base na simulação do site:\n` +
        `• Modalidade: ${modalName}\n` +
        `• Origem: ${originName}\n` +
        `• Destino: Luanda, Angola\n` +
        `• Segmento: ${category}\n` +
        `• Estimativa de Carga: ${volume}\n\n` +
        `Por favor, enviem os detalhes e proposta comercial.`
      );
      simWhatsappBtn.href = `https://wa.me/244936954060?text=${waText}`;
    });
  }

  // 4. Services Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Product Specs Modal
  const modalOverlay = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalBody = document.getElementById('modalProductContent');
  const modalClose = document.getElementById('modalCloseBtn');

  const productData = {
    'absorbents_boom': {
      title: 'Booms Absorventes de Óleo (BZ10-001-02)',
      category: 'Industrial Absorbents • Contenção Marítima e Terrestre',
      pdf: './ficha-tecnica-absorventes-elite.pdf',
      pdfName: 'Ficha_Tecnica_Booms_Absorventes_EliteTrade.pdf',
      specs: [
        { label: 'Código', val: 'BZ10-001-02' },
        { label: 'Dimensões', val: '4 Metros x 125 Milímetros' },
        { label: 'Embalagem', val: '2 Unidades por saco (2/Bag)' },
        { label: 'Propriedade', val: 'Absorve óleos e hidrocarbonetos; Repele totalmente a água' },
        { label: 'Resistência', val: 'Heavy Duty (Líquidos pesados, óleos combustíveis e crude)' },
        { label: 'Aplicação', val: 'Contenção em portos, plataformas offshore, refinarias e tanques industriais' },
        { label: 'Opções', val: 'Disponível em polipropileno com cabo e fita reforçada que repele água' }
      ]
    },
    'absorbents_pillow': {
      title: 'Almofadas Absorventes (FIL-001-01)',
      category: 'Industrial Absorbents • Filtragem e Absorção Pontual',
      pdf: './ficha-tecnica-absorventes-elite.pdf',
      pdfName: 'Ficha_Tecnica_Almofadas_Absorventes_EliteTrade.pdf',
      specs: [
        { label: 'Código', val: 'FIL-001-01' },
        { label: 'Dimensões', val: '400mm x 400mm' },
        { label: 'Embalagem', val: '10 Unidades por saco (10/Bag)' },
        { label: 'Material', val: 'Polipropileno virgem de alta densidade absorvente' },
        { label: 'Modelos', val: 'Versão Universal (líquidos gerais) e Oil Only (hidrocarbonetos)' },
        { label: 'Aplicação', val: 'Uso terrestre, canaletas, oficinas mecânicas, contenção de vazamentos industriais' }
      ]
    },
    'absorbents_mat': {
      title: 'Mantas Absorventes de Óleo (OIL-MAT-001)',
      category: 'Industrial Absorbents • Limpeza e Manutenção Rápida',
      pdf: './ficha-tecnica-absorventes-elite.pdf',
      pdfName: 'Ficha_Tecnica_Mantas_Absorventes_EliteTrade.pdf',
      specs: [
        { label: 'Código', val: 'OIL-MAT-001' },
        { label: 'Dimensões', val: '42cm x 51cm' },
        { label: 'Embalagem', val: '100 Unidades por caixa/fardo' },
        { label: 'Capacidade', val: 'Light Duty para hidrocarbonetos e derivados do petróleo' },
        { label: 'Comportamento', val: 'Hidrofóbico (não absorve água, absorve apenas óleos e combustíveis)' },
        { label: 'Aplicação', val: 'Bancadas industriais, limpeza de peças em mineração, navios e oficina' }
      ]
    },
    'arejador_universal': {
      title: 'Arejador de Torneira Universal (ATU-01)',
      category: 'Acessórios Hidrossanitários • Redução do Consumo de Água',
      pdf: './ficha-tecnica-arejador-universal.pdf',
      pdfName: 'Ficha_Tecnica_Arejador_Universal_EliteTrade.pdf',
      specs: [
        { label: 'Modelo', val: 'ATU-01 / Código ATU-001' },
        { label: 'Lote Padrão', val: '200 Unidades' },
        { label: 'Função Principal', val: 'Mistura ar ao jato de água gerando economia hídrica de até 40%' },
        { label: 'Desempenho', val: 'Fluxo uniforme e contínuo, eliminação de salpicos' },
        { label: 'Compatibilidade', val: 'Universal para a maioria das torneiras domésticas e comerciais' },
        { label: 'Impacto ESG', val: 'Preservação de recursos hídricos e eficiência em instalações empresariais' }
      ]
    },
    'chuveiro_smart': {
      title: 'Chuveiro Smart com Esferas Minerais (SHM-01)',
      category: 'Acessórios Hidrossanitários de Alta Eficiência',
      pdf: './ficha-tecnica-chuveiro-smart.pdf',
      pdfName: 'Ficha_Tecnica_Chuveiro_Smart_EliteTrade.pdf',
      specs: [
        { label: 'Modelo', val: 'SHM-01' },
        { label: 'Lote Padrão', val: '100 Unidades' },
        { label: 'Tecnologia', val: 'Esferas minerais de alta eficiência para filtragem de impurezas' },
        { label: 'Pressão', val: 'Jato de alta pressão com microperfurações a laser' },
        { label: 'Benefícios', val: 'Economia significativa de água, filtragem de cloro e partículas, sensação relaxante' },
        { label: 'Acessórios', val: 'Acompanha kits de refil de esferas minerais bioativas' }
      ]
    }
  };

  document.querySelectorAll('.open-spec-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pKey = btn.getAttribute('data-product');
      const p = productData[pKey];
      if (!p) return;

      modalTitle.innerText = p.title;

      let html = `
        <div style="margin-bottom: 1.25rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--gold-hover); text-transform: uppercase;">
            ${p.category}
          </span>
          <p style="margin-top: 0.5rem; color: var(--neutral-600); font-size: 0.95rem;">
            Ficha técnica oficial emitida pela <strong>EliteTrade Solutions</strong> para fornecimento empresarial e industrial em Angola.
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem;">
          <tbody>
      `;

      p.specs.forEach(s => {
        html += `
          <tr style="border-bottom: 1px solid var(--neutral-200);">
            <td style="padding: 0.65rem 0.5rem; font-weight: 700; color: var(--primary-navy); width: 35%;">${s.label}:</td>
            <td style="padding: 0.65rem 0.5rem; color: var(--neutral-700);">${s.val}</td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.25rem;">
          <a href="${p.pdf}" download="${p.pdfName}" class="btn btn-pdf" style="flex: 1; justify-content: center;">
            <i class="fas fa-file-pdf"></i> Baixar PDF Oficial
          </a>
          <a href="https://wa.me/244936954060?text=${encodeURIComponent('Olá! Gostaria de solicitar cotação formal para o produto: ' + p.title)}" 
             target="_blank" class="btn btn-primary" style="flex: 1; justify-content: center;">
            <i class="fab fa-whatsapp"></i> Cotação via WhatsApp
          </a>
          <button onclick="document.getElementById('productModal').classList.remove('active')" 
                  class="btn btn-outline-blue">Fechar</button>
        </div>
      `;

      modalBody.innerHTML = html;
      modalOverlay.classList.add('active');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // 6. Contact Form Processing & Feedback
  const contactForm = document.getElementById('corporateContactForm');
  const toastMsg = document.getElementById('toastMsg');
  const successModal = document.getElementById('contactSuccessModal');
  const btnModalWhatsApp = document.getElementById('btnModalWhatsApp');
  const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');

  if (btnCloseSuccessModal && successModal) {
    btnCloseSuccessModal.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cName').value.trim();
      const company = document.getElementById('cCompany').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const phone = document.getElementById('cPhone').value.trim();
      const service = document.getElementById('cService').value;
      const message = document.getElementById('cMessage').value.trim();

      if (!name || !email || !message) {
        alert('Por favor, preencha todos os campos obrigatórios (Nome, Email e Mensagem).');
        return;
      }

      // Show toast
      if (toastMsg) {
        toastMsg.classList.add('show');
        setTimeout(() => {
          toastMsg.classList.remove('show');
        }, 5000);
      }

      // Format WhatsApp query text
      const waDirectText = encodeURIComponent(
        `Olá EliteTrade Solutions!\nNova solicitação de proposta:\n` +
        `• Nome: ${name}\n` +
        `• Empresa: ${company || 'Particular'}\n` +
        `• Contacto: ${phone}\n` +
        `• Email: ${email}\n` +
        `• Serviço: ${service}\n` +
        `• Mensagem: ${message}`
      );

      // Open elegant success modal with WhatsApp option
      if (btnModalWhatsApp) {
        btnModalWhatsApp.href = `https://wa.me/244936954060?text=${waDirectText}`;
      }

      if (successModal) {
        successModal.classList.add('active');
      }

      contactForm.reset();
    });
  }
});
