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
      items: [
        'getting-started/starterkit',
        'getting-started/data-structures',
        'getting-started/own-service',
      ],
    },
    // excluded in current version, because we do not have enough 
    // content aka are not far enough in publishing aspects of the architecture
    /*{
      type: 'category',
      label: 'Architecture',
      items: [
      "architecture/dashboard",
      "architecture/data"
      ],
    },*/
    {
      type: 'category',
      label: 'SDK',
      items: ['sdk/overview'],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: ['deployment/overview'],
    }
  ],
};

export default sidebars;
