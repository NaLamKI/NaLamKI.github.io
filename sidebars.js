// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure. 
  // We create a sidebar manually

  tutorialSidebar: [
    'intro',
    'itu-reference',
    {
      type: 'category',
      label: 'User Perspective',
      link: { type: 'doc', id: 'user-perspective/overview' },
      items: [
        'user-perspective/overview',
        'user-perspective/farmers_workflow',
        'user-perspective/results_monitor',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      link: { type: 'doc', id: 'getting-started/overview' },
      items: [
        'getting-started/overview',
        'getting-started/starterkit',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      link: { type: 'doc', id: 'architecture/overview' },
      items: [
        'architecture/overview',
        'architecture/dataflow',
        {
          type: 'category',
          label: 'SDK',
          link: { type: 'doc', id: 'architecture/sdk/overview' },
          items: [
            'architecture/sdk/overview',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Development',
      link: { type: 'doc', id: 'development/overview' },
      items: [
        'development/overview',
        'development/building-with-starterkit',
        'development/data-structures-visualization',
        {
          type: 'category',
          label: 'Configuration',
          items: [
            'development/configuration/dashboard-blueprint',
          ],
        },
        {
          type: 'category',
          label: 'Deployment',
          link: { type: 'doc', id: 'development/deployment/overview' },
          items: [
            'development/deployment/overview',
            'development/deployment/edge',
          ],
        },
      ],
    },
    'faq'
  ],
};

export default sidebars;
