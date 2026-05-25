// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'welcome',

    {
      type: 'category',
      label: 'Why AgriFoodData',
      link: { type: 'doc', id: 'why/overview' },
      items: [
        'why/the-problem',
        'why/un-standard',
        'why/open-standards-backbone',
        'why/production-use',
        'why/open-source',
      ],
    },

    {
      type: 'category',
      label: 'Concepts',
      link: { type: 'doc', id: 'concepts/overview' },
      items: [
        'concepts/architecture-overview',
        {
          type: 'category',
          label: 'The four APIs',
          link: { type: 'doc', id: 'concepts/apis/overview' },
          items: [
            'concepts/apis/farm-api',
            'concepts/apis/sensor-things-api',
            'concepts/apis/spatio-temporal-api',
            'concepts/apis/activity-api',
          ],
        },
        'concepts/digital-farm-twin',
        'concepts/data-model',
        'concepts/service-registry',
        'concepts/iam',
        'concepts/data-sovereignty',
        'concepts/standards-interoperability',
      ],
    },

    {
      type: 'category',
      label: 'Quickstart',
      link: { type: 'doc', id: 'quickstart/overview' },
      items: [
        'quickstart/first-ai-service',
        'quickstart/push-sensor-reading',
        'quickstart/fetch-data-rest',
      ],
    },

    {
      type: 'category',
      label: 'Build Your Service',
      link: { type: 'doc', id: 'build/overview' },
      items: [
        {
          type: 'category',
          label: 'AI Services',
          link: { type: 'doc', id: 'build/ai-services/overview' },
          items: ['build/ai-services/overview'],
        },
        {
          type: 'category',
          label: 'Data Apps',
          link: { type: 'doc', id: 'build/data-apps/overview' },
          items: ['build/data-apps/overview'],
        },
        {
          type: 'category',
          label: 'Sensor Integration',
          link: { type: 'doc', id: 'build/sensor-integration/overview' },
          items: ['build/sensor-integration/overview'],
        },
        {
          type: 'category',
          label: 'Frontend & Dashboards',
          link: { type: 'doc', id: 'build/frontend-dashboards/overview' },
          items: ['build/frontend-dashboards/overview'],
        },
      ],
    },

    {
      type: 'category',
      label: 'API Reference',
      link: { type: 'doc', id: 'api-reference/overview' },
      items: [
        'api-reference/farm',
        'api-reference/sensor-things',
        'api-reference/activity',
        'api-reference/spatio-temporal',
        'api-reference/integrations',
        'api-reference/service-registry',
        'api-reference/iam',
      ],
    },

    {
      type: 'category',
      label: 'Operate',
      link: { type: 'doc', id: 'operate/overview' },
      items: [
        'operate/local-dev',
        'operate/deployment',
        'operate/observability',
        'operate/security',
        'operate/backup',
      ],
    },

    {
      type: 'category',
      label: 'Examples & Case Studies',
      link: { type: 'doc', id: 'examples/overview' },
      items: [
        'examples/geoai-telangana',
        'examples/acrat',
        'examples/apple-yield',
        'examples/drone-john-deere',
        'examples/soil-moisture',
      ],
    },

    {
      type: 'category',
      label: 'Ecosystem & Community',
      link: { type: 'doc', id: 'ecosystem/overview' },
      items: [
        'ecosystem/the-ecosystem',
        'ecosystem/contribute',
        'ecosystem/submit-service',
        'ecosystem/governance',
        'ecosystem/roadmap',
      ],
    },

    'faq-troubleshooting',
  ],
};

export default sidebars;
