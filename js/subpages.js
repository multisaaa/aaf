import { initHeroHeading } from './hero-heading.js?v=20260917-gsap-splittext-v3';
import { initSubpageInteractions } from './subpage-interactions.js?v=20260916-css-cleanup-v1';

const page = document.body.dataset.page;
const root = document.querySelector('[data-subpage-root]');

const arrow = '<span class="sr-only">→</span><svg aria-hidden="true" class="lucide lucide-arrow-right" fill="none" focusable="false" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
const pdfIcon = '<svg aria-hidden="true" class="lucide lucide-file-text" fill="none" focusable="false" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>';
const selectChevron = '<svg aria-hidden="true" class="lucide lucide-chevron-down" fill="none" focusable="false" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>';
const button = (label, href, secondary = false, showArrow = true) => `<a class="button ${secondary ? 'button-secondary' : 'button-primary'}" href="${href}">${label}${!secondary && showArrow ? ` ${arrow}` : ''}</a>`;
const hero = ({crumb, eyebrow, title, lead, image, alt, code, caption, showCode = false, proofs = [], actions = []}) => `
  <section class="subpage-hero page-width">
    <div>
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>/</span><span>${crumb}</span></nav>
      <p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subpage-lead">${lead}</p>
      <div class="subpage-actions">${actions.map(a => button(a[0], a[1], a[2], a[3])).join('')}</div>
    </div>
    ${image ? `<figure class="subpage-hero-media"><img src="${image}" alt="${alt}" fetchpriority="high"></figure>` : ''}
  </section>
  ${proofs.length ? `<section class="proof-bar proof-bar-compact"><div class="page-width proof-bar-inner">${proofs.map(x => `<span>${x}</span>`).join('')}</div></section>` : ''}`;

const intro = (eyebrow, title, copy) => `<div class="section-intro"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div><p class="section-copy">${copy}</p></div>`;
const gallery = (items, two = false, className = '') => `<div class="subpage-gallery ${two ? 'two' : ''}${className ? ` ${className}` : ''}">${items.map(x => `<figure><img src="${x[0]}" alt="${x[1]}" loading="lazy"><figcaption><span>${x[3]}</span></figcaption></figure>`).join('')}</div>`;
const faqGrid = items => `<div class="faq-grid">${items.map(item => `<article><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div>`;
const coilEvidence = p => `<section class="subpage-section coil-evidence-section"><div class="page-width"><div class="coil-evidence-intro"><p class="eyebrow">${p.evidenceEyebrow}</p><h2>${p.evidenceTitle}</h2></div><div class="application-grid coil-evidence-grid">${p.gallery.map(item => `<article class="application-card coil-evidence-card"><figure class="application-actual-media"><img class="media-cover" src="${item[0]}" alt="${item[1]}" loading="lazy" decoding="async" sizes="(max-width: 820px) 100vw, 50vw"></figure><div class="card-copy"><p class="card-number">${item[3]}</p><h3>${item[4]}</h3><p>${item[5]}</p></div></article>`).join('')}</div></div></section>`;
const faqCardsSection = p => `<section class="subpage-section alt faq-cards-section"><div class="page-width"><div class="section-header"><p class="eyebrow">Common buying questions</p><h2>Information to confirm before quotation.</h2></div>${faqGrid(p.faq)}</div></section>`;
const features = (items, className = '') => `<div class="feature-grid${className ? ` ${className}` : ''}">${items.map((x,i) => `<article class="feature-card"><span class="number">${String(i + 1).padStart(2,'0')}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</div>`;
const groupRelationshipArrow = '<svg aria-hidden="true" class="lucide lucide-arrow-right" fill="none" focusable="false" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
const groupRelationship = items => `<div class="group-relationship-shell">
  <div class="group-relationship-route" aria-hidden="true"><span>From raw material</span><span class="group-relationship-route-line"></span><span>To qualified application</span></div>
  <ol class="group-relationship-flow" aria-label="AAF supply and customer qualification pathway">${items.map((x,i) => `<li class="group-relationship-step">
    <div class="group-relationship-node">
      <span aria-hidden="true" class="group-relationship-marker"><span>${String(i + 1).padStart(2,'0')}</span></span>
      ${i < items.length - 1 ? `<span aria-hidden="true" class="group-relationship-arrow">${groupRelationshipArrow}</span>` : ''}
    </div>
    <div class="group-relationship-card"><p class="group-relationship-step-label">${x[2]}</p><h3>${x[0]}</h3><p>${x[1]}</p></div>
  </li>`).join('')}</ol>
</div>`;
const groupSupplyStory = () => `<div class="group-supply-story">
  <div class="group-supply-story-grid">
    <div class="group-supply-story-copy">
      <p class="eyebrow eyebrow-light">Part of SHAIYO TRIPLE A GROUP</p>
      <h2>From plantation-grown eucalyptus to application-ready hardboard.</h2>
      <p>AAF manufactures high-density hardboard with one smooth face and one mesh-pattern back. The wet-process manufacturing route uses the wood fibre's natural lignin as the primary bonding mechanism.</p>
      <p>Raw sheets, rectangular cut-to-size panels and profile-cut components are available for glass bottle layer pads, steel and aluminium coil packaging, automotive components, and building or furniture applications. Technical data, samples and application review are available to support customer qualification.</p>
    </div>
    <figure class="group-supply-story-media">
      <img src="../assets/images/company/com-05-shaiyo-aaa-woodchip-supply.webp" alt="Woodchip storage facility supporting AAF raw-material supply continuity" loading="lazy" decoding="async">
      <figcaption><strong>Woodchip production and export experience supporting supply continuity</strong></figcaption>
    </figure>
  </div>
  <ol class="group-supply-proof-grid" aria-label="AAF supply and manufacturing proof points">
    ${[['Plantation-grown eucalyptus','Sourced in Thailand.'],['Woodchip supply experience','Production and export knowledge.'],['Wet-process hardboard','Raw sheets and drawing-controlled cut components.'],['International shipment access','Connected to major Thai seaports.']].map((x,i) => `<li class="group-supply-proof"><span class="group-supply-proof-number">${String(i + 1).padStart(2,'0')}</span><div><h3>${x[0]}</h3><p>${x[1]}</p></div></li>`).join('')}
  </ol>
</div>`;
const table = (headers, rows) => `<div class="table-wrap data-table-wrap"><table class="spec-table data-table" data-columns="${headers.length}"><thead><tr>${headers.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((x,i) => `<td data-label="${headers[i]}">${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const sourceTable = rows => table(['Requirement','Published value','Unit','Test / inspection'], rows);
const faqs = items => `<div class="faq-list">${items.map(x => `<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('')}</div>`;
const cta = (eyebrow, title, label = 'Open technical enquiry', href = 'request-a-quote.html') => `<section class="cta-section"><div class="page-width cta-inner"><div><p class="eyebrow eyebrow-light">${eyebrow}</p><h2>${title}</h2></div><a class="button button-light" href="${href}">${label} ${arrow}</a></div></section>`;
const section = (content, tone = '', id = '') => `<section class="subpage-section ${tone}"${id ? ` id="${id}"` : ''}><div class="page-width">${content}</div></section>`;
const materialReference = () => `<div class="material-reference">
  <figure><img src="../assets/images/material/mat-05-hardboard-thickness-reference.webp" alt="Mesh-pattern hardboard surface shown with a measuring scale for visual reference" loading="lazy" decoding="async" sizes="(max-width: 820px) 100vw, 45vw"></figure>
  <div><p class="eyebrow">Visual reference</p><h3>Surface scale and pattern detail</h3><p>The measuring scale provides a visual reference for the repeating mesh pattern. Product thickness and tolerance must still be confirmed from the grade-specific technical data sheet.</p><a class="text-link" href="technical-resources.html">Open technical resources ${arrow}</a></div>
</div>`;

const solutionPages = {
  'glass-bottle-layer-pads': {
    hero: {crumb:'Solutions / Glass bottle layer pads', eyebrow:'Industrial glass packaging', title:'Cut-to-Size Hardboard Layer Pads for Glass Bottle Operations', lead:'Consistent, high-density wet-process hardboard supplied to the dimensions and packing requirements of industrial glass operations.', image:'../assets/images/glass/gls-01-hardboard-glass-bottle-layer-pad.webp', alt:'Complete pallet of glass bottles separated by hardboard layer pads', code:'GLS-01', caption:'Layer pads positioned between glass-bottle tiers', proofs:['Cut-to-size supply','Dimensional review','Export packing','Sample & line-trial support'], actions:[['Request a sample','request-a-quote.html'],['View technical resources','#glass-data',true,false]]},
    inputsAnchor:'glass-data', inputsLabel:'Glass layer-pad data',
    gallery: [['../assets/images/glass/gls-02-complete-glass-bottle-pallet.webp','Close-up of a hardboard layer pad between two tiers of glass bottles','GLS-02','Board edge and bottle contact detail'],['../assets/images/glass/gls-03-layer-pad-sheet-and-corners.webp','Stacked hardboard layer pads prepared on a pallet','','Cut layer-pad sheets prepared for shipment'],['../assets/images/glass/gls-04-layer-pad-edge-corner-detail.webp','Close-up of the rounded corner and cut edge of a hardboard layer pad','','Rounded corner and cut-edge detail']],
    galleryTitle:'The board supports the bottle tier above while separating the tier below.', galleryCopy:'The close-up shows the hardboard edge, rounded corner and contact relationship within the stacked bottle system.',
    table:[['Nominal thickness','1.6–6.0 or per drawing','mm','EN 324-1'],['Length × width','Per approved customer drawing','mm','Dimensional inspection'],['Cut-size tolerance','±2.0 unless otherwise agreed','mm','Dimensional inspection'],['Corner radius','Per approved customer drawing','mm','Radius template / dimensional inspection'],['Density','900–1,100','kg/m³','EN 323'],['Moisture content','4–9','%','EN 322'],['24-hour thickness swelling','≤35','%','EN 317'],['Internal bond','≥0.60','N/mm²','EN 319'],['Bending strength (MOR)','≥38 at ≤3.5 mm · ≥35 at >3.5 mm','N/mm²','EN 310'],['Flatness / warpage','≤5.0','mm/m','Internal straight-edge inspection']],
    workflow:[['Application review','Pallet pattern, dimensions, line conditions and annual usage.'],['Document match','Compare TDS, customer specification, packing and handling criteria.'],['Sample & trial','Agree sample quantity, acceptance criteria and line-trial method.'],['Approval & supply','Record the approved grade, drawing revision and commercial packing.']],
    faq:[['What information is needed for a layer-pad quotation?','Provide the pallet pattern, finished dimensions, thickness, corner detail, quantity, annual consumption, destination and any customer drawing or acceptance criteria.'],['Does AAF design the complete bottle pallet?','AAF supplies raw hardboard sheets or cut hardboard components. The customer validates the complete pallet configuration under its actual bottle, handling and line conditions.'],['Can AAF supply samples for a line trial?','Sample and line-trial requirements can be reviewed after the dimensions, grade, quantity and acceptance criteria are confirmed.']],
    cta:['Prepare a useful enquiry','Send the pallet size, sheet drawing and annual consumption.','Open glass enquiry']
  },
  'coil-packaging-components': {
    hero: {crumb:'Solutions / Coil packaging components', eyebrow:'Steel & aluminium export packaging', title:'Hardboard Components for Export Coil Packaging Systems', lead:'Dense, cut-to-size hardboard components for selected steel and aluminium coil packaging configurations.', image:'../assets/images/coil/coi-01-complete-steel-coil-package.webp', alt:'Complete steel coil package protected with hardboard components', code:'COI-01', caption:'Complete steel coil packaging system', proofs:["<strong>AAF SUPPLY SCOPE : </strong>AAF supplies hardboard sheets and cut hardboard components. Wrapping materials, strapping and complete coil-pack design remain under the customer's or packaging designer's specification."], actions:[['Discuss the component','request-a-quote.html'],['See required inputs','#engineering-inputs',true,false]]},
    inputsAnchor:'engineering-inputs', inputsLabel:'Engineering inputs',
    evidenceLayout:'cards', evidenceEyebrow:'Define the component', evidenceTitle:'A coil photograph is not enough. The buyer must see the installed position and specification.',
    gallery: [['../assets/images/coil/coi-04-side-disc-installed-position.webp','Hardboard side disc in installed position on a steel coil','COI-04','Installed position','Installed side protection','The hardboard component is shown in its actual position within the complete coil packaging system.'],['../assets/images/coil/coi-06a-coil-packaging-exploded-view.webp','Exploded view of coil packaging system','COI-06A','Exploded view','Packaging-system interfaces','The exploded view explains how the hardboard component integrates with the other protective layers.']],
    workflowEyebrow:'Material role', workflowTitle:'Drawing-controlled hardboard components within a complete coil pack.', workflowCopy:'Component type, installed position and dimensions are confirmed from the approved customer drawing. Sample approval and a packaging trial are required for a new coil configuration.', workflowLayout:'coil-workflow-grid', inputsCopy:'Providing the component position, controlled drawing and commercial requirement allows AAF to confirm capability and prepare a useful proposal.', faqLayout:'cards',
    table:[['Coil material','Steel, aluminium or coated product'],['Component type','Side ring / end disc, inner edge protector, outer edge protector or rectangular spacer'],['Installed position','Coil side, inner rim, outer rim or drawing-defined position'],['Component dimensions','OD, ID, length, width and thickness as applicable'],['Drawing control','Approved drawing number, revision and dimensional tolerance'],['Edge / surface requirement','Cut-edge quality, handling and surface-contact criteria'],['Commercial requirement','Annual volume, shipment lot, destination port and target timing']],
    workflow:[['Component options','Side rings, inner or outer edge protectors and rectangular spacers are available by drawing review.'],['Dimensional fit','OD, ID, length, width, thickness and tolerance follow the approved drawing revision.'],['Material baseline','Wet-process hardboard is available in 1.6–6.0 mm with density of 900–1,100 kg/m³.'],['Packing integration','The hardboard part is qualified within the customer’s full wrapping, cover, skid and strapping system.']],
    faq:[['Does AAF supply the complete coil packaging system?','No. AAF supplies hardboard sheets and cut components; wrapping, covers, skids, strapping and complete pack design remain under the customer or packaging designer specification.'],['Is a component drawing required?','A controlled drawing or complete dimensional requirement is needed to review the component type, installed position, tolerances and production capability.'],['Can components be reviewed for steel and aluminium coils?','Selected steel, aluminium and coated-product configurations can be reviewed against the customer drawing, contact requirements and packaging trial plan.']],
    cta:['Attach the component drawing','Tell us the coil type, part dimensions and destination port.','Open coil enquiry']
  },
  'automotive-interior-components': {
    hero: {crumb:'Solutions / Automotive interior components', eyebrow:'Automotive interior substrates', title:'Hardboard Components for Defined Interior Applications', lead:'A qualification-led page for formed or cut hardboard components supplied to controlled drawings and customer programmes.', image:'../assets/images/automotive/aut-03-component-installed-location.webp', alt:'Vehicle cutaway illustrating installed locations for automotive hardboard interior components', caption:'Representative installed locations', proofs:['<strong>CUSTOMER CONFIDENTIALITY : </strong>Programme names, vehicle models, proprietary drawings and customer-specific limits remain confidential. Public examples are customer-neutral and show only the general AAF capability.'], actions:[['Discuss the programme','request-a-quote.html?application=automotive'],['See required inputs','#automotive-data',true,false]]},
    evidence:[['../assets/images/automotive/aut-01-automotive-hardboard-component.webp','Automotive door trim component using a hardboard substrate','Automotive component','Finished trim component and the hardboard substrate integrated behind the visible surface.'],['../assets/images/automotive/aut-02-component-front-back-edge.webp','Front and reverse views of an automotive hardboard component','Front and reverse','Paired views show the finished face, shaped substrate and mounting features.'],['../assets/images/automotive/aut-03-component-installed-location.webp','Representative installed automotive hardboard component locations','Installed location','A vehicle cutaway communicates representative positions without disclosing a customer programme.']],
    componentDetail:{eyebrow:'Component construction',title:'Finished face and hardboard substrate.',copy:'The paired views show the carpet-covered finished surface and the reverse side with the shaped hardboard substrate and mounting points.',checks:['Finished carpet-facing surface','Shaped hardboard substrate','Slots and mounting points','Production component geometry'],image:'../assets/images/automotive/aut-02-component-front-back-edge.webp',alt:'Automotive interior component showing the carpet-covered face and hardboard reverse side',caption:'Finished face and hardboard reverse'},
    drawingDetail:{eyebrow:'Simplified drawing',title:'Representative component geometry.',copy:'This public-facing schematic communicates the general converted-part shape while withholding controlled dimensions and production details.',checks:['Overall component profile','Representative mounting slot','No production dimensions','No customer or programme identifiers'],image:'../assets/images/automotive/aut-04-non-confidential-component-drawing.webp',alt:'Simplified non-confidential automotive hardboard component outline',caption:'Simplified non-confidential drawing',className:'automotive-drawing'},
    machiningDetail:{eyebrow:'Machining details',title:'Precision-cut profiles, holes and slots.',copy:'The close views show repeatable shaped edges and machined attachment features used in converted automotive hardboard components.',checks:['Stacked, profile-cut components','Controlled curved edges','Circular hole detail','Elongated mounting slot'],image:'../assets/images/automotive/aut-05-machining-and-forming-details.webp',alt:'Automotive hardboard machining details showing stacked profile-cut panels, a circular hole and an elongated slot',caption:'Precision cutting and machining details',className:'automotive-machining'},
    inputsAnchor:'automotive-data', inputsLabel:'Programme inputs',
    table:[['Part category','Door-trim substrate, rear-seat backboard, luggage-floor component, parcel shelf or other interior part'],['AAF supply form','Raw sheet, cut-to-size or profile-cut hardboard component'],['Board thickness','Per approved drawing; general hardboard range 1.6–6.0 mm'],['Part geometry','Approved drawing with radii, holes, slots and critical dimensions'],['Material baseline','Density, moisture, mechanical and water-response requirements from the applicable AAF specification'],['Programme qualification','Heat, humidity, load, durability, flammability, emissions or restricted-substance tests as required'],['Required evidence','Inspection record, test report and customer-specific approval documents']],
    faq:[['Which automotive supply formats are available?','AAF can review raw hardboard sheets, rectangular cut-to-size panels and profile-cut components against an approved drawing and material requirement.'],['How is customer confidentiality handled on the website?','Public examples are customer-neutral. Programme names, vehicle models, proprietary drawings and customer-specific limits are not published.'],['What is needed before programme review?','Provide the part category, released drawing, programme stage, material and test requirements, annual volume, target timing and required approval documents.']],
    cta:['Start with a released requirement','Send the part drawing, grade requirement and annual programme volume.','Open automotive enquiry']
  },
  'building-furniture-distribution': {
    hero: {crumb:'Solutions / Building, furniture & distribution', eyebrow:'Global building & furniture markets', title:'Wet-Process Hardboard for Fabrication and Distribution', lead:'A clear route from end use and grade selection to sheet format, finishing requirement and export packing.', image:'../assets/images/building/bld-01-hardboard-furniture-application.webp', alt:'Furniture application manufactured with hardboard components', code:'BLD-01', caption:'Hardboard furniture application', proofs:['Raw hardboard sheets','Rectangular & profile cutting','25 × 2050 mm strips','Export packing plan'], actions:[['Discuss your market','request-a-quote.html'],['See buying inputs','#market-data',true,false]]},
    inputsAnchor:'market-data', inputsLabel:'Commercial & technical inputs', inputsTitle:'Give distributors enough information to request the right mix.', inputsCopy:'The table defines the minimum data needed before pricing and container planning. Availability is confirmed for the specified grade, size and destination.',
    gallery: [['../assets/images/building/bld-02-hardboard-door-interior-application.webp','Hardboard door and interior application','BLD-02','Door and interior application'],['../assets/images/building/bld-05-distribution-hardboard-bundles.webp','Hardboard bundles prepared for distribution','BLD-05','Distribution bundles'],['../assets/images/building/bld-06-hardboard-packer-strips-25x2050mm.webp','Precision-cut hardboard strips','BLD-06','25 × 2050 mm strips']],
    galleryTitle:'Actual applications, export bundles and precision-cut strips.', galleryCopy:'AAF supplies raw sheets, cut-to-size panels, profile-cut components and selected 25 × 2050 mm hardboard strips.', evidenceEyebrow:'Products & applications',
    table:[['End use','Furniture back, drawer bottom, door skin, lining, display or approved use'],['Grade','Required grade or performance criteria for the intended use'],['Product format','Raw sheet, rectangular cut-to-size, profile-cut to drawing, or selected 25 × 2050 mm strip'],['Surface','Smooth face / mesh-pattern back and any customer-side finishing requirement'],['Fabrication','AAF rectangular or profile cutting; other conversion by customer unless agreed'],['Packing','Sheets per bundle, protection, pallet / bearer and container plan'],['Destination','Country, port, applicable documents and annual requirement']],
    faqLayout:'cards',
    faq:[['Which hardboard supply formats are available?','AAF supplies raw sheets, rectangular cut-to-size panels, profile-cut components to an approved drawing and selected 25 × 2050 mm strips.'],['What are the 25 × 2050 mm strips used for?','They are offered for industrial spacer, packing-support or another customer-qualified use. Thickness, tolerance and final end use are confirmed for each enquiry.'],['How is export packing confirmed?','Bundle size, protection, bearers, identification, container plan, destination and required documents are agreed during quotation and order review.']],
    cta:['Plan the right product mix','Tell us the end use, sheet sizes, destination and annual volume.','Open market enquiry']
  }
};

const glassBottleSections = p => {
  const [detail, sheet, corner] = p.gallery;
  const galleryCard = item => `<figure class="asset-card"><img src="${item[0]}" alt="${item[1]}" loading="lazy" decoding="async"><figcaption>${item[2] ? `<strong>${item[2]}</strong>` : ''}<span>${item[3]}</span></figcaption></figure>`;
  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {'@type': 'Answer', text: answer},
    })),
  });
  return `
    <section aria-labelledby="glass-application-close-up-title" class="diagram-section">
      <div class="page-width diagram-shell home-evidence">
        <div class="diagram-grid">
          <div class="diagram-copy">
            <p class="eyebrow">Application close-up</p>
            <h2 id="glass-application-close-up-title">The board supports the bottle tier above while separating the tier below.</h2>
            <p class="diagram-copy-lead">The close-up shows the hardboard edge, rounded corner and contact relationship within the stacked bottle system.</p>
            <ul class="check-list">
              <li>Single hardboard layer visible</li>
              <li>Rounded corner for handling</li>
              <li>Board remains flat across the bottle tier</li>
              <li>Final dimensions follow the approved pallet pattern</li>
            </ul>
          </div>
          <figure class="solution-photo glass-detail-photo evidence-card">
            <img src="${detail[0]}" alt="${detail[1]}" loading="lazy" decoding="async">
            <figcaption><span>${detail[3]}</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
    <section class="page-section page-width cut-part-section">
      <div class="section-header">
        <p class="eyebrow">Cut-part evidence</p>
        <h2>Sheet preparation and corner detail.</h2>
        <p>These photographs show the supplied hardboard stack and the finished radius used for the layer-pad format.</p>
      </div>
      <div class="asset-gallery asset-gallery-two">${galleryCard(sheet)}${galleryCard(corner)}</div>
    </section>
    <section class="page-section page-width" id="glass-data">
      <div class="section-header">
        <p class="eyebrow">Glass layer-pad data</p>
        <h2>Technical baseline for quotation and qualification.</h2>
        <p>AAF supplies the hardboard sheet or cut hardboard component. Final pallet design and application performance are verified under the customer's actual bottle, pallet and handling conditions.</p>
      </div>
      ${sourceTable(p.table)}
    </section>
    <section class="qualification-section">
      <div class="page-width">
        <div class="section-header">
          <p class="eyebrow">Qualification workflow</p>
          <h2>Move from requirement to commercial supply with visible gates.</h2>
        </div>
        <div class="workflow">${p.workflow.map((item, i) => `<div><span>${String(i + 1).padStart(2, '0')}</span><b>${item[0]}</b><p>${item[1]}</p></div>`).join('')}</div>
      </div>
    </section>
    <section class="page-section page-width faq-section">
      <script type="application/ld+json">${faqSchema}</script>
      <div class="section-header">
        <p class="eyebrow">Common buying questions</p>
        <h2>Information to confirm before quotation.</h2>
      </div>
      <div class="faq-grid">${p.faq.map(item => `<article><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div>
    </section>
    ${cta(p.cta[0], p.cta[1], p.cta[2], 'request-a-quote.html?application=glass')}`;
};

const automotiveSections = p => {
  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {'@type': 'Answer', text: answer},
    })),
  });
  const detail = (item, sectionClass = '') => `<section class="automotive-detail-section ${sectionClass}"><div class="page-width automotive-detail-grid"><div class="automotive-detail-copy"><p class="eyebrow">${item.eyebrow}</p><h2>${item.title}</h2><p>${item.copy}</p><ul class="check-list">${item.checks.map(check => `<li>${check}</li>`).join('')}</ul></div><figure class="automotive-component-photo ${item.className || ''}"><img class="media-cover" src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async"><figcaption>${item.code ? `<strong>${item.code}</strong>` : ''}<span>${item.caption}</span></figcaption></figure></div></section>`;
  return `
    <section class="page-section page-width automotive-evidence-section">
      <div class="section-header"><p class="eyebrow">Application evidence</p><h2>Show the actual component, its location and the qualification path.</h2><p>Generic car photographs do not help an engineer assess fit. Each published part family needs controlled evidence.</p></div>
      <div class="automotive-evidence-grid">${p.evidence.map(item => `<article class="application-card automotive-evidence-card"><figure class="application-actual-media"><img class="media-cover" src="${item[0]}" alt="${item[1]}" loading="lazy" decoding="async" sizes="(max-width: 820px) 100vw, 33vw"></figure><div class="card-copy"><h3>${item[2]}</h3><p>${item[3]}</p></div></article>`).join('')}</div>
    </section>
    ${detail(p.componentDetail, 'automotive-component-section')}
    ${detail(p.drawingDetail, 'automotive-drawing-section')}
    ${detail(p.machiningDetail, 'automotive-machining-section')}
    <section class="page-section page-width automotive-data-section" id="${p.inputsAnchor}">
      <div class="section-header"><p class="eyebrow">Programme inputs</p><h2>Information needed for capability review and qualification.</h2><p>Serial supply requires a released drawing, agreed material baseline, sample qualification and customer-specific evidence.</p></div>
      ${table(['Required input','Information to include'], p.table)}
    </section>
    <section class="page-section page-width faq-section automotive-faq-section">
      <script type="application/ld+json">${faqSchema}</script>
      <div class="section-header"><p class="eyebrow">Common buying questions</p><h2>Information to confirm before quotation.</h2></div>
      ${faqGrid(p.faq)}
    </section>
    ${cta(p.cta[0], p.cta[1], p.cta[2], 'request-a-quote.html?application=automotive')}`;
};

const renderSolution = p => p === solutionPages['glass-bottle-layer-pads']
  ? hero(p.hero) + glassBottleSections(p)
  : p === solutionPages['automotive-interior-components']
  ? hero(p.hero) + automotiveSections(p)
  : hero(p.hero) +
    (p.evidenceLayout === 'cards' ? coilEvidence(p) : section(intro(p.evidenceEyebrow || 'Application evidence',p.galleryTitle,p.galleryCopy) + gallery(p.gallery, p.gallery.length === 2))) +
    (p.workflow ? section(intro(p.workflowEyebrow || 'Qualification workflow',p.workflowTitle || 'Move from requirement to commercial supply with visible gates.',p.workflowCopy || 'Each stage aligns the application, controlled documents, samples and commercial supply.') + features(p.workflow,p.workflowLayout),'alt') : '') +
    section(intro(p.inputsLabel || 'Technical & commercial inputs',p.inputsTitle || 'Information needed for review and quotation.',p.inputsCopy || 'Final grade, drawing, tolerance, packing and acceptance criteria are confirmed for each order.') + table(['Required input','Published value / information', ...(p.table[0].length === 4 ? ['Unit','Test / inspection'] : [])],p.table), '', p.inputsAnchor) +
    (p.faqLayout === 'cards' ? faqCardsSection(p) : section(intro('Common buying questions','Information to confirm before quotation.','Open a question to review the approved response.') + faqs(p.faq),'alt')) + cta(...p.cta);

const manufacturingSteps = [
  { id:'eucalyptus', title:'Eucalyptus raw material', image:'prc-01-eucalyptus-raw-material.webp', alt:'Plantation-grown eucalyptus trees', copy:'The journey begins with plantation-grown eucalyptus sourced in Thailand. This wood provides the fibre for the board.', result:'Eucalyptus feedstock', state:'Wood' },
  { id:'preparation', title:'Preparation', image:'prc-02-raw-material-preparation.webp', alt:'Raw-material preparation equipment at the factory', copy:'The raw material is prepared before it moves into fibre refining. This is the first step in turning the wood into board-making material.', result:'Prepared raw material', state:'Prepared wood' },
  { id:'refining', title:'Fibre refining', image:'prc-03-fibre-refining-process.webp', alt:'Equipment on the fibre refining line', copy:'The prepared wood is refined into fibres. These fibres become the material used in the wet-forming stage.', result:'Wood fibres for forming', state:'Fibres' },
  { id:'forming', title:'Wet forming', image:'prc-04-wet-forming-line.webp', alt:'A continuous sheet on the wet-forming line', copy:'The fibres are formed into a wet sheet. The material now takes on its board-like shape, ready for heat and pressure.', result:'A formed wet sheet', state:'Wet sheet' },
  { id:'pressing', title:'Heat & pressure', image:'prc-05-hardboard-hot-press.webp', alt:'The hardboard hot press on the production line', copy:'Heat and pressure consolidate the formed sheet into hardboard. Natural lignin in the wood fibre provides the primary bonding mechanism.', result:'A consolidated hardboard sheet', state:'Hardboard' },
  { id:'finishing', title:'Trimming & finishing', image:'prc-06-board-trimming-finishing.webp', alt:'Hardboard sheets passing through trimming and finishing', copy:'The board moves through trimming and finishing. Sheet edges are prepared for the next stage of inspection.', result:'Trimmed and finished sheets', state:'Finished sheet' },
  { id:'inspection', title:'Quality inspection', image:'prc-07-hardboard-quality-inspection.webp', alt:'Hardboard quality inspection at the factory', copy:'The finished board is checked against the applicable product requirements. Inspection connects the production process with the specified grade and order.', result:'Inspected boards', state:'Checked board' },
  { id:'finished-goods', title:'Finished goods', image:'prc-08-finished-goods-warehouse.webp', alt:'Stacks of finished hardboard in the warehouse', copy:'Finished boards move into storage. The production journey ends with hardboard ready for the next stage of supply.', result:'Finished goods in storage', state:'Stacked boards' },
];

const manufacturingStory = () => `
  <section class="subpage-section manufacturing-story" id="process" aria-labelledby="manufacturing-title">
    <div class="page-width">
      <div class="section-intro manufacturing-intro">
        <div><p class="eyebrow">Manufacturing story</p><h2 id="manufacturing-title">Inside the wet-process production route.</h2></div>
        <p class="section-copy">Factory photography follows the board from eucalyptus feedstock through forming, pressing, finishing, inspection and finished-goods storage.</p>
      </div>
      <div class="manufacturing-layout">
        <aside class="manufacturing-stage" aria-label="Production journey">
          <div class="manufacturing-visual" aria-hidden="true">
            <div class="manufacturing-photo">
              ${manufacturingSteps.map((s,i) => `<img data-manufacturing-image="${i}" data-src="../assets/images/process/${s.image}" alt="" decoding="async">`).join('')}
              <span class="manufacturing-photo-status">Loading photograph…</span>
              <span class="manufacturing-photo-number">01 / 08</span>
              <div class="manufacturing-photo-caption"><span>${manufacturingSteps[0].state}</span><strong>${manufacturingSteps[0].title}</strong></div>
            </div>
          </div>
          <nav class="manufacturing-navigation" aria-label="Manufacturing stages">
            <div class="manufacturing-track" aria-hidden="true"><span></span></div>
            ${manufacturingSteps.map((s,i) => `<a href="#manufacturing-${s.id}" aria-label="Stage ${i+1}: ${s.title}"${i === 0 ? ' aria-current="step"' : ''}><span>${String(i+1).padStart(2,'0')}</span></a>`).join('')}
          </nav>
          <p class="manufacturing-scroll-hint">Scroll to follow the process <span aria-hidden="true"><svg class="lucide lucide-arrow-down manufacturing-scroll-arrow" fill="none" focusable="false" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg></span></p>
        </aside>
        <ol class="manufacturing-steps">
          ${manufacturingSteps.map((s,i) => `<li class="manufacturing-step${i === 0 ? ' is-current' : ''}" id="manufacturing-${s.id}">
            <div class="manufacturing-step-content">
              <p class="manufacturing-step-number"><span>${String(i+1).padStart(2,'0')}</span> / 08</p>
              <h3>${s.title}</h3>
              <figure class="manufacturing-inline-image"><img src="../assets/images/process/${s.image}" alt="${s.alt}" loading="lazy" decoding="async"><figcaption><span>${s.state}</span><strong>${s.title}</strong></figcaption></figure>
              <p class="manufacturing-step-copy">${s.copy}</p>
              <div class="manufacturing-result"><span>What moves forward</span><p>${s.result}</p></div>
            </div>
          </li>`).join('')}
        </ol>
      </div>
    </div>
  </section>`;

const material = hero({crumb:'Wet-process hardboard',eyebrow:'Material platform',title:'Understand the Board Before Selecting the Grade',lead:'A technical overview of fibre, surface, manufacturing route and the controls that must be matched to each application.',image:'../assets/images/material/mat-04-hardboard-face-edge-back.webp',alt:'Hardboard smooth face, dense edge and mesh-pattern back',code:'MATERIAL',caption:'Smooth face · dense edge · mesh-pattern back',proofs:['<strong>APPLICATION SELECTION : </strong>Product suitability depends on the selected grade, dimensions, service conditions and customer qualification. Dry interior or protected use is the general baseline unless a separately validated grade is agreed.'],actions:[['Request a sample','request-a-quote.html'],['See the production route','#process',true,false]]}) +
  section(intro('Board anatomy','See the face, edge and back of the actual board.','Production photographs show the material surfaces and cut edge under consistent lighting.') + gallery([['../assets/images/material/mat-01-hardboard-smooth-face.webp','Smooth face of hardboard','01','Smooth face'],['../assets/images/material/mat-02-hardboard-edge-and-core.webp','Dense hardboard edge and core','02','Edge & core'],['../assets/images/material/mat-03-hardboard-mesh-back.webp','Mesh-pattern back of hardboard','03','Mesh-pattern back']]) + materialReference()) +
  manufacturingStory() +
  section(intro('Material & supply facts','Information for product selection and enquiry.',"These facts describe AAF's general hardboard platform. Order-specific requirements are confirmed in the quotation and controlled product documents.") + table(['Topic','Published information','Technical basis'],[['Surface','One smooth face / one mesh-pattern back','Standard board construction'],['Fibre source','100% plantation-grown eucalyptus sourced in Thailand','Manufacturing declaration'],['Forming route','Wet-process hardboard','Manufacturing declaration'],['Bonding mechanism','Natural lignin in the wood fibre provides the primary bonding mechanism','Manufacturing declaration'],['General supply range','1.6–6.0 mm · standard sheet 1220 × 2440 mm','Subject to order confirmation'],['Supply form','Raw sheets, rectangular cut-to-size, profile-cut components and selected 25 × 2050 mm strips','Confirmed at quotation']])) + cta('Select by application','Match the grade to the job, drawing and qualification method.','Discuss a requirement');

const qualityRows = [['Dimensions & thickness','1.6–6.0 mm · 1220 × 2440 mm · size tolerance ±3.0 mm','EN 324-1','Dimensional inspection'],['Density','900–1,100 kg/m³','EN 323','Laboratory report'],['Moisture content','4–9%','EN 322','Laboratory report'],['Bending strength (MOR)','≥38 N/mm² at ≤3.5 mm · ≥35 N/mm² at >3.5 mm','EN 310','Laboratory report'],['Modulus of elasticity (MOE)','≥3,500 N/mm² at ≤3.5 mm · ≥3,000 N/mm² at >3.5 mm','EN 310','Laboratory report'],['Internal bond','≥0.60 N/mm²','EN 319','Laboratory report'],['24-hour water response','Thickness swelling ≤35% · water absorption ≤65%','EN 317','Laboratory report'],['Visual / cut edge','Smooth face, mesh back and clean saw-cut finish','Visual inspection','Production record']];
const quality = hero({crumb:'Quality & compliance',eyebrow:'Evidence before claims',title:'Quality Information Buyers Can Trace',lead:'Laboratory testing, production inspection and controlled technical records support each hardboard grade and customer requirement.',image:'../assets/images/quality/qlt-01-hardboard-testing-laboratory.webp',alt:'AAF hardboard testing laboratory',code:'QLT-01',caption:'Hardboard testing laboratory',proofs:['Grade-specific data','Named test methods','Revision control','Production inspection'],actions:[['View document register','technical-resources.html'],['See test framework','#test-plan',true,false]]}) +
  section(intro('Laboratory & production evidence','Real samples, equipment and inspection activity.','The image set shows representative testing and quality-control activities without exposing customer documents or confidential screen data.') + gallery([['../assets/images/quality/qlt-02-mechanical-testing-machine.webp','Mechanical testing equipment','QLT-02','Mechanical testing'],['../assets/images/quality/qlt-03-thickness-dimension-inspection.webp','Thickness measurement','QLT-03','Thickness inspection'],['../assets/images/quality/qlt-04-moisture-content-test.webp','Moisture-content testing','QLT-04','Moisture test'],['../assets/images/quality/qlt-05-thickness-swelling-test.webp','Thickness-swelling test','QLT-05','Water-response test'],['../assets/images/quality/qlt-06-quality-control-team.webp','Production quality inspection','QLT-06','Production inspection']])) +
  section(intro('Published quality baseline','General requirements and named test methods.','Customer drawings, qualification reports, contracts and purchase orders take precedence for the applicable product.') + table(['Control','Published requirement','Method','Evidence'],qualityRows),'alt','test-plan') +
  section(intro('Certificate & test register','Current validity, scope and sample limitations.','Certificate metadata is shown for buyer verification. Controlled copies can be requested for a relevant grade or application.') + table(['Document','Issuer / reference','Scope / result','Status'],[['ISO 9001:2015','Bureau Veritas · TH025652','Manufacturing of hardboard','Valid to 19 Jul 2028'],['FSC Chain of Custody','SCS Global Services · SCS-COC-005645','AAF additional site SCS-COC-005645-Z','Valid to 27 Jun 2031'],['Flammability test','TÜV SÜD · AM/R22/0295-0101','5.5 mm submitted sample · PASS','Controlled copy'],['REACH SVHC test','Bureau Veritas · (2224)289-0005','Submitted hardboard sample · not detected','Controlled copy'],['Formaldehyde test','SGS · 6341436','5.5 mm submitted sample · not detected','Controlled copy']])) + cta('Need controlled evidence?','Request the current technical pack for your grade and application.','Request documents');

const about = hero({crumb:'About Us',eyebrow:'Advance Asia Fiber Company Limited',title:'Hardboard Manufacturing Backed by Raw-Material Confidence',lead:'AAF is a member of SHAIYO TRIPLE A GROUP and a Thailand-based manufacturer of wet-process eucalyptus hardboard under the Triple A Hardboard brand. The Group\'s established woodchip production and export network supports continuity and consistency in raw-material supply.',image:'../assets/images/company/com-01-advance-asia-fiber-factory-exterior.webp',alt:'Exterior of Advance Asia Fiber hardboard factory',code:'COM-01',caption:'Advance Asia Fiber manufacturing site',proofs:['Plantation-grown eucalyptus','Group-backed wood supply','Wet-process manufacturing','Major Thai seaport access'],actions:[['Start a conversation','contact-us.html'],['Company information','contact-us.html',true]]}) +
  section(intro('Why the group relationship matters','Confidence starts before the fibre reaches the production line.','AAF combines industrial hardboard manufacturing with the upstream experience and wood-supply network of SHAIYO TRIPLE A GROUP.') + groupRelationship([['Plantation-grown eucalyptus','Fibre sourced in Thailand.','Material origin'],['SHAIYO TRIPLE A GROUP','Established woodchip production and export network.','Group network'],['AAF manufacturing','Wet-process hardboard production.','Manufacturing'],['Thai seaport access','Export shipment planning.','Logistics'],['Customer application','Grade and drawing qualification.','Qualification']]),'alt group-relationship-section') +
  section(intro('Production & quality','The team behind production control and product inspection.','Manufacturing and quality personnel support process control, inspection and shipment preparation at the AAF factory.') + gallery([['../assets/images/company/com-04-production-quality-team.webp','AAF production and quality team','COM-04','Production and quality team']],false,'production-quality-gallery')) +
  section(groupSupplyStory(),'dark') +
  section(intro('Manufacturing site','A factory built around industrial hardboard production.','Factory exterior and production-line views establish the scale behind standard sheets and cut-to-size components.') + gallery([['../assets/images/company/com-01a-advance-asia-fiber-factory-aerial.webp','Aerial view of the AAF factory','COM-01A','Factory aerial view'],['../assets/images/company/com-02-hardboard-production-line.webp','Hardboard production line','COM-02','Hardboard production line']],true),'alt') +
  section(intro('Export packing & logistics','From finished sheets to a completed container load.','Packing and loading are planned around sheet format, bundle protection, bearer arrangement and container configuration.') + gallery([['../assets/images/logistics/log-01-hardboard-before-packing.webp','Hardboard before packing','LOG-01','Before packing'],['../assets/images/logistics/log-02-complete-export-bundle.webp','Protected export bundles','LOG-02','Export bundles'],['../assets/images/logistics/log-03-export-bundle-label.webp','Export bundle label','LOG-03','Identification'],['../assets/images/logistics/log-04-pallet-bearer-arrangement.webp','Pallet bearer arrangement','LOG-04','Bearer arrangement'],['../assets/images/logistics/log-05-container-loading-process.webp','Container loading process','LOG-05','Container loading'],['../assets/images/logistics/log-06-complete-container-loading.webp','Completed container load','LOG-06','Completed load']])) + cta('Talk to the application team','Share the end use, drawing, quantity and destination.');

const contact = hero({crumb:'Contact Us',eyebrow:'Sales, factory & enquiries',title:'Contact Us',lead:'Reach AAF’s Bangkok sales office or Chok Chai factory, or send a short request for information and online ordering.',image:'../assets/images/company/com-03-contact-technical-meeting-hero.webp',alt:'AAF contact table with paper and pen overlooking the wet-process factory',code:'COM-03',caption:'',actions:[['Send an email','mailto:info_aaf@saaa.co.th'],['Technical enquiry','request-a-quote.html',true,false]]}) +
  section(`<div class="contact-location-grid">
    <article class="contact-location-card">
      <div class="contact-card-heading"><p class="eyebrow">Sales office</p><span class="contact-card-tag">Bangkok</span></div>
      <h3>Advance Asia Fiber</h3>
      <p class="contact-location-address">140/6 ITF Tower 7th Floor Silom Rd., Suriyawong, Bangrak, Bangkok 10500, Thailand</p>
      <div class="contact-location-contact"><a href="tel:+66879420648"><svg aria-hidden="true" class="lucide lucide-phone" fill="none" focusable="false" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><span>+66 87 942 0648</span></a><a href="mailto:info_aaf@saaa.co.th"><svg aria-hidden="true" class="lucide lucide-mail" fill="none" focusable="false" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><rect height="16" rx="2" width="20" x="2" y="4"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg><span>info_aaf@saaa.co.th</span></a></div>
      <a class="contact-map-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=140%2F6%20ITF%20Tower%207th%20Floor%20Silom%20Rd.%2C%20Suriyawong%2C%20Bangrak%2C%20Bangkok%2010500%2C%20Thailand" target="_blank" rel="noopener" aria-label="Open the Sales office in Google Maps"><div class="contact-map"><img src="https://tile.openstreetmap.org/15/25534/15122.png" alt="Map preview around the Sales office in Bangkok" loading="lazy" decoding="async"><span class="contact-map-pin" aria-hidden="true"><svg class="lucide lucide-map-pin" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 1 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg></span><span class="contact-map-attribution">© OpenStreetMap contributors</span></div></a>
    </article>
    <article class="contact-location-card">
      <div class="contact-card-heading"><p class="eyebrow">Factory</p><span class="contact-card-tag">Chok Chai</span></div>
      <h3>Advance Asia Fiber</h3>
      <p class="contact-location-address">20–20/1 Moo 14, Chok Chai, Nakhon Ratchasima 30190, Thailand</p>
      <div class="contact-location-contact"><a href="mailto:info2_aaf@saaa.co.th"><svg aria-hidden="true" class="lucide lucide-mail" fill="none" focusable="false" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><rect height="16" rx="2" width="20" x="2" y="4"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg><span>info2_aaf@saaa.co.th</span></a></div>
      <a class="contact-map-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=Chok%20Chai%2C%20Chok%20Chai%20District%2C%20Nakhon%20Ratchasima%2030190%2C%20Thailand" target="_blank" rel="noopener" aria-label="Open the AAF factory in Google Maps"><div class="contact-map"><img src="https://tile.openstreetmap.org/15/25683/15028.png" alt="Map preview around the AAF factory in Chok Chai" loading="lazy" decoding="async"><span class="contact-map-pin" aria-hidden="true"><svg class="lucide lucide-map-pin" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 1 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg></span><span class="contact-map-attribution">© OpenStreetMap contributors</span></div></a>
    </article>
  </div>
  `,'alt','contact-details-section') +
  section(`<div class="contact-request">
    <div class="contact-request-copy">
      <p class="eyebrow eyebrow-light">Further information request</p>
      <h2>Online ordering and product questions.</h2>
      <p>Use the short form for general information, ordering questions or a call-back from Sales. For a technical quotation, include the application, dimensions and destination in the <a href="request-a-quote.html">technical enquiry form</a>.</p>
      <div class="contact-request-note"><span>Response route</span><strong>AAF Sales Team</strong><small>info_aaf@saaa.co.th</small></div>
    </div>
    <form class="enquiry-form contact-form" action="mailto:info_aaf@saaa.co.th?subject=Further%20information%20request" method="post" enctype="text/plain">
      <div class="field"><label for="contact-name">Name *</label><input id="contact-name" name="Name" placeholder="E.g. Kat" required></div>
      <div class="field"><label for="contact-email">Email *</label><input id="contact-email" name="Email" type="email" placeholder="E.g. mail@example.com" required></div>
      <div class="field full"><label for="contact-phone">Phone</label><input id="contact-phone" name="Phone" placeholder="E.g. +66 99999 9999"></div>
      <div class="field full"><label for="contact-message">Message *</label><textarea id="contact-message" name="Message" placeholder="Tell us what you need" required></textarea></div>
      <div class="field full"><button class="button button-primary" type="submit">Submit request ${arrow}</button></div>
    </form>
  </div>`, '', 'contact-request') + cta('Talk to the application team','Share the end use, drawing, quantity and destination.');

const documents = [['CERT-01','ISO 9001:2015','Current · valid to 19 Jul 2028<br>Bureau Veritas · TH025652 · manufacturing of hardboard','Request current copy'],['CERT-02','FSC Chain of Custody','Current · valid to 27 Jun 2031<br>SCS-COC-005645 · AAF additional site SCS-COC-005645-Z','Request current copy'],['TEST-01','Hardboard Flammability Test','Controlled copy on request<br>TÜV SÜD · AM/R22/0295-0101 · tested sample only','Request current copy'],['TEST-02','REACH SVHC Test','Controlled copy on request<br>Bureau Veritas · (2224)289-0005 · submitted sample','Request current copy'],['TEST-03','Formaldehyde Test','Controlled copy on request<br>SGS · 6341436 · 5.5 mm submitted sample','Request current copy'],['TDS-001','Master Hardboard Technical Data','Current summary online<br>General values are published online; request the controlled grade copy','Request current copy']];
const resources = hero({crumb:'Technical resources',eyebrow:'Controlled document centre',title:'Find the Right Technical Evidence',lead:'Current certificates are identified by issuer, scope and validity. Sample-specific reports are supplied through a controlled request.',actions:[['Request technical data','request-a-quote.html']]}) + section(intro('Document register','Current evidence for product and supplier review.','Certificate metadata is visible for buyer verification. Full reports are released according to document type, scope and the sample or grade being evaluated.') + `<div class="document-grid">${documents.map(d => `<article class="document-card"><span class="document-code" role="img" aria-label="PDF document">${pdfIcon}</span><div><p class="eyebrow">${d[0]}</p><h3>${d[1]}</h3><p>${d[2]}</p><a href="request-a-quote.html">${d[3]} ${arrow}</a></div></article>`).join('')}</div>`) + section(intro('Controlled document access','Request the copy that matches your application.','AAF confirms that the document applies to the requested product or submitted sample.') + features([['Select the document','Identify the certificate, test report or technical data needed.'],['Tell us the application','Provide grade, thickness, end use and customer specification.'],['AAF confirms scope','Quality or Sales checks that the evidence applies.'],['Receive the current copy','The controlled document includes its revision, validity and scope.']]),'alt') + cta('Cannot find the right document?','Tell us the application and specification you need to match.','Request technical data');

const quote = hero({crumb:'Request a quote',eyebrow:'Technical enquiry',title:'Tell us what the board needs to do.',lead:'Share the application, dimensions, annual requirement and destination. Your structured enquiry is prepared for the AAF Sales Team for review.'}) + section(`
  <div class="enquiry-layout">
    <aside class="enquiry-checklist">
      <p class="eyebrow eyebrow-light">Prepare before submitting</p>
      <ol>
        <li><span class="enquiry-step-number" aria-hidden="true">1</span><span>Application and component position</span></li>
        <li><span class="enquiry-step-number" aria-hidden="true">2</span><span>Thickness and dimensions</span></li>
        <li><span class="enquiry-step-number" aria-hidden="true">3</span><span>Quantity and annual consumption</span></li>
        <li><span class="enquiry-step-number" aria-hidden="true">4</span><span>Drawing or customer specification</span></li>
        <li><span class="enquiry-step-number" aria-hidden="true">5</span><span>Destination port and target timing</span></li>
      </ol>
      <div class="enquiry-support-note">
        <p class="eyebrow eyebrow-light">Drawings &amp; specifications</p>
        <p>You may attach one relevant drawing, specification or pallet layout directly in the form.</p>
      </div>
    </aside>
    <form class="enquiry-form" data-quote-form action="mailto:info_aaf@saaa.co.th?subject=Technical%20enquiry" method="post" enctype="text/plain">
      <div class="form-section-title">
        <span aria-hidden="true">01</span>
        <div><h2>Contact &amp; company</h2><p>Required fields are marked with *</p></div>
      </div>
      <div class="form-grid">
        <div class="field"><label for="name">Full name *</label><input id="name" name="name" autocomplete="name" placeholder="Your name" required></div>
        <div class="field"><label for="company">Company *</label><input id="company" name="company" autocomplete="organization" placeholder="Company name" required></div>
        <div class="field"><label for="email">Business email *</label><input id="email" name="email" type="email" autocomplete="email" placeholder="name@company.com" required></div>
        <div class="field"><label for="phone">Phone / WhatsApp</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="+66 ..."></div>
        <div class="field"><label for="country">Country *</label><input id="country" name="country" autocomplete="country-name" placeholder="Country" required></div>
        <div class="field"><label for="role">Buyer role</label><div class="select-control"><select id="role" name="role"><option value="" selected>Select role</option><option>Procurement / Sourcing</option><option>Engineering / Quality</option><option>Operations</option><option>Distributor / Importer</option><option>Other</option></select>${selectChevron}</div></div>
      </div>
      <div class="form-section-title">
        <span aria-hidden="true">02</span>
        <div><h2>Application &amp; dimensions</h2><p>These fields allow AAF to assess the request before replying.</p></div>
      </div>
      <div class="form-grid">
        <div class="field full"><label for="application">Application *</label><div class="select-control"><select id="application" name="application" required><option value="" disabled selected>Select application</option><option value="glass">Glass bottle layer pads</option><option value="coil">Steel &amp; aluminium coil packaging</option><option value="automotive">Automotive interior components</option><option value="building">Building / furniture / distribution</option><option value="other">Other application</option></select>${selectChevron}</div></div>
        <div class="field full"><label for="format">Product format *</label><div class="select-control"><select id="format" name="product_format" required><option value="" disabled selected>Select product format</option><option>Raw hardboard sheet</option><option>Rectangular cut-to-size panel</option><option>Profile-cut component to customer drawing</option><option>Hardboard packer strip — 25 × 2050 mm</option><option>Other / not yet defined</option></select>${selectChevron}</div></div>
        <div class="field"><label for="thickness">Thickness</label><input id="thickness" name="thickness" inputmode="decimal" placeholder="e.g. 3.0 mm"></div>
        <div class="field"><label for="dimensions">Sheet / component size</label><input id="dimensions" name="dimensions" placeholder="L × W × T mm"></div>
        <div class="field"><label for="quantity">Required quantity *</label><input id="quantity" name="quantity" placeholder="Sheets / m³ / containers" required></div>
        <div class="field"><label for="annual">Annual requirement</label><input id="annual" name="annual" placeholder="Estimated annual volume"></div>
        <div class="field"><label for="destination">Destination port / city *</label><input id="destination" name="destination" autocomplete="shipping country" placeholder="e.g. Buenos Aires" required></div>
        <div class="field"><label for="incoterm">Incoterm</label><div class="select-control"><select id="incoterm" name="incoterm"><option value="" selected>Select if known</option><option>EXW</option><option>FOB</option><option>CFR</option><option>CIF</option><option>Other</option></select>${selectChevron}</div></div>
        <div class="field"><label for="required-timing">Required timing</label><input id="required-timing" name="required_timing" placeholder="Sample / quote / delivery target"></div>
        <div class="field"><label for="current-material">Current supplier / material</label><input id="current-material" name="current_material" placeholder="Optional comparison context"></div>
        <div class="field full upload-field"><label for="attachment">Drawing or specification</label><input id="attachment" name="attachment" type="file" accept=".pdf,.xlsx,.docx,.jpg,.jpeg,.png" data-attachment-input aria-describedby="attachment-note"><small id="attachment-note">Optional · PDF, XLSX, DOCX, JPG or PNG · maximum 10 MB</small></div>
        <div class="field full"><label for="details">Additional details</label><textarea id="details" name="message" rows="5" placeholder="Tell us about the application, current material, required test or target delivery."></textarea></div>
      </div>
      <label class="rfq-honeypot" aria-hidden="true">Website<input tabindex="-1" autocomplete="off" name="website"></label>
      <label class="consent-field"><input type="checkbox" name="consent" required><span>I have read the <a href="privacy.html">privacy notice</a> and agree that AAF may use this information to respond to my technical or commercial enquiry. *</span></label>
      <div class="form-submit-row"><button class="button button-primary" type="submit">Submit technical enquiry ${arrow}</button><small>Your enquiry opens a prepared email to AAF. If you selected a file, attach it before sending.</small></div>
    </form>
  </div>`, 'alt', 'request-form');

const privacy = hero({crumb:'Privacy notice',eyebrow:'Privacy & enquiry information',title:'Website Privacy Notice',lead:'The technical-enquiry form uses the information you choose to send so that AAF can assess and respond to your request.',actions:[['Return to enquiry form','request-a-quote.html']]}) + section(`<div class="privacy-copy"><section><h2>1. Information you choose to send</h2><p>Your enquiry may include your name, company, business contact details, country, role, product and application requirements, destination, commercial requirements, and any drawing or specification you attach.</p></section><section><h2>2. How AAF uses enquiry information</h2><p>Advance Asia Fiber Company Limited uses the information to assess and respond to technical or commercial enquiries, review manufacturing capability, prepare samples or quotations, and maintain the resulting business correspondence.</p></section><section><h2>3. Drawings and confidential information</h2><p>Only send files that you are authorised to share. Mark confidential drawings clearly and avoid personal information that is not needed for the enquiry.</p></section><section><h2>4. Sharing and retention</h2><p>Enquiry information may be shared within AAF and with relevant SHAIYO TRIPLE A GROUP personnel who support sales, engineering, quality, production or logistics. Records are retained only as needed for the enquiry, an active customer relationship, legal obligations or legitimate business records.</p></section><section><h2>5. Questions or requests</h2><p>For privacy questions, access or correction requests, or a request to delete enquiry information where applicable, contact AAF at <a href="mailto:info_aaf@saaa.co.th">info_aaf@saaa.co.th</a>.</p></section></div>`);

const pages = {...Object.fromEntries(Object.entries(solutionPages).map(([key,value]) => [key,renderSolution(value)])), 'wet-process-hardboard':material, 'quality-compliance':quality, 'about-us':about, 'contact-us':contact, 'technical-resources':resources, 'request-a-quote':quote, privacy};
if (root && pages[page]) {
  root.innerHTML = pages[page];
  initHeroHeading();
  initSubpageInteractions(root, page);
}
