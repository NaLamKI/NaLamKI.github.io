// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure. 
  // We create a sidebar manually

  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: { type: 'doc', id: 'getting-started/starterkit' }, // Set starterkit as the main page
      items: [
        'getting-started/starterkit',
        'getting-started/data-structures',
        'getting-started/own-service',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      link: { type: 'doc', id: 'architecture/overview' }, // Set overview as the main page
      items: [
        'architecture/overview', 
        'architecture/farmer_workflow', 
        'architecture/results_monitor',
        'architecture/dataflow', 
        'architecture/semantics'
        ],
    },
    {
      type: 'category',
      label: 'SDK',
      link: { type: 'doc', id: 'sdk/overview' }, // Set overview as the main page
      items: [
        'sdk/overview',
        'sdk/nalamki-service',
        'sdk/using-the-starterkit',
        'sdk/dashboard-blueprint',
        'sdk/data-model',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      link: { type: 'doc', id: 'deployment/overview' }, // Set overview as the main page
      items: [
        'deployment/overview',
        'deployment/docker',
        'deployment/kubernetes',
        'deployment/edge'
        ],
    },
    'faq'
  ],
};

export default sidebars;
